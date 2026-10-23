# Rock-Mod

**Rock-Mod** is a versatile and powerful framework designed for cross-platform mod development for Grand Theft Auto (GTA) servers. **VIMP** is the primary and recommended multiplayer platform; **RageMP**, **AltV**, and **Mock** are also supported. **RockSandbox** wraps native server events, player/world state, queued commands, cylinder colshapes, blips and ground markers; its other game APIs and client remain throwing stubs.

### Installation

To get started, simply install the package:

```bash
npm install rock-mod
```

To build this checkout locally, keep the compatible `rock-sandbox-types` checkout
beside `rock-mod`, then install dependencies and build:

```sh
npm --prefix ../rock-sandbox-types ci
npm ci
npm run build
```

The unpublished `@rock-sandbox/types` package is a dependency through
`file:../rock-sandbox-types`. Its declarations are consumed directly; there is
no separate types build. The SDK imports named types from `/server` without
installing global RockSandbox declarations. Platform wrapper declarations refer
to these types, so consumers need the package installed; compiled JavaScript
does not load it. Existing CI and release
automation need a follow-up change to provide the neighboring checkout.

### Usage

On the server-side, initialize Rock-Mod with the appropriate multiplayer type:

```typescript
const rockMod = await RockMod.create({
  multiplayer: "VIMP", // recommended; also supports "RageMP", "AltV", and "Mock"
});
```

### Multiplayer Types

Rock-Mod recognizes five multiplayer types:

1. **VIMP** - Primary and recommended platform for developing mods for VIMP servers
2. **RageMP** - For developing mods for RageMP servers
3. **AltV** - For developing mods for AltV servers
4. **Mock** - For testing and development without multiplayer dependencies
5. **RockSandbox** - Native server events, player/world state, cylinder colshapes, blips and ground markers; other game operations remain stubs

### RockSandbox scaffold

Select `RockSandbox` on the server:

```typescript
import { RockMod } from "rock-mod";

const rockMod = await RockMod.create({ multiplayer: "RockSandbox" });
```

On the client, import `RockMod` from `rock-mod/client` and use the same option.
Initialization requires no game runtime and creates explicit platform managers.
Structural components such as `net.events`, `net.rpc`, `net.dataHandler` (client only)
and entity manager iterators are accessible.

On the server, `net.events.onInternal`, `offInternal` and `emitInternal` delegate
to the native `rockSandbox.on`, `off` and `emit` API. Rock-mod has no separate
event registry or fallback implementation. These methods require the embedded
Rock Sandbox runtime; creation of RockMod itself still works without a host.
After updating the native API, rebuild the server bundle in rock-sandbox:

```sh
python3 scripts/nodejs.py build
```

Delivery is synchronous, preserves argument references and registration order,
and propagates synchronous handler exceptions. Duplicate subscriptions are
independent; removal affects the last matching registration. Handler changes
during dispatch take effect on the next dispatch, including a nested one.
An event without listeners is valid.

The first SDK subscription to `rm::playerConnected`, `rm::playerQuit`, `rm::playerDisconnected` or
`rm::playerDeath` installs all three native bridges once for that host API object. Each bridge only
applies the existing player wrapper and emits the corresponding SDK event in
the native registry. User handlers keep their original identity for `offInternal`;
there is no polling or additional handler registry.

The host records admission and removal in processing order, including both
transitions between snapshot publications. Queries, native events, and SDK events
share the same player identity through the wrapper. Late subscriptions receive
future transitions; use `players.iterator.all()` for existing players.

Event properties read the latest published state. Even `rm::playerConnected`
may receive an already absent player: `isExists` is false and `name`/`position`
throw. In `rm::playerDisconnected` lookup returns null while ID and type remain
readable. Host-event handler exceptions stop the server with a diagnostic; local
`emitInternal` exceptions propagate synchronously to the caller.

`rm::playerDeath(player, reason, killer)` now forwards native deaths from
`setHealth(0)` and combat. Reasons are RockSandbox native codes: **0** for scripted
health zero, **1** pistol, **2** MP5, **3** shotgun. They are not GTA weapon hashes.
The killer is null for scripted deaths and the actual wrapped shooter for combat,
even if already disconnected when delivered. Both supplied handles preserve
identity; the bridge never looks them up again or computes gameplay data.

Native `playerDeath` additionally supplies a fresh frozen historical context with
exact bigint `life` and `tick`. SDK keeps its existing three-argument signature.
Getters read the latest published state: an old death may arrive after respawn or
removal. Native FIFO preserves every actual death and its order before subsequent
disconnects, including multiple deaths between publications. Repeated assignments
to dead players, protected/nonlethal damage, spawns, moves and policy changes add
no deaths. Late subscriptions do not replay delivered history. Host-handler errors
stop the server, while local custom emit errors still propagate to the caller.
There is no polling, filtering, extra handler registry or SDK game state.

