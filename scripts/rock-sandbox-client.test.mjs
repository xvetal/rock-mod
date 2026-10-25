import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { after, test } from "node:test";
import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const directory = mkdtempSync(join(tmpdir(), "rock-mod-client-"));
after(() => {
  rmSync(directory, { recursive: true, force: true });
  Reflect.deleteProperty(globalThis, "rockSandbox");
});
const entry = join(directory, "entry.mjs");
writeFileSync(
  entry,
  [
    `export * from ${JSON.stringify(resolve("dist/client/index.js"))};`,
    `export { RagePlayersManager } from ${JSON.stringify(resolve("dist/client/entities/ragemp/player/RagePlayersManager.js"))};`,
    `export { VIMPPlayersManager } from ${JSON.stringify(resolve("dist/client/entities/vimp/player/VIMPPlayersManager.js"))};`,
    `export { RageUiManager } from ${JSON.stringify(resolve("dist/client/game/ragemp/ui/RageUiManager.js"))};`,
    `export { VIMPUiManager } from ${JSON.stringify(resolve("dist/client/game/vimp/ui/VIMPUiManager.js"))};`,
  ].join("\n"),
);
const bundle = await rollup({ input: entry, plugins: [nodeResolve(), commonjs()] });
const file = join(directory, "client.cjs");
await bundle.write({ file, format: "cjs", inlineDynamicImports: true });
await bundle.close();
const { RockMod, RagePlayersManager, VIMPPlayersManager, RageUiManager, VIMPUiManager } = createRequire(
  import.meta.url,
)(file);
assert.equal("mp" in globalThis, false);
assert.equal("vimp" in globalThis, false);
const mod = await RockMod.create({ multiplayer: "RockSandbox" });

test("radar bounds delegate the native snapshot, null and original errors without safezone calculations", () => {
  let bounds = Object.freeze({ x: 32, y: 648, width: 416, height: 416 });
  globalThis.rockSandbox = { hud: { getRadarScreenBounds: () => bounds } };
  assert.equal(mod.game.ui.getRadarScreenBounds(), bounds);
  bounds = null;
  assert.equal(mod.game.ui.getRadarScreenBounds(), null);
  const error = Error("[RockSandbox:client] native radar layout unavailable");
  globalThis.rockSandbox.hud.getRadarScreenBounds = () => {
    throw error;
  };
  assert.throws(
    () => mod.game.ui.getRadarScreenBounds(),
    (e) => e === error,
  );
});

test("actual RageMP and VIMP adapters retain the former gamemod radar formula", (t) => {
  t.after(() => {
    Reflect.deleteProperty(globalThis, "mp");
    Reflect.deleteProperty(globalThis, "vimp");
  });
  for (const [width, height, safezone] of [
    [1920, 1080, 1],
    [2560, 1080, 0.9],
    [1080, 1920, 0.85],
    [600, 800, 1],
  ]) {
    const calls = [];
    const readSafezone = () => {
      calls.push("safezone");
      return safezone;
    };
    const readSize = () => {
      calls.push("resolution");
      return { x: width, y: height };
    };
    globalThis.mp = { game: { graphics: { getSafeZoneSize: readSafezone, getActiveScreenResolution: readSize } } };
    globalThis.vimp = { natives: { graphics: { getSafeZoneSize: readSafezone, getActualScreenResolution: readSize } } };
    const expected = {
      x: width * (1 - safezone) * 0.5,
      y: height - height * (1 - safezone) * 0.5 - height * 0.188,
      width: height * (0.15 * (16 / 9)),
      height: height * 0.188,
    };
    assert.deepEqual(new RageUiManager().getRadarScreenBounds(), expected);
    assert.deepEqual(new VIMPUiManager().getRadarScreenBounds(), expected);
    assert.deepEqual(calls, ["safezone", "resolution", "safezone", "resolution"]);
  }
});

// Explicit platform/event fixtures exercise the actual compiled player managers.
// These are CPU contract tests; they do not launch RageMP or VIMP.
function playerEvents() {
  const listeners = new Map(),
    sticky = new Map(),
    emitted = [];
  return {
    emitted,
    onInternal(events) {
      for (const [name, callback] of Object.entries(events)) {
        listeners.set(name, [...(listeners.get(name) ?? []), callback]);
        if (sticky.has(name)) callback(...sticky.get(name));
      }
    },
    emitInternal(name, ...args) {
      emitted.push([name, ...args]);
      for (const callback of [...(listeners.get(name) ?? [])]) callback(...args);
    },
    emitInternalSticky(name, ...args) {
      sticky.set(name, args);
      this.emitInternal(name, ...args);
    },
    clearInternalSticky(name) {
      sticky.delete(name);
    },
  };
}

test("RageMP local lookup synchronizes its own native pool and preserves identity through reconnect", (t) => {
  const descriptor = Object.getOwnPropertyDescriptor(RockMod, "instance");
  const events = playerEvents(),
    nativeEvents = new Map(),
    pool = new Map();
  let local = null,
    failure;
  Object.defineProperty(RockMod, "instance", { get: () => ({ net: { events } }), configurable: true });
  globalThis.mp = {
    events: { add: (name, callback) => nativeEvents.set(name, callback) },
    players: {
      get local() {
        return local;
      },
      toArray() {
        if (failure) throw failure;
        return [...pool.values()];
      },
      at: (id) => pool.get(id),
      exists: (player) => pool.get(player.id) === player,
    },
  };
  t.after(() => {
    Object.defineProperty(RockMod, "instance", descriptor);
    Reflect.deleteProperty(globalThis, "mp");
  });
  const manager = new RagePlayersManager();
  assert.equal(manager.findLocalPlayer(), null);
  assert.throws(() => manager.getLocalPlayer(), /Local player/);
  local = { id: 4, remoteId: 40, type: "player", name: "Local" };
  pool.set(local.id, local);
  pool.set(5, { id: 5, remoteId: 50, type: "player", name: "Remote" });
  const player = manager.findLocalPlayer();
  assert.equal(player.remoteId, 40);
  assert.equal(manager.getLocalPlayer(), player);
  assert.equal(manager.findByID(4), player);
  assert.deepEqual(
    [...manager.iterator.all()].map((value) => value.id),
    [4, 5],
  );
  local.name = "Updated";
  assert.equal(manager.findLocalPlayer().name, "Updated");
  assert.equal(events.emitted.filter(([name]) => name === "rm::entityCreated").length, 2);
  const old = local;
  local = null;
  pool.delete(old.id);
  nativeEvents.get("entityDestroyed")(old);
  assert.equal(manager.findLocalPlayer(), null);
  assert.equal(player.isExists, false);
  local = { id: 6, remoteId: 60, type: "player", name: "Reconnected" };
  pool.set(local.id, local);
  const fresh = manager.getLocalPlayer();
  assert.notEqual(fresh, player);
  assert.equal(fresh.remoteId, 60);
  assert.equal(manager.findByID(4), null);
  failure = Error("native pool failure");
  assert.throws(
    () => manager.findLocalPlayer(),
    (error) => error === failure,
  );
});

