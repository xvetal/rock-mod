# Rock-Mod

Current RockSandbox compatibility: **ABI 31 / protocol 31 / CEF IPC 2**.
Protocol 31 adds native weapon ownership and finite reserves. Rebuild server,
addon and clients together. Later sections retain the
compatibility values of their original validation runs.
Server `player.collisionWithPlayers` and `setCollisionWithPlayers(enabled)`
delegate directly to native code. Other server adapters throw for these APIs.
See [the native contract](../rock-sandbox/docs/player-collisions.md). Earlier
validation sections retain the versions of their original runs.

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
state getters still throw. The historical quit snapshot retains the selected
weapon's magazine even when holstered. The live `weaponAmmo` getter now includes
finite reserves; the quit snapshot's persistence contract is unchanged.

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

RockSandbox client player lookup by ID/remote ID, local-player lookup and
`iterator.all()` now wrap native confirmed stream handles with WeakMap identity.
IDs/remote IDs are server player IDs; `type` is player and `isExists` delegates.
`getVariable/getSyncedMeta` delegate to native `getNetData`. JSON reads are
detached/deeply frozen; undefined and null remain distinct. Data-handler
registration delegates to the native keyed registry with only player wrapping.
The SDK adds no metadata state, polling, queue or handler registry. Filters,
remaining gameplay fields and other entity types remain unsupported. See
[native lifecycle, limits and checks](../rock-sandbox/docs/client-player-data.md).
ABI 24 / protocol 24 / CEF IPC 2 remain unchanged.

Client `players.findLocalPlayer()` and `getLocalPlayer()` are self-sufficient:
callers do not need a preceding `syncWithMpPool()`. RageMP and VIMP perform their
existing pool refresh inside the lookup, retaining remote wrappers and identity.
VIMP's first local admission, including late admission and reconnect, emits one
sticky `rm::playerReady`; refreshing an existing local player does not repeat it.
Before admission `findLocalPlayer()` returns null and `getLocalPlayer()` throws.
RockSandbox keeps its direct native `players.local` lookup with WeakMap identity;
no SDK pool, scan, polling or extra state is added. Its explicit legacy pool-sync
method remains unsupported. Native read errors propagate unchanged.

`npm run test:rock-sandbox` includes CPU contracts for the actual compiled player
managers with explicit RageMP/VIMP/native-host fixtures: lookup without manual
sync, remote refresh, identity, late readiness and reconnect. These fixtures do
not qualify a running RageMP/VIMP client.

Client `player.isLocalPlayer` now delegates directly to the native handle. The
runtime identifies its admitted owner; the SDK adds no ownership state or pool
lookup. Streamed remotes return false; absent/closed handles throw the native
error. CPU contracts verify direct reads and unchanged error identity. Native V8
and real two-client UDP checks cover stream-out, dimension reentry and reconnect.
The preceding real gamemod/MySQL report
`../gamemod/rock-sandbox-server/diagnostics/connections/20261023-204227-eacc1b71/report.json`
passes this getter and reaches `RockSandboxControlsManager.disableControlAction`
in the first weapon render pass. No client readiness is fabricated. ABI 24 /
protocol 24 / CEF IPC 2 remain unchanged.

Client `game.controls.disableControlAction()` delegates to native controls.
The current native implementation supports weapon category controls `157..165`, reload `45`
and compatibility groups `0..2`, with frame-local last-call behavior. Keyboard
and touch selection share the native filter; SDK validation, queues and state
are not added. All seven control methods delegate; raw keyboard queries ignore
restrictions, normal queries respect them, and digital normal values are 0/1.
Other control IDs and analog axes throw natively.
See [native semantics and checks](../rock-sandbox/docs/client-controls.md).

The preceding real gamemod/MySQL report is
`../gamemod/rock-sandbox-server/diagnostics/connections/20261023-205740-ujkzhin9/report.json`.
Both connections initialize the application and pass weapon selection/reload
restrictions; `RockSandboxPlayer.weapon` is the next first-frame blocker.
`client:ready` is not announced; disconnect/logout/repository cleanup completes.
ABI 24 / protocol 24 / CEF IPC 2 are unchanged. Native V8 and the common Rust
combat-filter test run in bounded child processes; CPU/UDP checks do not validate
CEF or device input.

