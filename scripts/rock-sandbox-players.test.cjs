"use strict";
const assert = require("node:assert/strict");
const { before, beforeEach, afterEach, test } = require("node:test");
const { RockMod, RockModBaseObjectType } = require("../dist");

let mod;
let records;
let handles;
before(async () => {
  assert.equal("mp" in globalThis, false);
  assert.equal("vimp" in globalThis, false);
  mod = await RockMod.create({ multiplayer: "RockSandbox" });
});
beforeEach(() => {
  Reflect.deleteProperty(globalThis, "rockSandbox");
  records = new Map();
  handles = new Map();
});
afterEach(() => Reflect.deleteProperty(globalThis, "rockSandbox"));

function host() {
  const handle = (id) => {
    if (!handles.has(id)) {
      const state = (member) => {
        if (!records.has(id))
          throw new Error(`[RockSandbox:server] RockSandboxPlayer.${member}: player ${id} is disconnected`);
        return records.get(id);
      };
      handles.set(
        id,
        Object.freeze({
          id,
          get isExists() {
            return records.has(id);
          },
          get name() {
            return state("name").name;
          },
          get health() {
            return state("health").health;
          },
          get isDead() {
            return state("isDead").isDead;
          },
          get position() {
            return Object.freeze({ ...state("position").position });
          },
        }),
      );
    }
    return handles.get(id);
  };
  Reflect.set(globalThis, "rockSandbox", {
    players: {
      all: () => Object.freeze([...records.keys()].sort((a, b) => a - b).map(handle)),
      getById: (id) => (records.has(id) ? handle(id) : null),
    },
  });
}

test("creation and iterator access need no host; missing APIs fail at the native call", () => {
  assert.equal(typeof mod.players.iterator.all, "function");
  for (const candidate of [undefined, null, {}, { players: {} }, { players: { all() {} } }]) {
    Reflect.set(globalThis, "rockSandbox", candidate);
    assert.throws(() => mod.players.findByID(1), TypeError);
    assert.throws(() => mod.players.iterator.all(), TypeError);
    assert.throws(() => mod.players.findByName("name"), TypeError);
  }
});

test("player queries use the current host without checking unrelated APIs or wrapping errors", () => {
  const calls = [];
  Reflect.set(globalThis, "rockSandbox", {
    players: {
      getById(id) {
        calls.push(id);
        return null;
      },
    },
  });
  assert.equal(mod.players.findByID(17), null);
  assert.deepEqual(calls, [17]);

  const failure = new Error("native player failure");
  Reflect.set(globalThis, "rockSandbox", {
    players: {
      getById() {
        throw failure;
      },
      all() {
        throw failure;
      },
    },
  });
  for (const operation of [
    () => mod.players.findByID(17),
    () => mod.players.iterator.all(),
    () => mod.players.findByName("name"),
  ]) {
    assert.throws(operation, (error) => error === failure);
  }
});

test("events delegate to the current host with original handlers, arguments and errors", () => {
  const calls = [];
  const listener = () => {};
  const value = {};
  const event = "rm::entityCreated";
  const api = {
    on(...args) {
      calls.push(["on", ...args]);
    },
    off(...args) {
      calls.push(["off", ...args]);
    },
    emit(...args) {
      calls.push(["emit", ...args]);
    },
  };
  Reflect.set(globalThis, "rockSandbox", api);
  mod.net.events.onInternal({ [event]: listener });
  mod.net.events.offInternal(event, listener);
  mod.net.events.emitInternal(event, value);
  assert.deepEqual(calls, [
    ["on", event, listener],
    ["off", event, listener],
    ["emit", event, value],
  ]);
  assert.equal(calls[0][2], listener);
  assert.equal(calls[1][2], listener);
  assert.equal(calls[2][2], value);

  const failure = new Error("native event failure");
  const fail = () => {
    throw failure;
  };
  Reflect.set(globalThis, "rockSandbox", { on: fail, off: fail, emit: fail });
  const operations = [
    () => mod.net.events.onInternal({ [event]: listener }),
    () => mod.net.events.offInternal(event, listener),
    () => mod.net.events.emitInternal(event, value),
  ];
  for (const operation of operations) assert.throws(operation, (error) => error === failure);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  for (const operation of operations) assert.throws(operation, TypeError);

  // Calling an available method does not require the rest of the host API.
  Reflect.set(globalThis, "rockSandbox", { on: api.on });
  mod.net.events.onInternal({ [event]: listener });
  assert.deepEqual(calls[3], ["on", event, listener]);
});