test("VIMP local lookup owns pool synchronization and emits sticky readiness once for late admission and reconnect", () => {
  for (const firstRead of ["findLocalPlayer", "syncWithMpPool"]) {
    const events = playerEvents(),
      listeners = new Map();
    let local = null,
      remotes = [];
    globalThis.vimp = {
      players: {
        get local() {
          return local;
        },
        get all() {
          return remotes;
        },
      },
      on(name, callback) {
        listeners.set(name, [...(listeners.get(name) ?? []), callback]);
      },
    };
    try {
      const manager = new VIMPPlayersManager(events);
      assert.equal(manager.findLocalPlayer(), null);
      assert.throws(() => manager.getLocalPlayer(), /local player/);
      local = { id: 17, name: "Local" };
      remotes = [{ id: 18, name: "Remote" }];
      manager[firstRead]();
      const player = manager.findLocalPlayer();
      assert.equal(player.remoteId, 17);
      assert.equal(manager.getLocalPlayer(), player);
      assert.equal(manager.findByRemoteId(17), player);
      assert.deepEqual(
        [...manager.iterator.all()].map((value) => value.id),
        [18, 17],
      );
      const ready = events.emitted.filter(([name]) => name === "rm::playerReady");
      assert.equal(ready.length, 1);
      assert.equal(ready[0][1], player);
      const late = [];
      events.onInternal({ "rm::playerReady": (value) => late.push(value) });
      assert.equal(late[0], player);
      local = { id: 17, name: "Updated" };
      remotes.push({ id: 19, name: "Another remote" });
      assert.equal(manager.findLocalPlayer(), player);
      assert.equal(player.name, "Updated");
      assert.equal(manager.findByRemoteId(19).name, "Another remote");
      assert.equal(events.emitted.filter(([name]) => name === "rm::playerReady").length, 1);
      local = null;
      for (const callback of listeners.get("connectionStateChanged")) callback({ connected: false });
      assert.equal(manager.findLocalPlayer(), null);
      assert.equal(player.isExists, false);
      assert.equal(manager.findByRemoteId(17), null);
      local = { id: 20, name: "Reconnected" };
      for (const callback of listeners.get("connectionStateChanged")) callback({ connected: true });
      const fresh = manager.getLocalPlayer();
      assert.notEqual(fresh, player);
      assert.equal(fresh.remoteId, 20);
      assert.equal(late[1], fresh);
      assert.equal(events.emitted.filter(([name]) => name === "rm::playerReady").length, 2);
    } finally {
      Reflect.deleteProperty(globalThis, "vimp");
    }
  }
});

test("client delegates directly with original handler/argument identity", () => {
  const calls = [];
  globalThis.rockSandbox = Object.fromEntries(
    ["on", "off", "emit", "onServer", "offServer", "emitServer"].map((name) => [
      name,
      (...args) => calls.push([name, ...args]),
    ]),
  );
  const listener = () => {},
    value = {};
  mod.net.events.onServer({ response: listener });
  mod.net.events.offServer("response", listener);
  mod.net.events.emitServer("request", value);
  mod.net.events.onInternal({ custom: listener });
  mod.net.events.emitInternal("custom", value);
  mod.net.events.offInternal("custom");
  mod.net.events.register("generic", listener);
  mod.net.events.unregister("generic");
  assert.deepEqual(calls, [
    ["onServer", "response", listener],
    ["offServer", "response", listener],
    ["emitServer", "request", value],
    ["on", "custom", listener],
    ["emit", "custom", value],
    ["off", "custom", undefined],
    ["on", "generic", listener],
    ["onServer", "generic", listener],
    ["off", "generic"],
    ["offServer", "generic"],
  ]);
});

test("RockSandbox local lookup reads native membership directly without a pool sync or scan", () => {
  const original = Error("native local lookup failure");
  let local = null;
  const players = {
    get local() {
      return local;
    },
    all() {
      throw Error("unexpected full pool scan");
    },
    getById: (id) => (local?.id === id ? local : null),
  };
  globalThis.rockSandbox = { players };
  assert.equal(mod.players.findLocalPlayer(), null);
  assert.throws(() => mod.players.getLocalPlayer(), /local player not found/);
  local = { id: 23, isExists: true };
  const player = mod.players.findLocalPlayer();
  assert.equal(mod.players.getLocalPlayer(), player);
  assert.equal(mod.players.findByID(23), player);
  local.isExists = false;
  local = null;
  assert.equal(mod.players.findLocalPlayer(), null);
  assert.equal(player.isExists, false);
  local = { id: 24, isExists: true };
  const fresh = mod.players.getLocalPlayer();
  assert.notEqual(fresh, player);
  assert.equal(fresh.remoteId, 24);
  assert.equal(mod.players.findByID(23), null);
  assert.throws(() => mod.players.syncWithMpPool(), /not implemented/);
  Object.defineProperty(players, "local", {
    get() {
      throw original;
    },
  });
  assert.throws(
    () => mod.players.findLocalPlayer(),
    (error) => error === original,
  );
});

test("local-player flag delegates to the native handle without caching, scans or host lookup", () => {
  const original = Error("native isLocalPlayer failure");
  let owner = true,
    failure;
  const native = {
    id: 7,
    get isLocalPlayer() {
      if (failure) throw failure;
      return owner;
    },
  };
  globalThis.rockSandbox = { players: { local: native } };
  const player = mod.players.getLocalPlayer();
  // Only the saved native handle participates in subsequent reads.
  Reflect.deleteProperty(globalThis, "rockSandbox");
  assert.equal(player.isLocalPlayer, true);
  owner = false;
  assert.equal(player.isLocalPlayer, false);
  failure = original;
  assert.throws(
    () => player.isLocalPlayer,
    (error) => error === original,
  );
});

test("player positions delegate native state with axis conversion and no SDK cache", () => {
  const original = Error("native position failure");
  let position = Object.freeze({ x: 1.25, y: 2.5, z: -3.75 }),
    failure;
  const native = {
    id: 30,
    setPosition() {
      if (failure) throw failure;
    },
    get position() {
      if (failure) throw failure;
      return position;
    },
  };
  globalThis.rockSandbox = { players: { local: native } };
  const player = mod.players.getLocalPlayer(),
    first = player.position;
  assert.deepEqual([first.x, first.y, first.z], [1.25, 3.75, 2.5]);
  assert.equal(typeof first.distanceTo, "function");
  assert.throws(() => {
    first.x = 100;
  }, TypeError);
  assert.equal(player.position.x, 1.25);
  position = Object.freeze({ x: -1, y: -2, z: -3 });
  assert.deepEqual([player.position.x, player.position.y, player.position.z], [-1, 3, -2]);
  failure = original;
  assert.throws(
    () => player.position,
    (error) => error === original,
  );
  assert.throws(
    () => player.setPosition(first),
    (error) => error === original,
  );
});