Client player `weapon`, `isReloading`, `getAmmoInClip()` and
`game.weapon.getWeaponClipSize()` now delegate directly to native weapon state
and the actual project catalog. The runtime owns compatibility hashes, phase,
magazines, prediction/baseline publication and errors; the SDK adds no combat
state or fallback values. Unknown hashes throw; `getWeaponAmmo()` remains
unsupported because the simulation has no separate finite reserve. See
[native semantics and checks](../rock-sandbox/docs/client-weapons.md).

The preceding full-client report is
`../gamemod/rock-sandbox-server/diagnostics/connections/20261023-211837-yz9rh291/report.json`.
Both connections pass native weapon/magazine reads and reach the next fatal
`RockSandboxWorldObject.position` getter in the nametag render pass. The headless
driver now retains real early server events and starts JS after the gameplay
baseline is ready. Original unavailable-browser and scripted-camera diagnostics
remain; no readiness or UI response is fabricated. ABI 24 / protocol 24 / CEF
IPC 2 stay unchanged.

Client `player.position` now delegates to the native simulation snapshot and
converts engine coordinates `(x, y, z)` to a new SDK `Vector3D(x, -z, y)`. No
SDK position state, validation or setter is added; missing/removed/closed native
errors propagate. Native coordinates are detached/frozen and use actual owner
prediction or the latest accepted remote sample, independently of visual
interpolation. See [native semantics and checks](../rock-sandbox/docs/client-player-position.md).

The preceding full-client report is
`../gamemod/rock-sandbox-server/diagnostics/connections/20261023-212903-onx44yit/report.json`.
Both IDs pass the nametag origin position read and then reach the unsupported
ped iterator in `PedRepository.getAll`. No empty collection is substituted.
The real UDP probe retains the original diagnostics and completes disconnect,
logout, repository and private DB/process cleanup. Neither announces readiness.
ABI 24 / protocol 24 / CEF IPC 2 stay unchanged; GPU/device input is unverified.

Client `peds.iterator.all()` and ID/remote-ID lookup now delegate to the native
authored NPC and local visual preview pool. Wrappers preserve WeakMap identity and directly
read IDs, existence, model hash, dimension and heading. Position/rotation use
`(x,y,z) -> (x,-z,y)`. The SDK has no pool, checks or property state. Local creation, model/transform/
presentation setters and destruction now delegate directly to native API.
Authored mutations, physics, AI, appearance and metadata remain unsupported. The native pool reads
real project entities selected by cells/dimension; an unavailable registry
throws. See [authored NPC scope and checks](../rock-sandbox/docs/client-peds.md).

The preceding full-client report is
`../gamemod/rock-sandbox-server/diagnostics/connections/20261023-215516-u_kfnucg/report.json`.
Both IDs pass NPC enumeration and next fail at `RockSandboxPlayer.getBoneCoords`
in the nametag renderer. No readiness or UI response is fabricated; disconnect,
logout and repository/private DB/process cleanup pass. ABI 24 / protocol 24 /
CEF IPC 2 stay unchanged. GPU rendering and Android device behavior remain unverified.

Client player/NPC `getBoneCoords()` directly delegates to the native posed joint.
Only offsets `(x,y,z) -> (x,z,-y)` and returned points `(x,y,z) -> (x,-z,y)` are
converted. The SDK keeps no skeletal state or fallback offsets. See
[the native contract and verified CPU/UDP scope](../rock-sandbox/docs/client-bones.md).

Client `game.ui.hideHudComponentThisFrame(id)` directly delegates to
`rockSandbox.hud.hideComponentThisFrame(id)`. The Rust runtime owns the reset and
the actual HUD renderer consumes the accepted frame mask.
`game.ui.displayRadar(display)` directly delegates to
`rockSandbox.hud.setRadarVisible(display)`. The native per-connection flag persists
between frames and resets at runtime close; it is separate from the HUD mask.
The SDK has no radar state, queue or validation. Unsupported UI methods still throw.
See [native HUD categories](../rock-sandbox/docs/client-hud.md) and
[radar semantics and checks](../rock-sandbox/docs/client-radar.md).
The latest full gamemod/MySQL report is
`../gamemod/rock-sandbox-server/diagnostics/connections/20261024-004750-3ilg6rse/report.json`:
both IDs pass native camera, focus, HUD and radar calls and then require real CEF for application browser
creation. Neither announces `client:ready`. Cleanup passes; GPU qualification
is deferred. ABI 24 / protocol 24 / CEF IPC 2 remain unchanged.

