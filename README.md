# Rock-Mod

**Rock-Mod** is a versatile and powerful framework designed for cross-platform mod development for Grand Theft Auto (GTA) servers. It supports both **RageMP** and **AltV** multiplayer platforms, allowing you to build and manage mods seamlessly across these environments.

### Installation

To get started, simply install the package:

```bash
npm install rock-mod
```

### Usage

On the server-side, initialize Rock-Mod with the appropriate multiplayer type:

```typescript
const rockMod = await RockMod.create({
  multiplayer: "RageMP", // or "AltV"
});
```

Please note that client-side implementation is not yet available in this version.

Rock-Mod simplifies multiplayer mod development by providing unified tools for managing game entities, networking, and more across different platforms.
