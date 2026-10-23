import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
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
const bundle = await rollup({ input: resolve("dist/client/index.js"), plugins: [nodeResolve(), commonjs()] });
const file = join(directory, "client.cjs");
await bundle.write({ file, format: "cjs", inlineDynamicImports: true });
await bundle.close();
const { RockMod } = createRequire(import.meta.url)(file);
assert.equal("mp" in globalThis, false);
assert.equal("vimp" in globalThis, false);
const mod = await RockMod.create({ multiplayer: "RockSandbox" });

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