RockSandbox client cameras now delegate creation, native lookup/iteration,
activation, destruction, transforms, FOV, world targeting and eased rendering to
`rockSandbox.cameras`. Gameplay is a read-only singleton. Wrappers retain WeakMap
identity; positions, directions, rotations and focus velocity convert SDK axes
`(x,y,z) -> (x,z,-y)` and back `(x,y,z) -> (x,-z,y)`.
`game.streaming.setFocusArea/clearFocus/setFocusEntity` delegate local map focus;
`player.handle` and camera handles are opaque native tokens. No SDK camera state,
validation, transitions, handle registry or streaming queues are added. Other
streaming APIs remain unsupported.
See [native camera semantics and checks](../rock-sandbox/docs/client-cameras.md).

RockSandbox `game.cursor.show(freezeControls, state)` delegates to
`rockSandbox.cursor.setVisible(state, freezeControls)`. `getPosition()` wraps an
actual frozen native pixel snapshot in `Vector2D`; headless pointer reads throw.
`game.ui.setPauseMenuActive(toggle)` delegates to native
`ui.setPauseMenuEnabled(toggle)`, following gamemod's use as menu permission:
false closes/blocks the Rust menu; true permits opening without opening it.
No input policy or state is stored in the SDK. Other platforms keep their calls.
See [native input semantics and checks](../rock-sandbox/docs/client-input.md).

RockSandbox `game.camera.screenFadeIn/Out(duration)` directly calls native
`screen.fadeIn/Out(duration)`. Required integer milliseconds, interpolation,
interruptions, layer ordering, closed-host checks and reset are native. The SDK
adds no opacity state, timers or validation. See
[native screen fading](../rock-sandbox/docs/client-screen-fade.md).

RockSandbox client players now delegate `dimension`, `heading`, `rotation` and
`forwardVector` to their native handle. Heading/dimension pass through;
rotation/direction convert engine axes `(x,y,z)` to SDK `(x,-z,y)`. No SDK
orientation calculation, state cache, polling or setters are added. Logical
facing, stream lifetime and frozen native snapshots are described in
[the native contract](../rock-sandbox/docs/client-player-transform.md).

RockSandbox `game.graphics.getActiveScreenResolution()` wraps native physical
window dimensions in `Vector2D`. `world3dToScreen2d(position)` converts input axes
`(x,y,z) -> (x,z,-y)` and wraps native normalized coordinates, preserving `null`
and original errors. Projection, camera easing, clipping and viewport changes
are native; the SDK adds no math or cache. See
[native viewport/projection checks](../rock-sandbox/docs/client-projection.md).

RockSandbox `game.raycasting.testPointToPoint` directly wraps native queries:
endpoints convert SDK to engine axes, every ignored entity contributes its
native handle, and flags pass through. Hit position/normal convert back; `null`
and native errors are preserved. Physical/category/dimension filtering remains
native. See [the native raycast contract](../rock-sandbox/docs/client-raycast.md),
including supported flags and local engine build instructions.

RockSandbox `game.graphics.drawText(text, position, options?)` directly delegates
to native `screen.drawText`, preserving the original arguments and exceptions.
Defaults, validation, frame limits, formatting and rendering stay native.
Font IDs 0/4 use the shipped proportional font; text is submitted each render,
above the world fade and below browsers. See [screen text](../rock-sandbox/docs/client-text.md)
for scales, color tags, Unicode and limits. ABI 24 / protocol 24 / CEF IPC 2 are
unchanged; GPU/Android device checks remain deferred.

`game.ui.getRadarScreenBounds()` returns native RockSandbox physical UI bounds,
`null` when the latest UI pass has no radar, or the original native error before
layout is available. The adapter adds no geometry calculation or state.
RageMP/VIMP preserve the established GTA calculation formerly in gamemod, using
their own native screen dimensions and safe-zone settings. See
[native radar bounds](../rock-sandbox/docs/client-radar-bounds.md) for publication
timing, layout/visibility and verification. ABI 24 / protocol 24 / CEF IPC 2 stay
unchanged.