test("weapon state and project magazine sizes delegate without SDK state or hashing", () => {
  let weapon = 453432689,
    reloading = false,
    failure;
  const calls = [],
    original = Error("native weapon failure");
  const native = {
    id: 29,
    get weapon() {
      if (failure) throw failure;
      return weapon;
    },
    get isReloading() {
      if (failure) throw failure;
      return reloading;
    },
    getWeaponAmmo(hash) {
      assert.equal(this, native);
      calls.push(["total", hash]);
      if (failure) throw failure;
      return 29;
    },
    getAmmoInClip(hash) {
      calls.push(["ammo", hash]);
      if (failure) throw failure;
      return 3;
    },
  };
  globalThis.rockSandbox = {
    players: { local: native },
    weapons: {
      getClipSize(hash) {
        calls.push(["capacity", hash]);
        if (failure) throw failure;
        return 7;
      },
    },
  };
  const player = mod.players.getLocalPlayer();
  assert.equal(player.weapon, weapon);
  assert.equal(player.isReloading, false);
  assert.equal(player.getAmmoInClip(weapon), 3);
  // Distinct fixture values prove the SDK never derives total ammo from the clip.
  assert.equal(player.getWeaponAmmo(weapon), 29);
  assert.equal(mod.game.weapon.getWeaponClipSize(weapon), 7);
  assert.deepEqual(calls, [
    ["ammo", weapon],
    ["total", weapon],
    ["capacity", weapon],
  ]);
  weapon = 324215364;
  reloading = true;
  assert.equal(player.weapon, weapon);
  assert.equal(player.isReloading, true);
  failure = original;
  for (const run of [
    () => player.weapon,
    () => player.isReloading,
    () => player.getAmmoInClip(weapon),
    () => player.getWeaponAmmo(weapon),
    () => mod.game.weapon.getWeaponClipSize(weapon),
  ])
    assert.throws(run, (e) => e === original);
});

test("control restrictions delegate arguments and native failures without SDK state", () => {
  const calls = [],
    original = Error("native unsupported control");
  globalThis.rockSandbox = {
    controls: {
      disableControlAction(...args) {
        calls.push(args);
        if (args[1] === 24) throw original;
      },
    },
  };
  mod.game.controls.disableControlAction(1, 159, true);
  mod.game.controls.disableControlAction(0, 159, false);
  assert.deepEqual(calls, [
    [1, 159, true],
    [0, 159, false],
  ]);
  assert.throws(
    () => mod.game.controls.disableControlAction(0, 24, true),
    (e) => e === original,
  );
  for (const method of [
    "isDisabledControlPressed",
    "isDisabledControlJustPressed",
    "isControlPressed",
    "isControlJustPressed",
    "isControlJustReleased",
    "getDisabledControlNormal",
  ]) {
    const value = method === "getDisabledControlNormal" ? 0.5 : true;
    globalThis.rockSandbox.controls[method] = (...args) => {
      calls.push([method, ...args]);
      return value;
    };
    assert.equal(mod.game.controls[method](1, 45), value);
    assert.deepEqual(calls.at(-1), [method, 1, 45]);
    globalThis.rockSandbox.controls[method] = () => {
      throw original;
    };
    assert.throws(
      () => mod.game.controls[method](0, 45),
      (error) => error === original,
    );
  }
});

test("render bridge is installed once per host and delegates through native emit", () => {
  for (let host = 0; host < 2; host++) {
    const calls = [];
    globalThis.rockSandbox = {
      on: (...args) => calls.push(["on", ...args]),
      emit: (...args) => calls.push(["emit", ...args]),
    };
    const listener = () => {};
    mod.net.events.onInternal({ "rm::render": listener });
    mod.net.events.onInternal({ "rm::render": listener });
    const bridges = calls.filter(([, name]) => name === "render");
    assert.equal(bridges.length, 1);
    assert.equal(calls.filter(([, name, fn]) => name === "rm::render" && fn === listener).length, 2);
    bridges[0][2]();
    assert.deepEqual(calls.at(-1), ["emit", "rm::render"]);
  }
});

test("native exceptions propagate and unrelated APIs remain unsupported", () => {
  const original = new Error("original");
  globalThis.rockSandbox = {
    emitServer() {
      throw original;
    },
  };
  assert.throws(
    () => mod.net.events.emitServer("request"),
    (e) => e === original,
  );
  assert.throws(() => mod.vehicles.findByID(1), /not implemented/);
});

test("camera and focus wrappers delegate native state, identity, transforms and errors", () => {
  const calls = [],
    original = Error("native camera error");
  let failure = false;
  const operation = (name, ...args) => {
    if (failure) throw original;
    calls.push([name, ...args]);
  };
  const camera = {
    id: 4,
    handle: 101,
    isAlive: true,
    isActive: false,
    position: { x: 1, y: 2, z: 3 },
    rotation: { x: 10, y: 20, z: 30 },
    direction: { x: 0, y: 0, z: -1 },
    fov: 45,
    setActive: (value) => operation("active", value),
    setPosition: (value) => operation("position", value),
    setRotation: (value) => operation("rotation", value),
    pointAtCoord: (value) => operation("point", value),
    setFov: (value) => operation("fov", value),
    destroy: () => {
      operation("destroy");
      camera.isAlive = false;
    },
  };
  const gameplay = { ...camera, id: 0, handle: 0 },
    player = { id: 4, handle: 202, isExists: true };
  globalThis.rockSandbox = {
    cameras: {
      create: (value) => {
        operation("create", value);
        return camera;
      },
      all: () => [camera],
      getById: (id) => (id === 4 && camera.isAlive ? camera : null),
      getGameplayCamera: () => gameplay,
      renderScriptCams: (...args) => operation("render", ...args),
    },
    players: { local: player },
    streaming: {
      setFocusArea: (...args) => operation("area", ...args),
      clearFocus: () => operation("clear"),
      setFocusEntity: (value) => operation("entity", value),
    },
  };
  const wrapper = mod.cameras.create({
    name: "script",
    position: { x: 1, y: 2, z: 3 },
    rotation: { x: 10, y: 20, z: 30 },
    fov: 45,
  });
  assert.deepEqual(calls[0], [
    "create",
    { name: "script", position: { x: 1, y: 3, z: -2 }, rotation: { x: 10, y: 30, z: -20 }, fov: 45 },
  ]);
  assert.equal(mod.cameras.findByID(4), wrapper);
  assert.equal(mod.cameras.getByID(4), wrapper);
  assert.equal([...mod.cameras.iterator.all()][0], wrapper);
  assert.equal(mod.cameras.getGameplayCamera(), mod.cameras.getGameplayCamera());
  assert.equal(wrapper.remoteId, null);
  assert.equal(wrapper.id, 4);
  assert.equal(wrapper.handle, 101);
  const vector = (value) => [value.x, value.y, value.z];
  assert.deepEqual(vector(wrapper.position), [1, -3, 2]);
  assert.deepEqual(vector(wrapper.rotation), [10, -30, 20]);
  assert.deepEqual(vector(wrapper.direction), [0, 1, 0]);
  assert.equal(wrapper.fov, 45);
  assert.equal(wrapper.isActive, false);
  camera.isActive = true;
  assert.equal(wrapper.isActive, true);
  wrapper.setIsActive(true);
  wrapper.setPosition({ x: 4, y: 5, z: 6 });
  wrapper.setRotation({ x: 7, y: 8, z: 9 });
  wrapper.pointAtCoord({ x: 10, y: 11, z: 12 });
  wrapper.setFov(70);
  mod.cameras.renderScriptCams(true, true, 500, false);
  mod.game.streaming.setFocusArea({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 });
  mod.game.streaming.setFocusEntity(mod.players.getLocalPlayer().handle);
  mod.game.streaming.clearFocus();
  assert.deepEqual(calls.slice(1), [
    ["active", true],
    ["position", { x: 4, y: 6, z: -5 }],
    ["rotation", { x: 7, y: 9, z: -8 }],
    ["point", { x: 10, y: 12, z: -11 }],
    ["fov", 70],
    ["render", true, true, 500, false],
    ["area", { x: 1, y: 3, z: -2 }, { x: 4, y: 6, z: -5 }],
    ["entity", 202],
    ["clear"],
  ]);
  failure = true;
  assert.throws(
    () => wrapper.setFov("invalid"),
    (error) => error === original,
  );
  assert.throws(
    () => mod.game.streaming.setFocusEntity(-1),
    (error) => error === original,
  );
  assert.throws(
    () => mod.cameras.renderScriptCams(true, false, 0, true),
    (error) => error === original,
  );
  failure = false;
  assert.equal(mod.cameras.deleteById(4), wrapper);
  assert.equal(wrapper.isExists, false);
  assert.equal(mod.cameras.findByID(4), null);
  assert.equal(mod.cameras.findByRemoteID(4), null);
});