Entity lifecycle events and full gamemod gameplay persistence remain a later
stage. Offline `--ticks` produces no player events, and shutdown synthesizes no
disconnects. Client events now delegate to the native transport (see below). Native SDK RPC helpers and unsupported game operations still throw an `Error` identifying the platform, side, class and member:

```typescript
import { WeatherTypeEnum } from "rock-mod/shared";

rockMod.world.setWeather(WeatherTypeEnum.RAIN);
// Error: [RockSandbox:server] RockSandboxWorld.setWeather: expected clear, cloudy or overcast as a primitive string
```

The server player manager delegates to native `rockSandbox.players`. It supports
`findByID`/`getByID`, exact `findByName`/`getByName` (the smallest ID wins for
identical names), and `iterator.all()`. Lookups and iteration return the same
wrapper for each connected native player. `find*` returns `null` when absent;
`get*` throws. Iterator membership is captured when `all()` is called.

`player.socialClub` directly returns native `player.profileId`, formatted as
`rock-sandbox:profile:<UUID v4>`. This temporary **unverified local profile ID**
survives reconnects/restarts while the native client's `profile-id` file is kept.
Deleting or copying that file changes or shares the identity. It provides no
proof of account ownership and must not enable production remembered-session
authorization. Validation, file persistence and admission belong to RockSandbox;
the SDK only forwards the getter and its errors. Social Club search remains a
stub. Rebuild the server/addon with **ABI 24** and clients with **game protocol 24**.

Players expose `id`, `type`, `isExists`, `name`, and `position`. After disconnect,
`id` and `type` remain available, `isExists` is `false`, and `name`/`position`
throw the native disconnected-player error. Position is a fresh `Vector3D` in
**Z-up** coordinates: engine `(x, y, z)` becomes `(x, -z, y)`. This is a rotation,
not a reflection. Positions already returned remain unchanged. Unsupported mutations, Social Club lookup, dimension/range iterator filters and other managers still
throw their existing stub errors.

`player.kick(reason?)` delegates directly to the native player. It queues removal
on the server thread and returns `undefined`; state changes appear on the next
published snapshot, followed by `rm::playerQuit` and `rm::playerDisconnected`. Repeated requests keep
the first reason, and absent players are ignored. No SDK queue or gameplay state
is added.

Omitted, undefined or empty reasons use `Kicked by server`; other text is
preserved exactly, up to 1024 UTF-8 bytes. Native validation, a full command
queue or an unavailable runtime can throw synchronously. Validation also runs
for absent players. Catching a queue-full error lets the server continue.
Pending commands are discarded during shutdown. Reasons use the reliable
control channel with a one-second delivery interval; a lost connection can
prevent delivery. Server and clients must use **game protocol 24**.

`player.setPosition(position)` rotates SDK Z-up `(x, y, z)` into engine
`(x, z, -y)` and delegates to the native handle. Native validation and errors
propagate unchanged. It copies coordinates into the same bounded FIFO as kick;
repeated moves remain separate commands. Reads change after the next successful
host publication, including passes without a physics tick. Numeric coordinates
must remain finite and strictly below 1,000,000 in magnitude after `f32`
conversion. Invalid arguments, a full queue or a closed runtime throw
synchronously; a valid request for an absent player is ignored.

The native operation clears velocity, movement, ladder state and old controls,
preserving ID, wrapper identity, health, weapon, ammunition and life. A seated
player is detached without moving the car or other occupants; a driver stops
applying previous car commands. Dead players keep disabled physics and their
death deadline, with automatic respawn anchored at the new point. No extra
lifecycle events are emitted. Clients correct on the next regular simulation
snapshot; simulation pauses delay correction until resumption. Later physics,
terrain loading and world-bound recovery still apply. Other entity types retain
their existing `setPosition()` stubs. Other unsupported mutations remain stubs.

`player.health` and `player.isDead` directly read the native published state.
There is no SDK calculation or cached life state. Both throw after removal or
runtime shutdown, like native position.

`player.spawn(position)` rotates SDK `(x, y, z)` into engine `(x, z, -y)` and
calls native spawn. It copies coordinates into the same bounded FIFO and uses
the same validation/errors as movement, without coalescing repeated calls.
Publication is deferred until a successful host pass, including zero-tick passes.
Each execution begins a new life, even for a live player, with **100 health**,
selected weapon and ammunition preserved, weapon holstered, old combat timers
reset and two seconds of simulation-tick protection. It enables the existing
body at the exact point and clears movement, velocity, ladder, old controls and
the previous death anchor. It detaches only this player, preserving car pose,
velocity and other occupants, and stops former driver commands.

