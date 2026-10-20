# Rock-Mod

**Rock-Mod** is a versatile and powerful framework designed for cross-platform mod development for Grand Theft Auto (GTA) servers. **VIMP** is the primary and recommended multiplayer platform; **RageMP**, **AltV**, and **Mock** are also supported. **RockSandbox** wraps native server internal events, read-only player state and queued kick; its other game APIs and client remain throwing stubs.

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
5. **RockSandbox** - Native server internal events, read-only player state and queued kick; other game operations remain stubs

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

Player queries require the server and addon rebuilt together with **ABI 4**.
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
native server internal events, read-only player state and queued kick, with remaining
client/server APIs implemented as throwing stubs; AltV
and Mock remain server-only.

Rock-Mod simplifies multiplayer mod development by providing unified tools for managing game entities, networking, and more across different platforms.

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### License

This project is licensed under the MIT License - see the LICENSE file for details.