test("browser handles delegate, retain identity, and primary ownership is independent", () => {
  const calls = [];
  const native = {
    isAlive: true,
    executeJavaScript: (...args) => calls.push(["execute", ...args]),
    destroy: () => calls.push(["destroy"]),
    setOrderId: (...args) => calls.push(["order", ...args]),
  };
  globalThis.rockSandbox = {
    browsers: {
      create: (url) => {
        calls.push(["create", url]);
        return native;
      },
    },
  };
  const one = mod.game.browser.createInstance("package://ui/one.html");
  const two = mod.game.browser.createInstance("package://ui/two.html");
  assert.equal(one, two);
  assert.equal(one.isAlive, true);
  native.isAlive = false;
  assert.equal(one.isAlive, false);
  one.execute("unchanged source");
  one.setOrderId(-5);
  mod.game.browser.execute("no primary");
  mod.game.browser.destroy();
  assert.deepEqual(calls, [
    ["create", "package://ui/one.html"],
    ["create", "package://ui/two.html"],
    ["execute", "unchanged source"],
    ["order", -5],
  ]);
  mod.game.browser.create("package://ui/main.html");
  mod.game.browser.execute("main source");
  mod.game.browser.create("package://ui/replacement.html");
  mod.game.browser.destroy();
  assert.deepEqual(calls.slice(4), [
    ["create", "package://ui/main.html"],
    ["execute", "main source"],
    ["destroy"],
    ["create", "package://ui/replacement.html"],
    ["destroy"],
  ]);
  const original = Error("native browser failure");
  native.executeJavaScript = () => {
    throw original;
  };
  assert.throws(
    () => one.execute("code"),
    (e) => e === original,
  );
});

test("browser readiness bridge preserves handler identity and emits no arguments", () => {
  const calls = [];
  globalThis.rockSandbox = {
    on: (...args) => calls.push(["on", ...args]),
    off: (...args) => calls.push(["off", ...args]),
    onServer: (...args) => calls.push(["onServer", ...args]),
    emit: (...args) => calls.push(["emit", ...args]),
  };
  const handler = () => {};
  mod.net.events.register("rm::browserDomReady", handler);
  mod.net.events.onInternal({ "rm::browserDomReady": handler });
  const bridges = calls.filter(([method, name]) => method === "on" && name === "browserDomReady");
  assert.equal(bridges.length, 1);
  bridges[0][2]({ id: 42 });
  assert.deepEqual(calls.at(-1), ["emit", "rm::browserDomReady"]);
  mod.net.events.offInternal("rm::browserDomReady", handler);
  assert.deepEqual(calls.at(-1), ["off", "rm::browserDomReady", handler]);
});

test("storage delegates keys, values and failures without SDK state", () => {
  const calls = [],
    value = { nested: [] },
    result = { cached: true },
    failure = Error("native storage failure");
  globalThis.rockSandbox = {
    storage: {
      getItem: (key) => {
        calls.push(["get", key]);
        return result;
      },
      setItem: (key, value) => calls.push(["set", key, value]),
      removeItem: (key) => calls.push(["remove", key]),
      clear: (prefix) => calls.push(["clear", prefix]),
    },
  };
  assert.equal(mod.game.storage.getData("cache"), result);
  mod.game.storage.setData("cache", value);
  mod.game.storage.removeData("cache");
  mod.game.storage.clearData("cache:");
  mod.game.storage.clearData();
  assert.deepEqual(calls, [
    ["get", "cache"],
    ["set", "cache", value],
    ["remove", "cache"],
    ["clear", "cache:"],
    ["clear", undefined],
  ]);
  assert.equal(calls[1][2], value);
  globalThis.rockSandbox.storage.getItem = () => {
    throw failure;
  };
  assert.throws(
    () => mod.game.storage.getData("cache"),
    (e) => e === failure,
  );
});

test("keyboard delegates original arguments, handler identity and native errors", () => {
  const calls = [],
    handler = () => {},
    failure = Error("native key validation");
  globalThis.rockSandbox = {
    keys: {
      isDown: (...args) => {
        calls.push(["down", ...args]);
        return true;
      },
      isUp: (...args) => {
        calls.push(["up", ...args]);
        return false;
      },
      bind: (...args) => {
        calls.push(["bind", ...args]);
      },
      unbind: (...args) => {
        calls.push(["unbind", ...args]);
      },
    },
  };
  assert.equal(mod.game.keys.isDown(65), true);
  assert.equal(mod.game.keys.isUp(65), false);
  mod.game.keys.bind(65, true, handler);
  mod.game.keys.unbind(65, true, handler);
  mod.game.keys.unbind(65, false);
  assert.deepEqual(calls, [
    ["down", 65],
    ["up", 65],
    ["bind", 65, true, handler],
    ["unbind", 65, true, handler],
    ["unbind", 65, false, undefined],
  ]);
  globalThis.rockSandbox.keys.bind = () => {
    throw failure;
  };
  assert.throws(
    () => mod.game.keys.bind(65, true, handler),
    (error) => error === failure,
  );
});

test("hash delegates unchanged arguments and unsigned result without SDK coercion or caching", () => {
  const calls = [],
    value = {},
    failure = Error("native hash validation");
  globalThis.rockSandbox = {
    utils: {
      hash: (arg) => {
        calls.push(arg);
        return 2725352035;
      },
    },
  };
  assert.equal(mod.utils.hash("WEAPON_UNARMED"), 2725352035);
  assert.equal(mod.utils.hash("WEAPON_UNARMED"), 2725352035);
  assert.equal(mod.utils.hash(""), 2725352035);
  assert.equal(mod.utils.hash(value), 2725352035);
  assert.deepEqual(calls, ["WEAPON_UNARMED", "WEAPON_UNARMED", "", value]);
  assert.equal(calls[3], value);
  globalThis.rockSandbox.utils.hash = () => {
    throw failure;
  };
  assert.throws(
    () => mod.utils.hash("adder"),
    (error) => error === failure,
  );
});

test("nametags delegate each original argument and native exception without SDK state", () => {
  const calls = [],
    invalid = {},
    failure = Error("native nametag validation");
  globalThis.rockSandbox = {
    nametags: { setEnabled: (...args) => calls.push(args) },
  };
  assert.equal(mod.game.nametags.setEnabled(false), undefined);
  mod.game.nametags.setEnabled(false);
  mod.game.nametags.setEnabled(true);
  mod.game.nametags.setEnabled(invalid);
  assert.deepEqual(calls, [[false], [false], [true], [invalid]]);
  assert.equal(calls[3][0], invalid);
  globalThis.rockSandbox.nametags.setEnabled = () => {
    throw failure;
  };
  assert.throws(
    () => mod.game.nametags.setEnabled(false),
    (error) => error === failure,
  );
});