Client RockSandbox players now expose native `health` and `isDead` through
direct getters. Latest samples, range, native life phase, stream-out errors and
cleanup belong to RockSandbox; the SDK adds no health adjustment or death
calculation. The existing gamemod player state adapter remains unchanged. See
[client life state](../rock-sandbox/docs/client-player-life.md) for semantics and
real UDP verification. ABI 24 / protocol 24 / CEF IPC 2 remain unchanged.

Client `RockSandboxPlayer.name` directly reads the native accepted display name.
The SDK adds no normalization, fallback name, roster, polling or state cache.
RockSandbox owns Unicode rename delivery, stream lease lifetime and native
errors. Existing gamemod player/repository code consumes the getter unchanged.
See [client names and verification](../rock-sandbox/docs/client-player-name.md).
ABI 24 / protocol 24 / CEF IPC 2 remain unchanged.

Client player `model` now directly delegates to RockSandbox's native
`modelHash`, the unsigned JOAAT32 of the accepted character asset name. The SDK
adds no model lookup, default or cache. The existing gamemod state adapter stays
unchanged. See [native player models](../rock-sandbox/docs/client-player-model.md)
for publication/stream-lease semantics and validation. Model mutation remains
unsupported; ABI 24 / protocol 24 / CEF IPC 2 are unchanged.

Client player `getOffsetFromInWorldCoords(x,y,z)` now delegates to RockSandbox's
native logical body transform. The SDK converts input/output axes and returns
its usual mutable `Vector3D`; it stores no transform or game state. Other entity
stubs and platforms are unchanged. See
[native player offsets](../rock-sandbox/docs/client-player-offsets.md).
ABI 24 / protocol 24 / CEF IPC 2 stay unchanged.

Client player `getWeaponAmmo(hash)` now directly delegates to RockSandbox's
native query. Host-managed totals now include finite reserves; the clip query
remains separate. The SDK does not derive either value or track reserves.
See [native ammunition](../rock-sandbox/docs/client-weapon-ammo.md). The existing
`WeaponService` gamemod path and other platforms stay unchanged. ABI 24 /
protocol 24 / CEF IPC 2 stay unchanged.

Client player `alpha`, `setAlpha`, `resetAlpha` and `setVisible` now directly
use RockSandbox's local native presentation. Validation, state, hierarchy and
material handling remain native. See
[local player appearance](../rock-sandbox/docs/client-player-appearance.md).
Shared entity stubs and other platforms stay unchanged. ABI 24 / protocol 24 /
CEF IPC 2 remain unchanged.

## RockSandbox client collision pairs

Client `player.setNoCollision(otherHandle, thisFrameOnly)` directly delegates
to RockSandbox. Native code owns token validation, the 1024-pair limit, frame
expiry and stream/connection cleanup. These are local prediction overrides;
the separate server `setCollisionWithPlayers()` API controls authority. Damage
rules remain unchanged. Existing gamemod passive-mode calls reach native physics. ABI 25 / protocol 25 /
CEF IPC 2 remains unchanged; rebuild the server, addon and clients together.

## Host-owned player invincibility

Server `player.invincible` and `setInvincible(enabled)` delegate to native
RockSandbox. The strict boolean command uses the existing FIFO; reads change
after publication. New connections default to false, and the policy survives
lives, relocation and dimension changes. Combat damage is blocked, while explicit
`setHealth()` assignments retain their existing behavior. Clients expose only
readonly `invincible`; they cannot grant themselves protection. Other server
adapters explicitly reject these server APIs; existing client adapters are unchanged.
See [the full contract and checks](../rock-sandbox/docs/player-invincibility.md).
Rebuild the server, addon and clients for **ABI 26 / protocol 26**. CEF IPC stays 2.

## Host-owned position freeze

Server `player.frozen` and `freezePosition(boolean)` directly delegate to native
RockSandbox; the client exposes only readonly `frozen`. The shared FIFO preserves
repeated commands and deferred reads. A changed value stops velocity and retires
old control generations, without changing health, collision policy or life.
Seated players retain their seat and follow the car without controlling it.
The policy survives respawns and transfers; explicit host relocation still works.
Other server adapters reject the new operations while their existing client
adapters retain native behavior. See [the contract and checks](../rock-sandbox/docs/player-freeze.md).
Current compatibility is **ABI 29 / protocol 29 / CEF IPC 2**.

