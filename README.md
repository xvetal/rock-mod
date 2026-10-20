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

The first SDK subscription to `rm::playerConnected` or `rm::playerDisconnected`
installs two native bridges once for that host API object. Each bridge only
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

`playerQuit`, entity lifecycle events, and gamemod persistence remain a later
stage. Offline `--ticks` produces no player events, and shutdown synthesizes no
disconnects. Client events, RPC and unsupported game operations still throw an `Error` identifying the platform, side, class and member:

```typescript
rockMod.world.setTimeHour(12);
// Error: [RockSandbox:server] RockSandboxWorldManager.setTimeHour: not implemented
```

The server player manager delegates to native `rockSandbox.players`. It supports
`findByID`/`getByID`, exact `findByName`/`getByName` (the smallest ID wins for
identical names), and `iterator.all()`. Lookups and iteration return the same
wrapper for each connected native player. `find*` returns `null` when absent;
`get*` throws. Iterator membership is captured when `all()` is called.

Players expose `id`, `type`, `isExists`, `name`, and `position`. After disconnect,
`id` and `type` remain available, `isExists` is `false`, and `name`/`position`
throw the native disconnected-player error. Position is a fresh `Vector3D` in
**Z-up** coordinates: engine `(x, y, z)` becomes `(x, -z, y)`. This is a rotation,
not a reflection. Positions already returned remain unchanged. Health,
other mutations, Social Club lookup, dimension/range filters and other managers still
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
prevent delivery. Server and clients must use **game protocol 13**.

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
with its existing default loadout/ammunition reset; configuration is future work.
Gamemod lifecycle integration remains a separate stage. Other entities and
existing platforms keep their behavior. Protocol stays **13**.

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
player. No lifecycle/hit events are added; pending commands are discarded on stop.

Player queries require the server and addon rebuilt together with **ABI 7**.
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