test("streamed player wrappers and data callbacks share identity and delegate metadata", () => {
  const calls = [],
    registrations = [],
    value = Object.freeze({ a: 1 }),
    oldValue = Object.freeze({ a: 0 });
  const native = {
    id: 4294967295,
    isExists: true,
    getNetData: (key) => {
      calls.push(key);
      return value;
    },
  };
  globalThis.rockSandbox = {
    players: { local: native, all: () => [native], getById: (id) => (id === native.id ? native : null) },
    dataHandler: { addDataHandler: (...args) => registrations.push(args) },
  };
  const player = mod.players.getLocalPlayer();
  assert.equal(player, mod.players.findLocalPlayer());
  assert.equal(player, mod.players.getByRemoteId(native.id));
  assert.equal(player, mod.players.getByID(native.id));
  assert.equal(player, mod.players.findByRemoteID(native.id));
  assert.equal(player, [...mod.players.iterator.all()][0]);
  assert.equal(player.id, native.id);
  assert.equal(player.remoteId, native.id);
  assert.equal(player.type, "player");
  assert.equal(player.getVariable("one"), value);
  assert.equal(player.getSyncedMeta("two"), value);
  assert.deepEqual(calls, ["one", "two"]);
  const seen = [],
    handler = (...args) => seen.push(args);
  mod.net.dataHandler.addDataHandler("key", handler);
  mod.net.dataHandler.addDataHandler("key", handler);
  for (const [key, callback] of registrations) {
    assert.equal(key, "key");
    callback(native, value, oldValue);
  }
  assert.equal(seen.length, 2);
  assert.equal(seen[0][0], player);
  assert.equal(seen[0][1], value);
  assert.equal(seen[0][2], oldValue);
  native.isExists = false;
  assert.equal(player.isExists, false);
  assert.equal(mod.players.findByRemoteId(17), null);
  assert.throws(() => mod.players.getByRemoteId(17), /not found/);
  assert.throws(() => player.armour, /not implemented/);
  assert.throws(() => mod.players.iterator.dimension(0), /not implemented/);
  const failure = Error("callback original");
  mod.net.dataHandler.addDataHandler("throws", () => {
    throw failure;
  });
  assert.throws(
    () => registrations.at(-1)[1](native, 1, 0),
    (e) => e === failure,
  );
  globalThis.rockSandbox.players.getById = () => {
    throw failure;
  };
  assert.throws(
    () => mod.players.findByRemoteId(17),
    (e) => e === failure,
  );
});

test("authored NPC pool delegates identity, lookup, coordinates and failures to native", () => {
  let state = { position: { x: 1, y: 2, z: 3 }, rotation: { x: 0, y: 45, z: 0 }, dimension: 4 },
    exists = true;
  const original = Error("native NPC failure"),
    native = {
      id: 4294967295,
      remoteId: 4294967295,
      setPosition() {
        throw original;
      },
      get isExists() {
        return exists;
      },
      get position() {
        if (!exists) throw original;
        return state.position;
      },
      get rotation() {
        return state.rotation;
      },
      get dimension() {
        return state.dimension;
      },
      modelHash: 123,
      getBoneCoords() {
        throw original;
      },
    };
  globalThis.rockSandbox = {
    peds: {
      all: () => (exists ? [native] : []),
      getById: (id) => (exists && id === native.id ? native : null),
      getByRemoteId: (id) => (exists && id === native.id ? native : null),
    },
  };
  const ped = mod.peds.getByID(native.id);
  assert.equal(mod.peds.getByRemoteID(native.id), ped);
  assert.equal(mod.peds.iterator.all().next().value, ped);
  assert.equal(ped.id, native.id);
  assert.equal(ped.remoteId, native.id);
  assert.equal(ped.model, 123);
  assert.equal(ped.heading, 45);
  assert.equal(ped.dimension, 4);
  const first = ped.position;
  assert.deepEqual([first.x, first.y, first.z], [1, -3, 2]);
  assert.deepEqual([ped.rotation.x, ped.rotation.y, ped.rotation.z], [0, -0, 45]);
  state = { ...state, position: { x: 10, y: 20, z: 30 }, dimension: 8 };
  assert.equal(ped.position.x, 10);
  assert.equal(first.x, 1);
  assert.equal(ped.dimension, 8);
  exists = false;
  assert.equal(ped.isExists, false);
  assert.equal(mod.peds.findByID(native.id), null);
  assert.deepEqual([...mod.peds.iterator.all()], []);
  assert.throws(
    () => ped.position,
    (e) => e === original,
  );
  assert.throws(() => mod.peds.getByID(native.id), /ped 4294967295 not found/);
  assert.throws(() => mod.peds.create({}), TypeError);
  assert.throws(
    () => ped.setPosition(first),
    (error) => error === original,
  );
  assert.throws(
    () => ped.getBoneCoords(0, 0, 0, 0),
    (error) => error === original,
  );
});

test("bone coordinates delegate native joint queries and transform both offset and result", () => {
  const calls = [],
    original = Error("native bone failure");
  let failed = false;
  const native = {
    id: 19,
    getBoneCoords(...args) {
      if (failed) throw original;
      calls.push(args);
      return { x: 10, y: 20, z: 30 };
    },
  };
  globalThis.rockSandbox = { players: { local: native }, peds: { getById: () => native } };
  const player = mod.players.getLocalPlayer(),
    ped = mod.peds.getByID(19);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  for (const actor of [player, ped]) {
    const result = actor.getBoneCoords(12844, 1, 2, 3);
    assert.deepEqual([result.x, result.y, result.z], [10, -30, 20]);
  }
  assert.deepEqual(calls, [
    [12844, 1, 3, -2],
    [12844, 1, 3, -2],
  ]);
  failed = true;
  for (const actor of [player, ped])
    assert.throws(
      () => actor.getBoneCoords(0, 0, 0, 0),
      (e) => e === original,
    );
});

test("HUD hiding delegates each frame request and preserves native errors", () => {
  const calls = [],
    original = Error("native HUD failure");
  globalThis.rockSandbox = {
    hud: {
      hideComponentThisFrame: (id) => {
        calls.push(id);
      },
    },
  };
  const hud = mod.game.ui;
  for (const id of [1, 2, 3, 4, 6, 7, 8, 9, 13]) assert.equal(hud.hideHudComponentThisFrame(id), undefined);
  assert.deepEqual(calls, [1, 2, 3, 4, 6, 7, 8, 9, 13]);
  globalThis.rockSandbox.hud.hideComponentThisFrame = () => {
    throw original;
  };
  assert.throws(
    () => hud.hideHudComponentThisFrame(0),
    (error) => error === original,
  );
});

test("radar display delegates every call and preserves native error identity", () => {
  const calls = [],
    original = Error("native radar validation");
  globalThis.rockSandbox = {
    hud: {
      setRadarVisible(value) {
        calls.push(value);
      },
    },
  };
  for (const value of [false, false, true, false]) assert.equal(mod.game.ui.displayRadar(value), undefined);
  assert.deepEqual(calls, [false, false, true, false]);
  // The SDK must leave validation to the host, even for invalid JS arguments.
  globalThis.rockSandbox.hud.setRadarVisible = (value) => {
    calls.push(value);
    throw original;
  };
  assert.throws(
    () => mod.game.ui.displayRadar(0),
    (error) => error === original,
  );
  assert.equal(calls.at(-1), 0);
  globalThis.rockSandbox = {
    hud: {
      setRadarVisible(value) {
        calls.push(["fresh host", value]);
      },
    },
  };
  mod.game.ui.displayRadar(true);
  assert.deepEqual(calls.at(-1), ["fresh host", true]);
});

