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
  ].join("\n"),
);
const bundle = await rollup({ input: entry, plugins: [nodeResolve(), commonjs()] });
const file = join(directory, "client.cjs");
await bundle.write({ file, format: "cjs", inlineDynamicImports: true });
await bundle.close();
const { RockMod, RagePlayersManager, VIMPPlayersManager } = createRequire(import.meta.url)(file);
assert.equal("mp" in globalThis, false);
assert.equal("vimp" in globalThis, false);
const mod = await RockMod.create({ multiplayer: "RockSandbox" });

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
  assert.throws(() => player.health, /not implemented/);
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