IDs and handle/wrapper identities remain stable. Old inputs/actions are excluded
by life/generation; there are no additional lifecycle events. Clients correct on
the next regular simulation snapshot. Automatic respawn stays at three seconds
with its existing default loadout/ammunition reset when enabled; delay
configuration is future work.
Gamemod lifecycle integration remains a separate stage. Other entities and
existing platforms keep their behavior. Protocol is **20**.

`player.setHealth(value)` delegates directly to the native handle, with no SDK
validation, clamping, queue or cached state. Native accepts only integer numbers
**0..100** without coercion, throwing synchronously for invalid arguments, a full
queue or a closed runtime. Arguments are validated even for absent players;
valid absent-player calls are ignored. It returns `undefined` and uses the shared
1024-command FIFO without coalescing. Reads retain the previous published state
until a successful host pass, including zero-tick passes; clients update on the
next regular snapshot with the existing equal-tick and pause rules.

Life is checked at execution: dead-player assignments never revive or extend the
death wait. `spawn(point); setHealth(50)` works even when the published player is
dead; `setHealth(0); setHealth(50)` leaves a live player dead. Positive health
preserves movement/velocity, controls, ladder, seat, life/generation, weapon/ammo
and combat timers. Assignments bypass protection while preserving its deadline;
regular damage still respects it.

The first zero starts death with disabled physics, zero movement/velocity and
cleared controls, aim and ladder. RockSandbox records the death anchor and
three-second simulation-tick respawn deadline, increments generation once and
preserves life, loadout and command numbering. A dead occupant keeps their seat
and follows the car; both server and Rust prediction reject dead driver controls.
The car and other occupants are untouched. Automatic respawn retains free-space
checks, which can delay revival inside a car; manual spawn still unseats the
player. A transition to death emits `playerDeath`; no hit event is synthesized.
Pending commands are discarded on stop.

`player.autoRespawn` and `player.setAutoRespawn(enabled)` directly delegate to the
native published getter and queued command, without SDK checks, timers or cached
state. Native accepts only primitive booleans, defaults each connection to **true**,
and validates even for absent players. Invalid/missing arguments, a full queue or
a closed runtime throw synchronously; valid absent-player calls do nothing. The
command returns `undefined` and uses the shared 1024-command FIFO without merging
repeated changes. Reads retain the previous mode until successful publication,
including zero-tick passes, and throw after removal or runtime shutdown.

Turning automatic respawn off leaves dead players waiting for manual `spawn()` or
re-enabling. Enabling preserves the original death anchor and three-second
simulation-tick deadline; if overdue, the engine retries on the next physics tick
using existing free-space checks. A zero-tick pass does not start a life. Manual
spawn works in either mode; policy persists through deaths and manual/automatic
lives. Other admissions do not reset it; a reconnect gets `true`.

Changing policy alone preserves health, life/generation, physics/movement,
controls, ladder/seat, combat state/loadout and death anchor/deadline, without new
events. The native engine owns the policy outside the wire snapshot and client
prediction. Protocol is **20**. The server `IPlayer` interface exposes both
members; RageMP, VIMP, AltV and Mock explicitly throw for these new operations.
Delay configuration and gamemod lifecycle integration remain later stages.

Player queries require the server and addon rebuilt together with **ABI 24**.
ABI 24 also requires the Node-thread interrupt shutdown and actual V8 termination
guard; rebuild the complete Sandbox bundle. Dimensions add public getters/setters and extend game protocol **24**. Closed-host errors and
local exception identity are preserved.

Before networking starts and in offline `--ticks` mode the player list is empty.
The adapter uses one internal `getRockSandbox()` getter for player and event
calls. It reads the current host without validation or caching. Missing hosts
or called methods produce standard JavaScript errors; errors from native
methods propagate unchanged. The gamemod bootstrap validates runtime
compatibility before initialization. Creating RockMod and accessing the
iterator never queries the host.

Run `npm run test:rock-sandbox` for focused adapter checks using Node's built-in
test runner. For the real-UDP embedded Node check, see the neighboring
`rock-sandbox/docs/nodejs-server.md` and its `ROCK_PLAYERS_TEST_SDK` option.

Unimplemented methods returning `Promise` also throw synchronously when called.
The scaffold does not simulate game state or automatically subscribe to host
events during construction.

### Mock Mode