test("native lookups preserve wrapper identity, exact name search and coordinate conversion", () => {
  records.set(2, { name: "Игрок Alpha", position: { x: 7, y: 11, z: -13 } });
  records.set(1, { name: "Игрок Alpha", position: { x: 3, y: 5, z: 9 } });
  host();
  const first = mod.players.getByID(1);
  assert.equal(first, mod.players.findByID(1));
  assert.equal(first, mod.players.getByName("Игрок Alpha"));
  assert.equal(first, mod.players.findByName("Игрок Alpha"));
  assert.equal(mod.players.findByName("игрок alpha"), null);
  assert.deepEqual(
    [...mod.players.iterator.all()].map((p) => p.id),
    [1, 2],
  );
  assert.equal([...mod.players.iterator.all()][0], first);
  assert.equal(first.type, RockModBaseObjectType.Player);
  assert.equal(first.isExists, true);
  const position = first.position;
  assert.deepEqual([position.x, position.y, position.z], [3, -9, 5]);
  records.get(1).position = { x: 17, y: 19, z: 23 };
  assert.deepEqual([first.position.x, first.position.y, first.position.z], [17, -23, 19]);
  assert.deepEqual([position.x, position.y, position.z], [3, -9, 5]);
  assert.equal(mod.players.findByID(99), null);
  assert.throws(() => mod.players.getByID(99), /99 not found/);
  assert.throws(() => mod.players.getByName("absent"), /absent not found/);
});

test("iterator membership is captured on call and disconnected wrappers keep their ID", () => {
  records.set(1, { name: "One", position: { x: 1, y: 2, z: 3 } });
  host();
  const iterator = mod.players.iterator.all();
  const player = mod.players.getByID(1);
  records.delete(1);
  assert.equal(iterator.next().value, player);
  assert.equal(player.id, 1);
  assert.equal(player.isExists, false);
  assert.equal(mod.players.findByID(1), null);
  assert.deepEqual([...mod.players.iterator.all()], []);
  assert.throws(() => player.name, /RockSandboxPlayer.name.*1.*disconnected/);
  assert.throws(() => player.position, /RockSandboxPlayer.position.*1.*disconnected/);
  records.set(2, { name: "One", position: { x: 1, y: 2, z: 3 } });
  assert.notEqual(mod.players.getByID(2), player);
  assert.equal(player.isExists, false);
});

test("unsupported gameplay operations retain diagnostic stubs", () => {
  records.set(1, { name: "One", position: { x: 1, y: 2, z: 3 } });
  host();
  const player = mod.players.getByID(1);
  for (const operation of [
    () => player.armour,
    () => player.dimension,
    () => player.destroy(),
    () => mod.players.getBySocialClub("value"),
    () => mod.players.iterator.range3D(player.position, 10),
    () => mod.objects.findByID(1),
  ]) {
    assert.throws(operation, /\[RockSandbox:server\].*: not implemented/);
  }
});