## Server-owned full player collisions

RockSandbox's server `player.collisionEnabled` and
`player.setCollision(enabled, keepPhysics)` directly delegate to native state and
commands. The SDK adds no queue, validation, movement rules or property cache.
Other server adapters explicitly reject these new operations; their existing
client APIs retain current behavior. `keepPhysics` retains gravity/free movement
when collision is disabled. Freeze, invincibility and player-pair masks remain
independent. Client writes are not an authoritative override in RockSandbox.
See [native contract](../rock-sandbox/docs/player-body-collisions.md).
Current compatibility is **ABI 29 / protocol 29 / CEF IPC 2**.

## Server-authorized client transforms

Client RockSandbox players now directly delegate `setPosition()` and `setHeading()`;
position converts SDK `(x,y,z)` to engine `(x,z,-y)`. The server SDK directly
exposes native `clientTransformEnabled` and `setClientTransformEnabled(boolean)`.
Other server adapters reject the new permission APIs. No SDK queue, validation,
permission state, polling or input reconciliation is added.
See [native input contract](../rock-sandbox/docs/client-transforms.md), including
ignored ungranted input and one-shot server teleports. Compatibility is
**ABI 29 / protocol 29 / CEF IPC 2**.

Client `peds.create()`, `deleteById()`, ID/remote-ID lookup and `iterator.all()`
now support native local visual previews. Local `remoteId` is null; remote lookup
excludes them. Handles and alpha delegate directly, as do setters; position and
rotation use `(x,y,z) → (x,z,-y)`. Model identity/aliases, ownership, the 64-object
limit, rendering and lifecycle remain native. Both freemode aliases temporarily
use Streetwear. See [the contract and actual gamemod service check](../rock-sandbox/docs/client-local-peds.md).
ABI 29 / protocol 29 / CEF IPC 2 stay unchanged; rebuild SDK/client bundles.

## Temporary client appearance

RockSandbox player and local preview-ped cosmetic methods now delegate to
[visible native placeholders](../rock-sandbox/docs/client-appearance-placeholders.md).
Face/hair, overlays, clothing, props and tattoos retain the base model, return
`undefined` and produce a persistent native notice with one warning per
class/method per runtime. Native code owns argument/lifecycle checks and cleanup;
SDK wrappers add no state, validation or logging. Authored NPCs remain read-only;
other unsupported APIs still throw. Freemode aliases still share Streetwear.
This does not establish actual character customization or GPU/device behavior.
Rebuild client binaries, SDK and bundles for ABI 29 / protocol 30 / CEF IPC 2.

## Native server weapon control

RockSandbox now supports `giveWeapon`, `setWeaponAmmo`, `removeWeapon`,
`weapon` and `weaponAmmo` through direct SDK delegation. See [the native contract](../rock-sandbox/docs/server-weapons.md).
Ammo assignments are absolute finite totals (magazine + reserve); 1000 means
1000 rounds. The three supported weapon aliases retain the existing SDK names.
Removed weapons cannot fire or reload; host-managed inventory survives respawn.
The existing standalone arsenal remains until explicitly changed. Other GTA
weapons, components and client ammo setters remain separate; native RP inventory
reload is described below.
Compatibility is ABI 31 / protocol 31 / CEF IPC 2. GPU/Android device checks
remain deferred. Earlier recorded diagnostics retain their original versions.

## Authoritative inventory weapons

RockSandbox now exposes frozen per-weapon state, exclusive `equipWeapon()`
issuance identities and additive `addWeaponAmmo()` credits. Accepted server shots
carry historical bigint context; client shot notifications come only from local
authoritative results. SDK bridges remain direct. Gamemod uses one inventory SQL
transaction per instantaneous RP reload and persists accepted shots before
logout. See [the API, lifecycle and reproducible check](../rock-sandbox/docs/inventory-weapons.md).
Current compatibility is **ABI 31 / protocol 31 / CEF IPC 2**; rebuild server,
addon, clients, SDK and bundles. GPU and Android device checks remain deferred.