Mock mode provides a complete mock environment for testing your mods without requiring a multiplayer server. It includes:

- Full entity hierarchy (BaseObject, WorldObject, Entity)
- All entity types (Blip, Colshape, Marker, Object, Ped, Player, Vehicle)
- Type-safe events and RPC system
- In-memory state management
- Player connection simulation

Example using Mock mode for development:

```typescript
import { RockMod } from "rock-mod";

// Initialize in Mock mode
const rockMod = await RockMod.create({
  multiplayer: "Mock",
});

// Subscribe to events
rockMod.net.events.on({
  "rm::playerConnected": (player) => {
    console.log(`Player ${player.name} connected`);
  },
  "rm::playerDisconnected": (player) => {
    console.log(`Player ${player.name} disconnected`);
  },
});

// Register RPC handlers
rockMod.net.rpc.register("getPlayerInfo", (player) => {
  return {
    id: player.id,
    name: player.name,
    position: player.position,
  };
});
```

Example using Mock mode for testing:

```typescript
import { TestRockMod } from "rock-mod/testing";

// Initialize test environment
const rockMod = await TestRockMod.create({
  multiplayer: "Mock",
});

// Simulate player connection
const player = rockMod.simulatePlayerConnect({
  name: "TestPlayer",
  position: { x: 0, y: 0, z: 0 },
  health: 100,
});

// Test your mod logic here
// ...

// Simulate player disconnection
rockMod.simulatePlayerDisconnect(player);
```

### Features

- **Cross-Platform Support**: Write once, run on any supported platform
- **Type Safety**: Full TypeScript support with proper type definitions
- **Entity Management**: Unified API for managing game entities
- **Networking**: Type-safe events and RPC system
- **Testing**: Dedicated testing API through `rock-mod/testing`
- **Modular Design**: Easy to extend and customize

### Documentation

Client-side implementations are available for RageMP and VIMP. RockSandbox has
native server internal events, player state and queued player commands, with remaining
client/server APIs implemented as throwing stubs; AltV
and Mock remain server-only.

Rock-Mod simplifies multiplayer mod development by providing unified tools for managing game entities, networking, and more across different platforms.

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### License

This project is licensed under the MIT License - see the LICENSE file for details.

## Player dimensions

The SDK player getter and setter delegate directly to the native handle. Generic
entity dimension methods and iterator dimension filters retain their stubs.

`player.dimension` reads the latest published unsigned 32-bit world number;
`player.setDimension(value)` queues a change in the native FIFO. Only primitive
integers from `0` to `4294967295` are accepted. Invalid arguments, a full command
queue or a closed host throw synchronously, including validation for disconnected
handles. Valid commands for absent players are ignored. Reads change after the
next successful host publication, including a pass without a physics tick.

Dimensions follow VIMP's single-world model. Static map geometry and static
ladders are shared; scene cars and other authored dynamics exist once in world
`0`. Players see, collide with, shoot and use dynamics only in their own world.
The public API changes only players. Native player lookup and the connection
roster stay global; changing visibility emits no lifecycle event.

A real change detaches only that occupant from a vehicle and retires old controls
by advancing the state generation. It preserves identity, position, orientation,
life, health, loadout, combat timers, automatic-respawn policy, walking momentum
and a shared static ladder. The car and its other occupants keep their state.
Setting the current dimension is a complete no-op. Death remains death, with the
same respawn deadline and a new anchor at the current position; automatic respawn
checks free space in the current dimension. Manual/automatic respawns and moves
preserve the dimension; a new connection starts in `0`.

Snapshots are filtered per recipient. A separate monotonically increasing view
revision advances on every real change, even an away-and-back FIFO sequence
between publications. A new view commits on a full snapshot with a new tick;
older snapshots/events/replies are discarded and future replies wait in a bounded
256-entry queue (overflow disconnects with a diagnostic). Existing same-tick and
pause rules remain; client visibility changes on the next normal simulation
snapshot. Streamed players and cars outside the interest area have no client
instances; their authored descriptions are retained for re-entry. Other scene
dynamics keep the existing dimension-based hiding behavior. The authoritative
world retains one instance of each entity.

Rebuild **server, addon and clients together**: this requires native **ABI 24**
and **game protocol 24** (protocol 18 clients are rejected). ABI 11's safe Node
shutdown and N-API termination handling are retained. Vehicle/object dimension
setters, new host events, client JavaScript and gamemod lifecycle adaptation are
separate stages.

```js
rockSandbox.on("playerConnected", (player) => {
  player.setDimension(42);
  // Still reads the preceding published snapshot here.
  console.log(player.id, player.dimension);
});
```