test("lifecycle bridges are lazy, installed once per host, and retain native handler identity", () => {
  records.set(1, { name: "One", position: { x: 1, y: 2, z: 3 } });
  host();
  const api = globalThis.rockSandbox;
  const subscriptions = [];
  const listeners = new Map();
  Object.assign(api, {
    on(event, handler) {
      subscriptions.push([event, handler]);
      const list = listeners.get(event) || [];
      list.push(handler);
      listeners.set(event, list);
    },
    off(event, handler) {
      const list = listeners.get(event) || [];
      const index = list.lastIndexOf(handler);
      if (index >= 0) list.splice(index, 1);
    },
    emit(event, ...args) {
      for (const handler of [...(listeners.get(event) || [])]) handler(...args);
    },
  });
  const calls = [];
  const connected = (player) => calls.push(["connected", player]);
  const disconnected = (player) => calls.push(["disconnected", player]);
  mod.net.events.onInternal({ "rm::entityCreated": () => {} });
  assert.equal(subscriptions.length, 1);
  const native = api.players.getById(1);
  api.emit("playerConnected", native); // No replay for a late SDK subscription.
  mod.net.events.onInternal({ "rm::playerConnected": connected });
  mod.net.events.onInternal({ "rm::playerConnected": connected, "rm::playerDisconnected": disconnected });
  assert.equal(subscriptions.filter(([name]) => name === "playerConnected").length, 1);
  assert.equal(subscriptions.filter(([name]) => name === "playerDisconnected").length, 1);
  assert.equal(subscriptions.find(([name]) => name === "rm::playerConnected")[1], connected);
  assert.deepEqual(calls, []);
  const wrapped = mod.players.getByID(1);
  api.emit("playerConnected", native);
  assert.deepEqual(calls.splice(0), [
    ["connected", wrapped],
    ["connected", wrapped],
  ]);
  mod.net.events.offInternal("rm::playerConnected", connected);
  api.emit("playerConnected", native);
  assert.deepEqual(calls.splice(0), [["connected", wrapped]]);
  records.delete(1);
  api.emit("playerDisconnected", native);
  assert.deepEqual(calls.splice(0), [["disconnected", wrapped]]);
  assert.equal(wrapped.isExists, false);
  assert.equal(mod.players.findByID(1), null);
  const failure = new Error("SDK lifecycle failure");
  const fail = () => {
    throw failure;
  };
  mod.net.events.onInternal({ "rm::playerDisconnected": fail });
  assert.throws(
    () => api.emit("playerDisconnected", native),
    (error) => error === failure,
  );
  mod.net.events.offInternal("rm::playerDisconnected", fail);
  api.emit("playerDisconnected", native);

  const replacement = { on: api.on, off: api.off, emit: api.emit };
  Reflect.set(globalThis, "rockSandbox", replacement);
  mod.net.events.onInternal({ "rm::playerDisconnected": disconnected });
  assert.equal(subscriptions.filter(([name]) => name === "playerConnected").length, 2);
  assert.equal(subscriptions.filter(([name]) => name === "playerDisconnected").length, 2);
  Reflect.set(globalThis, "rockSandbox", api);
  mod.net.events.onInternal({ "rm::playerConnected": connected });
  assert.equal(subscriptions.filter(([name]) => name === "playerConnected").length, 2);
});