test("player collision exclusions delegate original handles, lifetime and failures without SDK state", () => {
  const calls = [],
    failure = Error("native collision failure");
  let fail = false;
  const native = {
    id: 719,
    setNoCollision(...args) {
      assert.equal(this, native);
      calls.push(args);
      if (fail) throw failure;
    },
  };
  globalThis.rockSandbox = { players: { getById: () => native } };
  const player = mod.players.findByRemoteId(native.id);
  for (const frame of [true, true, false]) assert.equal(player.setNoCollision(987, frame), undefined);
  const invalid = {};
  player.setNoCollision(invalid, invalid);
  assert.deepEqual(calls, [
    [987, true],
    [987, true],
    [987, false],
    [invalid, invalid],
  ]);
  fail = true;
  assert.throws(
    () => player.setNoCollision(987, true),
    (e) => e === failure,
  );
});

test("client player presentation delegates values, receiver and errors without SDK state", () => {
  const calls = [];
  let alpha = 255,
    failure;
  const native = {
    id: 716,
    isExists: true,
    get alpha() {
      if (failure) throw failure;
      return alpha;
    },
  };
  for (const method of ["setAlpha", "setVisible", "resetAlpha"])
    native[method] = function (...args) {
      assert.equal(this, native);
      calls.push([method, ...args]);
      if (failure) throw failure;
    };
  globalThis.rockSandbox = { players: { getById: (id) => (id === native.id ? native : null) } };
  const player = mod.players.findByRemoteId(native.id);
  assert.equal(player.alpha, 255);
  assert.equal(player.setAlpha(128), undefined);
  assert.equal(player.setVisible(false), undefined);
  assert.equal(player.resetAlpha(), undefined);
  // The SDK reads accepted native state; setters above deliberately do not change the fixture.
  assert.equal(player.alpha, 255);
  alpha = 37;
  assert.equal(player.alpha, 37);
  const invalid = {};
  player.setAlpha(invalid);
  player.setVisible(invalid);
  assert.deepEqual(calls, [
    ["setAlpha", 128],
    ["setVisible", false],
    ["resetAlpha"],
    ["setAlpha", invalid],
    ["setVisible", invalid],
  ]);
  failure = Error("original native player presentation failure");
  for (const operation of [
    () => player.alpha,
    () => player.setAlpha(0),
    () => player.setVisible(true),
    () => player.resetAlpha(),
  ])
    assert.throws(operation, (error) => error === failure);
});

test("client player world offsets delegate both axis conversions without calculating a transform", () => {
  const calls = [];
  let result = Object.freeze({ x: 10, y: 20, z: -30 }),
    failure;
  const native = {
    id: 715,
    isExists: true,
    get position() {
      throw Error("SDK must not calculate position");
    },
    get heading() {
      throw Error("SDK must not calculate orientation");
    },
    getOffsetFromInWorldCoords(...args) {
      assert.equal(this, native);
      calls.push(args);
      if (failure) throw failure;
      return result;
    },
  };
  globalThis.rockSandbox = { players: { getById: (id) => (id === native.id ? native : null) } };
  const player = mod.players.findByRemoteId(715);
  const first = player.getOffsetFromInWorldCoords(1, 2, 3);
  assert.deepEqual(calls, [[1, 3, -2]]);
  assert.deepEqual({ x: first.x, y: first.y, z: first.z }, { x: 10, y: 30, z: 20 });
  result = Object.freeze({ x: -40, y: 50, z: 60 });
  const next = player.getOffsetFromInWorldCoords(-4, -5, -6);
  assert.deepEqual(calls.at(-1), [-4, -6, 5]);
  assert.deepEqual({ x: next.x, y: next.y, z: next.z }, { x: -40, y: -60, z: 50 });
  assert.deepEqual({ x: first.x, y: first.y, z: first.z }, { x: 10, y: 30, z: 20 });
  failure = Error("original native world-offset failure");
  assert.throws(
    () => player.getOffsetFromInWorldCoords(0, 0, 0),
    (e) => e === failure,
  );
});

test("client player model delegates its unsigned native hash without lookup or caching", () => {
  let modelHash = 4294967295,
    failure;
  const native = {
    id: 714,
    isExists: true,
    get modelHash() {
      if (failure) throw failure;
      return modelHash;
    },
    get model() {
      throw Error("SDK must read modelHash directly");
    },
  };
  globalThis.rockSandbox = { players: { getById: (id) => (id === native.id ? native : null) } };
  const player = mod.players.findByRemoteId(714);
  assert.equal(player.model, 4294967295);
  modelHash = 123;
  assert.equal(player.model, 123);
  assert.equal(player, mod.players.findByRemoteId(714));
  failure = Error("[RockSandbox:client] RockSandboxPlayer#714.modelHash: player is not streamed");
  assert.throws(
    () => player.model,
    (e) => e === failure,
  );
});

test("client name directly follows native rename and preserves original errors", () => {
  let name = "Игрок Alex",
    failure;
  const native = {
    id: 713,
    isExists: true,
    get name() {
      if (failure) throw failure;
      return name;
    },
  };
  globalThis.rockSandbox = { players: { getById: (id) => (id === native.id ? native : null) } };
  const player = mod.players.findByRemoteId(713);
  assert.equal(player.name, "Игрок Alex");
  name = "Новое имя Σ🙂";
  assert.equal(player.name, name);
  assert.equal(player, mod.players.findByRemoteId(713));
  failure = Error("[RockSandbox:client] RockSandboxPlayer#713.name: player is not streamed");
  assert.throws(
    () => player.name,
    (e) => e === failure,
  );
});

test("client health and isDead delegate separately without deriving state or caching native errors", () => {
  let health = 37,
    dead = true,
    failure;
  const native = {
    id: 712,
    isExists: true,
    get health() {
      if (failure) throw failure;
      return health;
    },
    get isDead() {
      if (failure) throw failure;
      return dead;
    },
  };
  globalThis.rockSandbox = { players: { getById: (id) => (id === native.id ? native : null) } };
  const player = mod.players.findByRemoteId(712);
  assert.equal(player.health, 37);
  assert.equal(player.isDead, true);
  // Deliberately independent fixture values prove that the SDK derives neither getter.
  health = 0;
  dead = false;
  assert.equal(player.health, 0);
  assert.equal(player.isDead, false);
  failure = Error("original native life state failure");
  assert.throws(
    () => player.health,
    (e) => e === failure,
  );
  assert.throws(
    () => player.isDead,
    (e) => e === failure,
  );
});