Server/client streaming uses **game protocol 24** and server/addon **ABI 24**
(the global native player snapshot now holds up to 128 players). Rebuild all
three binaries together. The public scripting API is unchanged: player lookup
and connection/death events remain global, independent of a client's cell-based
interest area. Moving out of view removes client instances, not authoritative
entities or native/SDK handles. Safe Node termination from ABI 11 is retained.

## RockSandbox client events

`net.events.onClient/offClient`, `emitClient/emitAllClients` and
`player.emitEvent` now delegate to RockSandbox's native JSON transport. The SDK
installs one lazy `clientEvent` bridge per host, wraps the sender, then emits
`rm::client:<name>` in the native local registry. User callbacks keep their
original identity, including duplicates and `off`. The SDK adds no serializers,
queues, handler registry, validation, polling or game state.

Messages are connection-scoped and independent of cell streaming/dimensions.
Arguments use standard JSON array serialization: undefined/function/symbol
array entries and nonfinite numbers become null, undefined object fields are
omitted, `toJSON` runs, and cycles/BigInt throw. Native limits are 128 UTF-8 bytes
for names, 32 arguments, 64 KiB JSON and nesting 64. Emit success means queued,
not delivery-confirmed; broadcasts capture current recipients. Synchronous
incoming-handler failures log event/player, stop that event and allow later
messages. Lifecycle errors remain fatal; local emit keeps exception identity.

