# Rock-Mod

**Rock-Mod** is a versatile and powerful framework designed for cross-platform mod development for Grand Theft Auto (GTA) servers. **VIMP** is the primary and recommended multiplayer platform; **RageMP**, **AltV**, and **Mock** are also supported. **RockSandbox** wraps native server internal events, player state and queued player commands; its other game APIs and client remain throwing stubs.

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
5. **RockSandbox** - Native server internal events, player state and queued player commands; other game operations remain stubs

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

The first SDK subscription to `rm::playerConnected`, `rm::playerDisconnected` or
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

`playerQuit`, entity lifecycle events, and gamemod persistence remain a later
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
stub. Rebuild the server/addon with **ABI 17** and clients with **game protocol 19**.

Players expose `id`, `type`, `isExists`, `name`, and `position`. After disconnect,
`id` and `type` remain available, `isExists` is `false`, and `name`/`position`
throw the native disconnected-player error. Position is a fresh `Vector3D` in
**Z-up** coordinates: engine `(x, y, z)` becomes `(x, -z, y)`. This is a rotation,
not a reflection. Positions already returned remain unchanged. Unsupported mutations, Social Club lookup, dimension/range iterator filters and other managers still
throw their existing stub errors.

`player.kick(reason?)` delegates directly to the native player. It queues removal
on the server thread and returns `undefined`; state changes appear on the next
published snapshot, followed by `rm::playerDisconnected`. Repeated requests keep
the first reason, and absent players are ignored. No SDK queue or gameplay state
is added.

Omitted, undefined or empty reasons use `Kicked by server`; other text is
preserved exactly, up to 1024 UTF-8 bytes. Native validation, a full command
queue or an unavailable runtime can throw synchronously. Validation also runs
for absent players. Catching a queue-full error lets the server continue.
Pending commands are discarded during shutdown. Reasons use the reliable
control channel with a one-second delivery interval; a lost connection can
prevent delivery. Server and clients must use **game protocol 19**.

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
existing platforms keep their behavior. Protocol is **19**.

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
prediction. Protocol is **19**. The server `IPlayer` interface exposes both
members; RageMP, VIMP, AltV and Mock explicitly throw for these new operations.
Delay configuration and gamemod lifecycle integration remain later stages.

Player queries require the server and addon rebuilt together with **ABI 17**.
ABI 17 also requires the Node-thread interrupt shutdown and actual V8 termination
guard; rebuild the complete Sandbox bundle. Dimensions add public getters/setters and extend game protocol **19**. Closed-host errors and
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

Rebuild **server, addon and clients together**: this requires native **ABI 17**
and **game protocol 19** (protocol 18 clients are rejected). ABI 11's safe Node
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

Server/client streaming uses **game protocol 19** and server/addon **ABI 17**
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

Rebuild the native server/addon for **ABI 17** and Rust clients for **protocol
19**. Gamemod's existing event-based RPC adapters use this transport; SDK native
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
Requires server/addon **ABI 17** and clients **protocol 19**, rebuilt together.
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
Rebuild server/addon (**ABI 17**) and clients (**protocol 19**) together. See the
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
This requires the rebuilt native server/addon **ABI 17**; game protocol stays 19.
