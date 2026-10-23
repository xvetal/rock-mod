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
  assert.throws(() => mod.players.getLocalPlayer(), /not implemented/);
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