Rebuild the native server/addon for **ABI 24** and Rust clients for **protocol
21**. Gamemod's existing event-based RPC adapters use this transport; SDK native
RPC helpers and client JavaScript remain unsupported. See the native
[API and queue limits](../rock-sandbox/docs/nodejs-server.md#custom-client-events).

### RockSandbox world time

`rockMod.world.time` and `setTimeHour`, `setTimeMinute`, `setTimeSecond` directly
delegate to native `rockSandbox.world`; the SDK keeps no clock, timer, validation
or fallback state. Native time snapshots are frozen. Strict integer component
ranges are 0..23 / 0..59; writes enter the shared FIFO and getters update after
publication, including passes without a physical tick. Component setters keep
the other fields at execution time and leave the native time mode unchanged.
Select `rockSandbox.world.setTimeMode("external")` when a mod supplies its own
time; returning to `"automatic"` resumes the authored simulation rate without
a jump. Gamemod makes this selection before bootstrap and retains WorldService's
timer. Other platforms/common interfaces stay unchanged; three native weather presets are now supported.
Requires server/addon **ABI 24** and clients **protocol 24**, rebuilt together.
See [native world time](../rock-sandbox/docs/world-clock.md).

### RockSandbox world weather

`world.weather` and `world.setWeather()` delegate to the native world API with
fixed name translations: `CLEAR` ↔ `clear`, `CLOUDS` ↔ `cloudy`, `OVERCAST` ↔
`overcast`. Other values pass unchanged into native validation and throw; rain,
snow and other unsupported types are not replaced by approximate presets. The
SDK keeps no weather state, validation, timers or interpolation.

Native `setWeather()` selects external mode and applies the preset at the next
successful publication, including a pass without a physical tick. Getters retain
the previous snapshot until then. During an automatic transition the getter
reports the target preset. Native `setWeatherMode("external")` holds the mixture;
`setWeatherMode("automatic")` returns to the current simulation forecast phase.
Common SDK interfaces and other platform adapters retain their behavior.
Rebuild server/addon (**ABI 24**) and clients (**protocol 24**) together. See the
[native contract and checks](../rock-sandbox/docs/world-weather.md).

### RockSandbox cylinder colshapes

`colshapes.createCylinder({ position, range, height, dimension, key? })`, ID lookup,
`iterator.all()`, `getParticipants()`, and cylinder ID/type/existence/key/position/
dimension/mutation/destruction delegate to native RockSandbox. The wrapper rotates
SDK `(x,y,z)` to engine `(x,z,-y)` and maps `range` to native `radius`. Handles are
cached by native identity; geometry, membership and queues belong to Sandbox.

Creation returns a searchable handle with initial properties immediately. Later
writes use the shared FIFO and read back after publication. Zones are centered,
test the player's point (including dead/seated players) in the exact dimension,
and create no physics bodies. A native dimension-scoped multilevel cell index
selects candidates before exact geometry checks.

On the first subscription to any player/colshape lifecycle event, all five native
bridges are installed once for that host API. `playerEnteredColshape` and
`playerLeftColshape` only wrap native handles and emit the matching `rm::` event;
original SDK handlers remain registered in the native registry. Destruction emits
exits before retirement; getters read the latest state and can already report
absence. Native events retain intermediate transitions and object identity.

Other shapes, iterator filters and `getNetData`/`setNetData` remain explicit stubs.
This requires the rebuilt native server/addon **ABI 24**; game protocol stays 24.

### RockSandbox blips (ABI 24 / protocol 24)

The server blip manager now delegates creation, lookup, iteration, state and its
existing mutations to native blips. SDK `(x,y,z)` becomes engine `(x,z,-y)`;
rotation is unchanged. WeakMap wrappers preserve native identity. No SDK queue
or state cache is added. Palette setters send RGB only, preserving native alpha
at execution time. Unsupported GTA sprites/palette indices and unmappable native
RGB throw synchronously.

Supported sprite mappings: 1 point, 40 house, 52 basket, 59 building, 71 scissors,
72 gear, 73 shirt, 75 needle, 93 glass, 225 steeringWheel, 326 car, 350 houseSale,
361 fuelPump, 437 flag, 446 wrench, 921 pistol. Palette indices: 0, 1, 2, 3, 4, 5,
17, 27, 29, 51, 83. The fixture covers all 25 current gamemod presets. Other
iterator filters and client JS remain throwing stubs. Ground forms use the native marker API below.

Native changes publish after the next successful server pass, including without
a physics tick. Local blips stream by world cells; global bypasses distance but
never dimension. The Rust radar renders named glyphs on a north-up 200m panel.
Server, standalone addon and clients must be rebuilt together.

### RockSandbox ground markers (ABI 24 / protocol 24)

`markers.create`, ID lookup and `iterator.all()` delegate to native markers and
preserve wrapper identity via WeakMap. The 16 gamemod presets map SDK types
`0 -> cone`, `1 -> cylinder`, `27 -> ringArrows`; unsupported types throw a clear
mapping error. Type 27 never implies rotation. Native state, queueing, validation
and retirement stay in RockSandbox. Other platform adapters remain unchanged.

Position and rotation map SDK `(x,y,z)` to engine `(x,z,-y)`; reads use
`(x,y,z) -> (x,-z,y)`. Native angles compose as `Ry(y) * Rx(x) * Rz(z)`. Getters
read fresh published state, with changes visible after a successful host pass,
including one without a physics tick. RGB without alpha resets marker alpha to
255 on create/setColor, preserving existing marker adapter behavior. Blip color
semantics remain unchanged.

Scale 1 means diameter 1 metre and cone/cylinder height 1 metre, with a bottom
anchor. The cone points down, the cylinder is an open wall, and the ring with
arrows lies in XZ. Unlit RGBA uses depth testing and transparency without shadows,
physics, automatic ground alignment, camera alignment or animation. Invisible
markers remain in the native server pool. Cell AOI, dimensions and hysteresis
share the existing annotation stream with blips: one atomic transaction/ACK and
one combined 1/8 bandwidth reserve. Rebuild server/addon and clients for
**ABI 24 / protocol 24**. See [native markers](../rock-sandbox/docs/markers.md).

## Native static objects (ABI 24 / protocol 24)

`rockSandbox.objects.create({ model: "prop_rock_4_b", position: {x: 4,y: 0,z: 4}, collidable: true })`
creates a catalog-backed static object. Defaults: zero rotation, dimension 0,
alpha 255, collisions disabled. The original name/alias is `model`; `modelHash`
is its unsigned JOAAT32 compatibility hash. Collections and handles preserve
identity globally, including pending creations. Initial getters are immediate;
subsequent FIFO changes appear after publication, including passes without ticks.

Use `setPosition`, `setRotation`, `setDimension`, `setAlpha`, `getNetData`,
`setNetData`, `destroy`. Model and collidable are immutable. Metadata is ordinary
JSON: undefined removes, missing returns undefined, snapshots are deeply frozen.
Limits are 32 keys, key size 1..128 UTF-8 bytes, total dictionary JSON 512 bytes,
depth 64, including queued changes. `gameObject:collidable` is ordinary metadata;
physics depends only on the creation option. Server membership is limited to 4096
objects, with separate non-reused IDs and the shared 1024-command queue.

The version 1 catalog lives in `prefabs/objects/catalog.json`; the built-in key
`quarry.rock` has alias `prop_rock_4_b`. The simple rock is approximately 2×1×2 m,
bottom anchored. Static bodies use dimensions and current physical geometry for
combat queries; object rewind and dynamics are not implemented. Channel 7 object
transactions are bounded to 4 MiB; annotations retain their 1 MiB bound. Both
share one eighth of bandwidth, retaining the owner's 32 KiB/s reserve.

SDK objects delegate native state and metadata, with WeakMap wrapper identity.
SDK `model` delegates `modelHash`; position and rotation use `(x,y,z) -> (x,z,-y)`
and inverse `(x,y,z) -> (x,-z,y)`. `setModel`, iterator filters and automatic ground
placement remain unsupported. The optional SDK collidable flag is passed by
gamemod; other platform adapters retain their previous behavior.

Rebuild server, addon and clients together for **ABI 24 / protocol 24**; ABI 19
and protocol 21 are incompatible. See the neighboring rock-sandbox `docs/objects.md`
for the full catalog, physics, transport and verification contract.

## RockSandbox player heading (ABI 24 / protocol 24)

`player.heading` and `player.setHeading(value)` directly delegate to RockSandbox.
The scalar angle uses degrees: 0 faces engine -Z and 90 faces -X; the SDK adds no
axis conversion, normalization, validation, queue or cached state.

The native FIFO publishes the normalized angle after the next successful server
pass, including a zero-tick pass. The body turns without moving the camera or
resetting movement/combat. Bound seated/ladder poses and dead players ignore the
setter; subsequent movement/aim can turn a free body naturally. Strict native
argument, absent-player, closed-runtime and overflow rules remain in effect.
See the [native heading contract](../rock-sandbox/docs/player-heading.md).
Server, addon and clients must be rebuilt together for **ABI 24 / protocol 24**.

## RockSandbox player names (ABI 24 / protocol 24)

`player.setName(name)` delegates directly to native `setName`. The SDK performs
no validation, trimming, uniqueness checks or name caching. The getter reads the
published native state; changes reach the existing global roster after a server
pass. Native rules allow up to 24 visible Unicode characters and 96 input UTF-8
bytes, trim outer whitespace and restore `Player <id>` for empty names. Rebuild
server/addon for **ABI 24**; protocol remains **24**. See
[the native contract](../rock-sandbox/docs/player-name.md).

## RockSandbox disconnect snapshots (ABI 24 / protocol 24)

The native `playerDisconnected(player, context)` bridge first emits
`rm::playerQuit(player, exitType, reason, snapshot)`, then
`rm::playerDisconnected(player)`. The exported `IRockModPlayerQuitSnapshot`
contains readonly `id`, `health`, `weaponAmmo`, `position`, `heading` and
`dimension`. Position is coordinate data converted into SDK Z-up space; the
snapshot and nested position are frozen. No player state is cached in the SDK.

Values were captured natively immediately before removal, including preceding
queued commands without a physical tick. Live handles remain absent and their
state getters still throw. Weapon ammo is the selected weapon's magazine even
when holstered; this does not implement the live `weaponAmmo` getter.

The bridge is installed lazily once per host, including quit-only subscriptions.
Original listener identity, duplicates, `off()` and exceptions are preserved.
Three-argument quit handlers remain compatible. Other platforms keep their
existing event path and omit the new optional snapshot argument.

Rebuild the native server/addon together for **ABI 24**; protocol **24** is
unchanged. See the [native disconnect contract](../rock-sandbox/docs/player-disconnect.md).

## RockSandbox player metadata (ABI 24 / protocol 24)

Player `getNetData(name)` and `setNetData(name, value)` delegate directly to the
native handle, preserving values and exceptions. JSON serialization, validation,
queueing, immutable published reads and streaming belong to RockSandbox. The SDK
adds no dictionary cache. Other entity stubs and platform adapters retain their
behavior. Keys are 1..128 UTF-8 bytes; native limits are 128 keys / 64 KiB / depth 64. `undefined` deletes and `null` is retained. Reads change only after publication;
death/respawn/visibility changes preserve data until disconnect. Remote Rust
clients receive data separately after physical stream admission. No clothing or
passive-mode effects are implemented. Rebuild server/addon/clients together for
ABI 24 / protocol 24; see [the native contract](../rock-sandbox/docs/player-data.md).

### RockSandbox client events

The optional native client Deno Core/V8 runtime now backs `net.events`. Raw and
internal subscriptions delegate to native local events; server subscriptions use
the separate native server registry. Generic registration subscribes the original
function to both. Unsubscribe, serialization, FIFO, limits and error handling stay
in RockSandbox. The SDK installs one lazy `render` → `rm::render` bridge per host.
Creating RockMod without host globals still succeeds; unrelated client gameplay
operations remain explicit stubs.

Bundle `rock-mod/client` and dependencies into local ESM and pass it to a Linux
x64/glibc client built with `client-js` using `--client-script` and `--connect`.
The smoke bundle in gamemod checks `client:ready` and the genuine authorization
UI envelope without providing a browser. ABI 24 / protocol 24 remain unchanged;
rebuild server and clients for consistent content hashing. Native API declarations
are available at `@rock-sandbox/types/client` and opt-in `/client/global`.

### RockSandbox client browsers

The Linux native browser bridge requires a client bundle built with
`python3 scripts/client_ui.py build --client-js` in rock-sandbox (both
`client-ui,client-js`). `game.browser.createInstance(url)` returns an independent
thin native handle. `create/execute/destroy` retain one primary browser, matching
the VIMP manager; independent pages survive primary replacement. Handles preserve
identity through a WeakMap and delegate execution, liveness, order and destruction.
SDK queues, property caches and readiness logic are absent.

The first SDK subscription to `rm::browserDomReady` (or render) installs one bridge
per native host; SDK readiness keeps its existing zero-argument signature.
Native `browserDomReady(browser)` and `browserError(browser,error)` are available
from `@rock-sandbox/types/client`. DOM-ready means the document/bridge is loaded,
not that the application is mounted. Page failures retire the native handle;
uncaught client JS errors retain their existing connection-fatal behavior.

Use `package://ui/index.html` under the native `--ui-root` or an explicitly allowed
loopback Vite origin. The page uses `rockSandboxUI.on/off/emitClient`, declared by
`@rock-sandbox/types/ui` and `/ui/global`. See the
[native API and lifecycle](../rock-sandbox/docs/client-ui.md). Server ABI 24 and
game protocol 24 stay unchanged; helper/client must both use CEF IPC 2.
Creating RockMod without a host still succeeds. Other client gameplay bindings,
full gamemod UI and Android client JS remain later stages.

### RockSandbox client storage

`game.storage.getData<T>(key)`, `setData(key, value)`, `removeData(key)` and
`clearData(prefix?)` directly delegate to native `storage.getItem/setItem/removeItem/clear`.
Serialization, validation, quotas, state and persistence stay in RockSandbox.
Reads return independent mutable JSON copies; absent/stored null return null.
Changes are immediately readable. The native-only `await rockSandbox.storage.flush()`
confirms disk persistence without changing the common SDK interface.

Storage uses the existing client profile directory and a namespace derived from
canonical project manifest path plus server IP/port. Reconnect preserves data;
copying/moving a project or changing ports starts a different namespace. Recent
unflushed writes can be lost on a crash. Normal shutdown flushes and joins the
Rust worker with bounded failure reporting. Limits: 4096 keys, 1..1024 UTF-8 bytes
per key, 64 MiB per JSON value, 256 MiB per snapshot, 256 pending flushes.
Corrupt files and writer failures report errors without automatic reset.

Creating RockMod without a host remains supported. Other platforms retain their
existing storage implementations. Gamemod cache/auth integration is a later stage.
Requires optional Linux `client-js`; ABI 24 / protocol 24 / CEF IPC 2 stay unchanged.
See [the native contract and reproducible UDP check](../rock-sandbox/docs/client-storage.md).

RockSandbox client `game.keys.isDown/isUp/bind/unbind` directly delegate to
`rockSandbox.keys`. The SDK has no key state, handler registry or repeat logic.
The host uses physical VK codes, first press/release semantics and idempotent
bindings; callbacks remain active while a browser has input, as in VIMP. Native
errors retain their identity. See Sandbox `docs/client-keyboard.md` for focus
cleanup, limits and smoke. ABI 24 / protocol 24 / CEF IPC 2 remain unchanged.

RockSandbox client `game.nametags.setEnabled(enabled)` directly delegates to
`rockSandbox.nametags.setEnabled(enabled)`. The native flag controls the existing
Rust player labels on the next UI pass, defaults to true per connection and is
discarded on teardown. The SDK has no flag, queue or argument checks; native
exceptions pass through unchanged. Custom UI overlays retain their own rendering.
See [native semantics and checks](../rock-sandbox/docs/client-nametags.md).
ABI 24 / protocol 24 / CEF IPC 2 remain unchanged.

RockSandbox client `utils.hash(value)` directly delegates to
`rockSandbox.utils.hash(value)`. The native method returns unsigned JOAAT32 over
UTF-8 bytes with ASCII case folding (`weapon_unarmed` → `2725352035`), accepting
primitive strings only. Validation, hashing and errors belong to RockSandbox;
the SDK adds no coercion, cache or name lookup. Server utilities retain their
current unsupported status. See [native hashing](../rock-sandbox/docs/client-js.md#native-hashing).
Requires Linux `client-js`; ABI 24 / protocol 24 / CEF IPC 2 remain unchanged.
