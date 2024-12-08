# Rock-Mod

**Rock-Mod** is a versatile and powerful framework designed for cross-platform mod development for Grand Theft Auto (GTA) servers. It supports **RageMP**, **AltV**, and **Mock** multiplayer platforms, allowing you to build and manage mods seamlessly across these environments.

### Installation

To get started, simply install the package:

```bash
npm install rock-mod
```

### Usage

On the server-side, initialize Rock-Mod with the appropriate multiplayer type:

```typescript
const rockMod = await RockMod.create({
  multiplayer: "RageMP", // or "AltV", or "Mock"
});
```

### Multiplayer Types

Rock-Mod supports three multiplayer types:

1. **RageMP** - For developing mods for RageMP servers
2. **AltV** - For developing mods for AltV servers
3. **Mock** - For testing and development without multiplayer dependencies

### Mock Mode

Mock mode provides a complete mock environment for testing your mods without requiring a multiplayer server. It includes:

- Full entity hierarchy (BaseObject, WorldObject, Entity)
- All entity types (Blip, Colshape, Marker, Object, Ped, Player, Vehicle)
- Type-safe events and RPC system
- In-memory state management

Example using Mock mode:

```typescript
// Initialize in Mock mode
const rockMod = await RockMod.create({
  multiplayer: "Mock",
});

// Subscribe to events
rockMod.net.events.on({
  "rm::playerConnected": (player) => {
    console.log(`Player ${player.name} connected`);
  },
  "rm::entityCreated": (entity) => {
    console.log(`Entity ${entity.id} created`);
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

### Features

- **Cross-Platform Support**: Write once, run on any supported platform
- **Type Safety**: Full TypeScript support with proper type definitions
- **Entity Management**: Unified API for managing game entities
- **Networking**: Type-safe events and RPC system
- **Testing**: Mock mode for development and testing
- **Modular Design**: Easy to extend and customize

### Documentation

Please note that client-side implementation is not yet available in this version.

Rock-Mod simplifies multiplayer mod development by providing unified tools for managing game entities, networking, and more across different platforms.

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### License

This project is licensed under the MIT License - see the LICENSE file for details.