test("player dimension and orientation read native snapshots without SDK state", () => {
  let state = {
    dimension: 4294967295,
    heading: 90,
    position: { x: 1, y: 3, z: -2 },
    rotation: { x: 10, y: 20, z: 30 },
    forwardVector: { x: 1, y: 2, z: 3 },
  };
  const native = { id: 4294967295, isExists: true };
  for (const key of ["dimension", "heading", "position", "rotation", "forwardVector"])
    Object.defineProperty(native, key, { configurable: true, get: () => state[key] });
  globalThis.rockSandbox = { players: { getById: () => native, all: () => [native], local: native } };
  const player = mod.players.getByID(native.id);
  assert.equal(mod.players.getByID(native.id), player);
  assert.equal(mod.players.getLocalPlayer(), player);
  assert.equal(player.dimension, 4294967295);
  assert.equal(player.heading, 90);
  assert.deepEqual([player.rotation.x, player.rotation.y, player.rotation.z], [10, -30, 20]);
  assert.deepEqual([player.forwardVector.x, player.forwardVector.y, player.forwardVector.z], [1, -3, 2]);
  const previous = player.rotation;
  state = { ...state, dimension: 7, heading: 270, rotation: { x: 40, y: 50, z: 60 } };
  assert.equal(player.dimension, 7);
  assert.equal(player.heading, 270);
  assert.deepEqual([previous.x, previous.y, previous.z], [10, -30, 20]);
  assert.deepEqual([player.rotation.x, player.rotation.y, player.rotation.z], [40, -60, 50]);
  const original = Error("native player state failure");
  for (const key of ["dimension", "heading", "rotation", "forwardVector"]) {
    Object.defineProperty(native, key, {
      get: () => {
        throw original;
      },
    });
    assert.throws(
      () => player[key],
      (error) => error === original,
    );
  }
  assert.throws(() => player.setDimension(0), /not implemented/);
  native.setHeading = () => {
    throw original;
  };
  assert.throws(
    () => player.setHeading(0),
    (error) => error === original,
  );
});