test("kick delegates once to its native handle, preserving the reason, receiver and exception", () => {
  const calls = [];
  const failure = new Error("native kick failed");
  let failing = false;
  const native = {
    id: 42,
    kick(reason) {
      assert.equal(this, native);
      calls.push(reason);
      if (failing) throw failure;
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(42);
  // Existing wrappers continue delegating without reading or validating a host.
  Reflect.deleteProperty(globalThis, "rockSandbox");
  for (const reason of [undefined, "", "  Причина выхода 🚪  "]) {
    assert.equal(player.kick(reason), undefined);
  }
  assert.deepEqual(calls, [undefined, "", "  Причина выхода 🚪  "]);
  failing = true;
  assert.throws(
    () => player.kick("failure"),
    (error) => error === failure,
  );
  assert.equal(calls.length, 4);
});

test("setPosition rotates coordinates and delegates without host access or gameplay state", () => {
  const calls = [];
  const failure = new Error("native movement failed");
  let failing = false;
  const native = {
    id: 43,
    setPosition(position) {
      assert.equal(this, native);
      calls.push(position);
      if (failing) throw failure;
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(43);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  const position = Object.freeze({ x: 12.5, y: -3, z: 7 });
  assert.equal(player.setPosition(position), undefined);
  assert.deepEqual(calls, [{ x: 12.5, y: 7, z: 3 }]);
  assert.notEqual(calls[0], position);
  failing = true;
  assert.throws(
    () => player.setPosition(position),
    (error) => error === failure,
  );
  assert.equal(calls.length, 2);
});

test("spawn rotates coordinates and delegates without host access or gameplay state", () => {
  const calls = [];
  const failure = new Error("native movement failed");
  let failing = false;
  const native = {
    id: 43,
    spawn(position) {
      assert.equal(this, native);
      calls.push(position);
      if (failing) throw failure;
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(43);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  const position = Object.freeze({ x: 12.5, y: -3, z: 7 });
  assert.equal(player.spawn(position), undefined);
  assert.deepEqual(calls, [{ x: 12.5, y: 7, z: 3 }]);
  assert.notEqual(calls[0], position);
  failing = true;
  assert.throws(
    () => player.spawn(position),
    (error) => error === failure,
  );
  assert.equal(calls.length, 2);
});

test("health and isDead delegate to native getters without deriving or caching state", () => {
  let health = 31;
  let dead = true;
  let failure;
  const error = new Error("native getter failure");
  const native = {
    id: 44,
    get health() {
      if (failure) throw error;
      return health;
    },
    get isDead() {
      if (failure) throw error;
      return dead;
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(44);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  assert.equal(player.health, 31);
  assert.equal(player.isDead, true);
  health = 0;
  dead = false;
  assert.equal(player.health, 0);
  assert.equal(player.isDead, false);
  failure = true;
  assert.throws(
    () => player.health,
    (caught) => caught === error,
  );
  assert.throws(
    () => player.isDead,
    (caught) => caught === error,
  );
});

test("setHealth delegates values without validation or clamping and preserves native errors", () => {
  const calls = [];
  const failure = new Error("native health failed");
  let failing = false;
  const native = {
    id: 45,
    setHealth(value) {
      assert.equal(this, native);
      calls.push(value);
      if (failing) throw failure;
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(45);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  const values = [0, 100, 50, -1, 101, 1.5, undefined];
  for (const value of values) assert.equal(player.setHealth(value), undefined);
  assert.deepEqual(calls, values);
  failing = true;
  assert.throws(
    () => player.setHealth(50),
    (error) => error === failure,
  );
  assert.equal(calls.length, values.length + 1);
});

test("autoRespawn reads native publication and delegates policy commands without validation or caching", () => {
  const calls = [];
  const failure = new Error("native policy failed");
  let published = true;
  let failing = false;
  const native = {
    id: 46,
    get autoRespawn() {
      if (failing) throw failure;
      return published;
    },
    setAutoRespawn(value) {
      assert.equal(this, native);
      if (failing) throw failure;
      calls.push(value);
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(46);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  assert.equal(player.autoRespawn, true);
  const values = [false, true, true, false, 1, "false", undefined, null];
  for (const value of values) assert.equal(player.setAutoRespawn(value), undefined);
  assert.deepEqual(calls, values);
  assert.equal(player.autoRespawn, true);
  published = false;
  assert.equal(player.autoRespawn, false);
  failing = true;
  assert.throws(
    () => player.autoRespawn,
    (error) => error === failure,
  );
  assert.throws(
    () => player.setAutoRespawn(true),
    (error) => error === failure,
  );
});

test("other platform adapters explicitly reject automatic respawn APIs", () => {
  // Loading AltV's existing module requires its global aliases; no game objects run.
  Reflect.set(globalThis, "AltVShared", { Vector3: class {}, hash() {} });
  Reflect.set(globalThis, "AltVServer", {});
  try {
    for (const [platform, name] of [
      ["ragemp", "Rage"],
      ["vimp", "VIMP"],
      ["altv", "AltV"],
      ["mock", "Mock"],
    ]) {
      const Class = require(`../dist/server/entities/${platform}/player/${name}Player`)[`${name}Player`];
      const getter = Object.getOwnPropertyDescriptor(Class.prototype, "autoRespawn").get;
      assert.throws(() => getter.call(undefined), new RegExp(`${name}Player.autoRespawn`));
      assert.throws(
        () => Class.prototype.setAutoRespawn.call(undefined, false),
        new RegExp(`${name}Player.setAutoRespawn`),
      );
    }
  } finally {
    Reflect.deleteProperty(globalThis, "AltVShared");
    Reflect.deleteProperty(globalThis, "AltVServer");
  }
});