test("raycasting delegates flags and all ignored handles, converts vectors and preserves native errors", () => {
  const calls = [];
  let hit = { entityHandle: 123, position: { x: 1, y: 2, z: 3 }, surfaceNormal: { x: 0, y: 1, z: 0 }, distance: 10 };
  globalThis.rockSandbox = {
    raycasting: {
      testPointToPoint: (...args) => {
        calls.push(args);
        return hit;
      },
    },
  };
  const query = mod.game.raycasting;
  const result = query.testPointToPoint(
    { x: 1, y: 2, z: 3 },
    { x: 4, y: 5, z: 6 },
    [{ handle: 40 }, { handle: 41 }],
    [1, 16],
  );
  assert.deepEqual(calls[0], [{ x: 1, y: 3, z: -2 }, { x: 4, y: 6, z: -5 }, [40, 41], [1, 16]]);
  assert.equal(result.entityHandle, 123);
  assert.deepEqual({ x: result.position.x, y: result.position.y, z: result.position.z }, { x: 1, y: -3, z: 2 });
  assert.deepEqual(
    { x: result.surfaceNormal.x, y: result.surfaceNormal.y, z: result.surfaceNormal.z },
    { x: 0, y: -0, z: 1 },
  );
  hit = null;
  assert.equal(query.testPointToPoint({ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { handle: 42 }, 17), null);
  assert.equal(calls[1][2], 42);
  query.testPointToPoint({ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 });
  assert.equal(calls[2][2], undefined);
  assert.equal(calls[2][3], undefined);
  const original = Error("native ray failure");
  globalThis.rockSandbox.raycasting.testPointToPoint = () => {
    throw original;
  };
  assert.throws(
    () => query.testPointToPoint({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }, null, 32),
    (error) => error === original,
  );
});

test("graphics delegates viewport and projection, converts axes and preserves native errors", () => {
  const calls = [];
  let size = { width: 1920, height: 1080 },
    result = { x: 0.25, y: 0.75 };
  globalThis.rockSandbox = {
    screen: {
      getResolution: () => size,
      worldToScreen: (position) => {
        calls.push(position);
        return result;
      },
    },
  };
  const graphics = mod.game.graphics;
  const first = graphics.getActiveScreenResolution();
  assert.deepEqual({ x: first.x, y: first.y }, { x: 1920, y: 1080 });
  size = { width: 600, height: 1200 };
  assert.equal(graphics.getActiveScreenResolution().x, 600);
  assert.equal(first.x, 1920);
  const at = graphics.world3dToScreen2d({ x: 1, y: 2, z: 3 });
  assert.deepEqual({ x: at.x, y: at.y }, result);
  assert.deepEqual(calls, [{ x: 1, y: 3, z: -2 }]);
  result = null;
  assert.equal(graphics.world3dToScreen2d({ x: 0, y: 1, z: 0 }), null);
  const original = Error("native viewport/projection unavailable");
  globalThis.rockSandbox.screen = {
    getResolution: () => {
      throw original;
    },
    worldToScreen: () => {
      throw original;
    },
  };
  assert.throws(
    () => graphics.getActiveScreenResolution(),
    (error) => error === original,
  );
  assert.throws(
    () => graphics.world3dToScreen2d({ x: 1, y: 2, z: 3 }),
    (error) => error === original,
  );
});

test("drawText forwards the original arguments without defaults or state and preserves native errors", () => {
  const calls = [];
  globalThis.rockSandbox = {
    screen: {
      drawText(...args) {
        calls.push(args);
      },
    },
  };
  const position = { x: 0.5, y: 0.75 },
    options = { font: 4, color: { r: 1, g: 2, b: 3 }, scale: [0.6, 0.3], centre: true, outline: false };
  assert.equal(mod.game.graphics.drawText("~g~Дверь", position, options), undefined);
  assert.deepEqual(calls[0], ["~g~Дверь", position, options]);
  assert.equal(calls[0][1], position);
  assert.equal(calls[0][2], options);
  mod.game.graphics.drawText("defaults", position);
  assert.equal(calls[1][2], undefined);
  const error = new TypeError("native text failure");
  globalThis.rockSandbox.screen.drawText = (...args) => {
    assert.deepEqual(args, [123, position, options]);
    throw error;
  };
  assert.throws(
    () => mod.game.graphics.drawText(123, position, options),
    (e) => e === error,
  );
});

test("screen fading delegates duration and preserves native errors", () => {
  const calls = [],
    original = Error("native fade error");
  globalThis.rockSandbox = {
    screen: {
      fadeIn: (duration) => calls.push(["in", duration]),
      fadeOut: (duration) => calls.push(["out", duration]),
    },
  };
  const screen = mod.game.camera;
  for (const duration of [0, 500, 4294967295]) {
    assert.equal(screen.screenFadeOut(duration), undefined);
    assert.equal(screen.screenFadeIn(duration), undefined);
  }
  assert.deepEqual(calls, [
    ["out", 0],
    ["in", 0],
    ["out", 500],
    ["in", 500],
    ["out", 4294967295],
    ["in", 4294967295],
  ]);
  globalThis.rockSandbox = {
    screen: {
      fadeIn: (duration) => {
        calls.push(duration);
        throw original;
      },
      fadeOut: (duration) => {
        calls.push(duration);
        throw original;
      },
    },
  };
  assert.throws(
    () => screen.screenFadeIn("invalid"),
    (error) => error === original,
  );
  assert.equal(calls.at(-1), "invalid");
  assert.throws(
    () => screen.screenFadeOut(-1),
    (error) => error === original,
  );
  assert.equal(calls.at(-1), -1);
});

test("cursor and pause menu delegate without SDK state and preserve errors", () => {
  const calls = [],
    original = Error("native input error");
  globalThis.rockSandbox = {
    cursor: {
      setVisible: (...args) => calls.push(["cursor", ...args]),
      getPosition: () => Object.freeze({ x: 123.5, y: 456.25 }),
    },
    ui: { setPauseMenuEnabled: (value) => calls.push(["menu", value]) },
  };
  for (const [freeze, visible] of [
    [true, true],
    [false, true],
    [true, false],
    [false, false],
  ])
    assert.equal(mod.game.cursor.show(freeze, visible), undefined);
  const position = mod.game.cursor.getPosition();
  assert.deepEqual([position.x, position.y], [123.5, 456.25]);
  assert.notEqual(mod.game.cursor.getPosition(), position);
  for (const enabled of [false, false, true]) assert.equal(mod.game.ui.setPauseMenuActive(enabled), undefined);
  assert.deepEqual(calls, [
    ["cursor", true, true],
    ["cursor", true, false],
    ["cursor", false, true],
    ["cursor", false, false],
    ["menu", false],
    ["menu", false],
    ["menu", true],
  ]);
  globalThis.rockSandbox = {
    cursor: {
      setVisible: (...args) => {
        calls.push(args);
        throw original;
      },
      getPosition: () => {
        throw original;
      },
    },
    ui: {
      setPauseMenuEnabled: (value) => {
        calls.push(value);
        throw original;
      },
    },
  };
  assert.throws(
    () => mod.game.cursor.show("invalid", null),
    (e) => e === original,
  );
  assert.deepEqual(calls.at(-1), [null, "invalid"]);
  assert.throws(
    () => mod.game.cursor.getPosition(),
    (e) => e === original,
  );
  assert.throws(
    () => mod.game.ui.setPauseMenuActive(1),
    (e) => e === original,
  );
  assert.equal(calls.at(-1), 1);
});

test("local player transform setters only convert axes and delegate native validation/errors", () => {
  const calls = [],
    failure = Error("native transform error");
  let fail = false;
  const native = {
    id: 901,
    setPosition(position) {
      assert.equal(this, native);
      if (fail) throw failure;
      calls.push(["position", position]);
    },
    setHeading(value) {
      assert.equal(this, native);
      if (fail) throw failure;
      calls.push(["heading", value]);
    },
  };
  globalThis.rockSandbox = { players: { local: native } };
  const player = mod.players.getLocalPlayer();
  assert.equal(player.setPosition({ x: 1, y: 2, z: 3 }), undefined);
  for (const heading of [90, -450, NaN, "bad", undefined]) assert.equal(player.setHeading(heading), undefined);
  assert.deepEqual(calls, [
    ["position", { x: 1, y: 3, z: -2 }],
    ...[90, -450, NaN, "bad", undefined].map((v) => ["heading", v]),
  ]);
  fail = true;
  assert.throws(
    () => player.setPosition({ x: 0, y: 0, z: 0 }),
    (e) => e === failure,
  );
  assert.throws(
    () => player.setHeading(0),
    (e) => e === failure,
  );
});

test("local preview peds delegate creation, mutation, lookup and deletion without SDK state", async () => {
  const calls = [];
  const failure = new Error("native ped error");
  const native = {
    id: 3,
    remoteId: null,
    handle: 123,
    isExists: true,
    modelHash: 456,
    alpha: 128,
    setPosition: (v) => calls.push(["position", v]),
    setRotation: (v) => calls.push(["rotation", v]),
    setModel: (v) => calls.push(["model", v]),
    setHeading: (v) => calls.push(["heading", v]),
    setDimension: (v) => calls.push(["dimension", v]),
    setVisible: (v) => calls.push(["visible", v]),
    setAlpha: (v) => calls.push(["alpha", v]),
    destroy: () => calls.push(["destroy"]),
  };
  globalThis.rockSandbox = {
    peds: {
      create: (options) => {
        calls.push(["create", options]);
        return native;
      },
      getById: () => native,
      getByRemoteId: () => null,
      all: () => [native],
    },
  };
  try {
    const p = mod.peds.create({
      model: "mp_f_freemode_01",
      position: { x: 1, y: 2, z: 3 },
      rotation: { x: 4, y: 5, z: 6 },
      dimension: 7,
    });
    assert.equal(p, mod.peds.getByID(3));
    assert.equal(p, [...mod.peds.iterator.all()][0]);
    assert.equal(mod.peds.findByRemoteID(3), null);
    assert.equal(p.remoteId, null);
    assert.equal(p.handle, 123);
    assert.equal(p.alpha, 128);
    p.setModel("g_m_y_ballaeast_01");
    p.setPosition({ x: 8, y: 9, z: 10 });
    p.setRotation({ x: 11, y: 12, z: 13 });
    p.setHeading(20);
    p.setDimension(99);
    p.setVisible(false);
    p.setAlpha(0);
    p.resetAlpha();
    assert.deepEqual(calls, [
      [
        "create",
        { model: "mp_f_freemode_01", position: { x: 1, y: 3, z: -2 }, rotation: { x: 4, y: 6, z: -5 }, dimension: 7 },
      ],
      ["model", "g_m_y_ballaeast_01"],
      ["position", { x: 8, y: 10, z: -9 }],
      ["rotation", { x: 11, y: 13, z: -12 }],
      ["heading", 20],
      ["dimension", 99],
      ["visible", false],
      ["alpha", 0],
      ["alpha", 255],
    ]);
    assert.equal(mod.peds.deleteById(3), p);
    assert.deepEqual(calls.at(-1), ["destroy"]);
    native.setModel = () => {
      throw failure;
    };
    assert.throws(
      () => p.setModel("bad"),
      (e) => e === failure,
    );
    native.setHeadBlendData = () => {
      throw failure;
    };
    assert.throws(
      () => p.setHeadBlendData(),
      (e) => e === failure,
    );
    assert.throws(() => p.setCollision(true, true), /not implemented/);
  } finally {
    delete globalThis.rockSandbox;
  }
});

test("appearance methods delegate unchanged to native ped/player handles, including errors", () => {
  const methods = [
    ["setDecoration", ["collection", "overlay"]],
    ["removeDecoration", ["a", "b"]],
    ["clearDecorations", []],
    ["setHeadBlendData", [1, 2, 0, 3, 4, 0, 0.2, 0.5, 0, false]],
    ["setFaceFeature", [0, 0.5]],
    ["setHeadOverlay", [0, 255, 0.5]],
    ["setHeadOverlayColor", [0, 1, 2, 3]],
    ["setEyeColor", [1]],
    ["setHairColor", [1, 2]],
    ["setComponentVariation", [2, 0, 0, 0]],
    ["setPropertyVariation", [1, 0, 0, true]],
    ["clearProp", [1]],
  ];
  const native = { id: 91 };
  globalThis.rockSandbox = { peds: { getById: () => native }, players: { getById: () => native } };
  try {
    for (const target of [mod.peds.getByID(91), mod.players.getByID(91)]) {
      for (const [name, base] of methods) {
        const args = name === "setHeadOverlay" && target === mod.players.getByID(91) ? [...base, 4, 5] : base;
        // SDK does not validate or normalize even deliberately malformed input.
        for (const values of [args, [undefined, NaN, {}, "bad"]]) {
          let received;
          native[name] = (...values) => {
            received = values;
          };
          assert.equal(target[name](...values), undefined);
          const count =
            name === "setHeadOverlay"
              ? target === mod.players.getByID(91)
                ? 5
                : 3
              : name === "setHeadBlendData"
                ? 10
                : base.length;
          assert.deepEqual(
            received,
            Array.from({ length: count }, (_, i) => values[i]),
          );
          const failure = Error("original native appearance error");
          native[name] = () => {
            throw failure;
          };
          assert.throws(
            () => target[name](...values),
            (e) => e === failure,
          );
        }
      }
    }
  } finally {
    delete globalThis.rockSandbox;
  }
});
