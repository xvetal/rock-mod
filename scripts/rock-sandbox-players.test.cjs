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
          get profileId() {
            return state("profileId").profileId;
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

test("server model reads and assignment delegate exact names and preserve native errors", () => {
  const calls = [], error = new Error("native model error");
  let fail = false;
  const native = { id: 74,
    get modelHash() { if (fail) throw error; return 2627665880; },
    setModel(value) { if (fail) throw error; calls.push(value); },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(74);
  assert.equal(player.model, 2627665880);
  for (const value of ["mp_m_freemode_01", "mp_f_freemode_01", "unknown", 1, undefined])
    assert.equal(player.setModel(value), undefined);
  assert.deepEqual(calls, ["mp_m_freemode_01", "mp_f_freemode_01", "unknown", 1, undefined]);
  fail = true;
  assert.throws(() => player.model, (e) => e === error);
  assert.throws(() => player.setModel("streetwear"), (e) => e === error);
});

test("server weapon getters and commands delegate unchanged and preserve native errors", () => {
  const calls = [];
  const error = new Error("native weapon error");
  let fail = false;
  const native = {
    id: 73,
    get weapon() {
      if (fail) throw error;
      return 324215364;
    },
    get weaponAmmo() {
      if (fail) throw error;
      return 1000;
    },
  };
  for (const member of ["giveWeapon", "setWeaponAmmo", "removeWeapon"])
    native[member] = (...args) => {
      if (fail) throw error;
      calls.push([member, ...args]);
    };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const p = mod.players.getByID(73);
  assert.equal(p.weapon, 324215364);
  assert.equal(p.weaponAmmo, 1000);
  for (const weapon of ["mp5", "weapon_smg", "unsupported", 1, undefined]) {
    assert.equal(p.giveWeapon(weapon, 1000), undefined);
    assert.equal(p.setWeaponAmmo(weapon, -1), undefined);
    assert.equal(p.removeWeapon(weapon), undefined);
  }
  assert.deepEqual(
    calls,
    ["mp5", "weapon_smg", "unsupported", 1, undefined].flatMap((w) => [
      ["giveWeapon", w, 1000],
      ["setWeaponAmmo", w, -1],
      ["removeWeapon", w],
    ]),
  );
  fail = true;
  for (const call of [
    () => p.weapon,
    () => p.weaponAmmo,
    () => p.giveWeapon("mp5", 3),
    () => p.setWeaponAmmo("mp5", 3),
    () => p.removeWeapon("mp5"),
  ])
    assert.throws(call, (e) => e === error);
});

test("client events install one native bridge and delegate handlers and sends unchanged", () => {
  const calls = [];
  const subscriptions = [];
  const native = { id: 73, emitEvent: (...args) => calls.push(["player", ...args]) };
  const api = {
    players: { getById: () => native },
    on: (name, handler) => subscriptions.push([name, handler]),
    off: (...args) => calls.push(["off", ...args]),
    emit: (...args) => calls.push(["emit", ...args]),
    emitAllClients: (...args) => calls.push(["all", ...args]),
  };
  Reflect.set(globalThis, "rockSandbox", api);
  const listener = () => {};
  mod.net.events.onClient({ request: listener });
  mod.net.events.onClient({ request: listener });
  assert.equal(subscriptions.filter(([name]) => name === "clientEvent").length, 1);
  assert.deepEqual(subscriptions.slice(1), [
    ["rm::client:request", listener],
    ["rm::client:request", listener],
  ]);
  const player = mod.players.getByID(73);
  const value = { nested: [1, 2] };
  subscriptions[0][1](native, "request", [value]);
  mod.net.events.offClient("request", listener);
  mod.net.events.emitClient(player, "response", value);
  player.emitEvent("direct", value);
  mod.net.events.emitAllClients("broadcast", value);
  assert.deepEqual(calls, [
    ["emit", "rm::client:request", player, value],
    ["off", "rm::client:request", listener],
    ["player", "response", value],
    ["player", "direct", value],
    ["all", "broadcast", value],
  ]);
  const error = new Error("native-send-failure");
  native.emitEvent = () => {
    throw error;
  };
  assert.throws(
    () => player.emitEvent("response"),
    (failure) => failure === error,
  );
});

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

test("socialClub delegates the native profile ID and propagates errors unchanged", () => {
  const profileId = "rock-sandbox:profile:3974b6a0-894b-4dfa-9448-98748253be40";
  records.set(1, { profileId });
  host();
  const player = mod.players.getByID(1);
  assert.equal(player.socialClub, profileId);
  const failure = new Error("native profile unavailable");
  Reflect.set(globalThis, "rockSandbox", {
    players: {
      getById: () => ({
        get profileId() {
          throw failure;
        },
      }),
    },
  });
  assert.throws(
    () => mod.players.getByID(2).socialClub,
    (error) => error === failure,
  );
  records.delete(1);
  assert.throws(() => player.socialClub, /RockSandboxPlayer.profileId.*1.*disconnected/);
});

test("unsupported gameplay operations retain diagnostic stubs", () => {
  records.set(1, { name: "One", position: { x: 1, y: 2, z: 3 } });
  host();
  const player = mod.players.getByID(1);
  for (const operation of [
    () => player.serial,
    () => player.destroy(),
    () => mod.players.getBySocialClub("value"),
    () => mod.players.iterator.range3D(player.position, 10),
    () => mod.objects.iterator.dimension(1),
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
  const exit = Object.freeze({
    exitType: "kicked",
    reason: "Причина выхода 🚪",
    snapshot: Object.freeze({
      id: 1,
      health: 37,
      weaponAmmo: 7,
      heading: 62.5,
      dimension: 9,
      position: Object.freeze({ x: 1, y: 2, z: 3 }),
    }),
  });
  const quits = [];
  const quit = (...args) => quits.push(args);
  mod.net.events.onInternal({ "rm::playerQuit": quit });
  assert.equal(subscriptions.find(([name]) => name === "rm::playerQuit")[1], quit);
  api.emit("playerDisconnected", native, exit);
  assert.deepEqual(calls.splice(0), [["disconnected", wrapped]]);
  assert.equal(quits[0][0], wrapped);
  assert.deepEqual(quits[0].slice(1), ["kicked", exit.reason, { ...exit.snapshot, position: { x: 1, y: -3, z: 2 } }]);
  assert.equal(Object.isFrozen(quits[0][3]), true);
  assert.equal(Object.isFrozen(quits[0][3].position), true);
  assert.equal(wrapped.isExists, false);
  assert.equal(mod.players.findByID(1), null);
  const failure = new Error("SDK lifecycle failure");
  const fail = () => {
    throw failure;
  };
  mod.net.events.onInternal({ "rm::playerDisconnected": fail });
  assert.throws(
    () => api.emit("playerDisconnected", native, exit),
    (error) => error === failure,
  );
  mod.net.events.offInternal("rm::playerDisconnected", fail);
  api.emit("playerDisconnected", native, exit);

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

test("collisionWithPlayers reads native publication and delegates policy commands without validation or caching", () => {
  const calls = [];
  const failure = new Error("native policy failed");
  let published = true;
  let failing = false;
  const native = {
    id: 506,
    get collisionWithPlayers() {
      if (failing) throw failure;
      return published;
    },
    setCollisionWithPlayers(value) {
      assert.equal(this, native);
      if (failing) throw failure;
      calls.push(value);
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(506);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  assert.equal(player.collisionWithPlayers, true);
  const values = [false, true, true, false, 1, "false", undefined, null];
  for (const value of values) assert.equal(player.setCollisionWithPlayers(value), undefined);
  assert.deepEqual(calls, values);
  assert.equal(player.collisionWithPlayers, true);
  published = false;
  assert.equal(player.collisionWithPlayers, false);
  failing = true;
  assert.throws(
    () => player.collisionWithPlayers,
    (error) => error === failure,
  );
  assert.throws(
    () => player.setCollisionWithPlayers(true),
    (error) => error === failure,
  );
});
test("invincible reads native publication and delegates policy commands without validation or caching", () => {
  const calls = [];
  const failure = new Error("native policy failed");
  let published = true;
  let failing = false;
  const native = {
    id: 507,
    get invincible() {
      if (failing) throw failure;
      return published;
    },
    setInvincible(value) {
      assert.equal(this, native);
      if (failing) throw failure;
      calls.push(value);
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(507);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  assert.equal(player.invincible, true);
  const values = [false, true, true, false, 1, "false", undefined, null];
  for (const value of values) assert.equal(player.setInvincible(value), undefined);
  assert.deepEqual(calls, values);
  assert.equal(player.invincible, true);
  published = false;
  assert.equal(player.invincible, false);
  failing = true;
  assert.throws(
    () => player.invincible,
    (error) => error === failure,
  );
  assert.throws(
    () => player.setInvincible(true),
    (error) => error === failure,
  );
});
test("frozen reads native publication and delegates policy commands without validation or caching", () => {
  const calls = [];
  const failure = new Error("native policy failed");
  let published = true;
  let failing = false;
  const native = {
    id: 508,
    get frozen() {
      if (failing) throw failure;
      return published;
    },
    freezePosition(value) {
      assert.equal(this, native);
      if (failing) throw failure;
      calls.push(value);
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(508);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  assert.equal(player.frozen, true);
  const values = [false, true, true, false, 1, "false", undefined, null];
  for (const value of values) assert.equal(player.freezePosition(value), undefined);
  assert.deepEqual(calls, values);
  assert.equal(player.frozen, true);
  published = false;
  assert.equal(player.frozen, false);
  failing = true;
  assert.throws(
    () => player.frozen,
    (error) => error === failure,
  );
  assert.throws(
    () => player.freezePosition(true),
    (error) => error === failure,
  );
});

test("clientTransformEnabled reads native publication and delegates policy commands without validation or caching", () => {
  const calls = [];
  const failure = new Error("native policy failed");
  let published = true;
  let failing = false;
  const native = {
    id: 508,
    get clientTransformEnabled() {
      if (failing) throw failure;
      return published;
    },
    setClientTransformEnabled(value) {
      assert.equal(this, native);
      if (failing) throw failure;
      calls.push(value);
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(508);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  assert.equal(player.clientTransformEnabled, true);
  const values = [false, true, true, false, 1, "false", undefined, null];
  for (const value of values) assert.equal(player.setClientTransformEnabled(value), undefined);
  assert.deepEqual(calls, values);
  assert.equal(player.clientTransformEnabled, true);
  published = false;
  assert.equal(player.clientTransformEnabled, false);
  failing = true;
  assert.throws(
    () => player.clientTransformEnabled,
    (error) => error === failure,
  );
  assert.throws(
    () => player.setClientTransformEnabled(true),
    (error) => error === failure,
  );
});

test("collisionEnabled reads native publication and delegates policy commands without validation or caching", () => {
  const calls = [];
  const failure = new Error("native policy failed");
  let published = true;
  let failing = false;
  const native = {
    id: 508,
    get collisionEnabled() {
      if (failing) throw failure;
      return published;
    },
    setCollision(value, keepPhysics) {
      assert.equal(this, native);
      if (failing) throw failure;
      calls.push([value, keepPhysics]);
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(508);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  assert.equal(player.collisionEnabled, true);
  const values = [false, true, true, false, 1, "false", undefined, null];
  for (const value of values) assert.equal(player.setCollision(value, value), undefined);
  assert.deepEqual(
    calls,
    values.map((value) => [value, value]),
  );
  assert.equal(player.collisionEnabled, true);
  published = false;
  assert.equal(player.collisionEnabled, false);
  failing = true;
  assert.throws(
    () => player.collisionEnabled,
    (error) => error === failure,
  );
  assert.throws(
    () => player.setCollision(true, false),
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

test("other platform adapters explicitly reject player collision APIs", () => {
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
      const full = Object.getOwnPropertyDescriptor(Class.prototype, "collisionEnabled").get;
      assert.throws(() => full.call(undefined), new RegExp(`${name}Player.collisionEnabled`));
      assert.throws(
        () => Class.prototype.setCollision.call(undefined, false, true),
        new RegExp(`${name}Player.setCollision`),
      );
      const getter = Object.getOwnPropertyDescriptor(Class.prototype, "collisionWithPlayers").get;
      assert.throws(() => getter.call(undefined), new RegExp(`${name}Player.collisionWithPlayers`));
      assert.throws(
        () => Class.prototype.setCollisionWithPlayers.call(undefined, false),
        new RegExp(`${name}Player.setCollisionWithPlayers`),
      );
    }
  } finally {
    Reflect.deleteProperty(globalThis, "AltVShared");
    Reflect.deleteProperty(globalThis, "AltVServer");
  }
});

test("death bridge subscribes once, preserves handles and raw reason, and forwards exactly three SDK arguments", () => {
  records.set(47, { name: "Victim", position: { x: 1, y: 2, z: 3 } });
  records.set(48, { name: "Killer", position: { x: 4, y: 5, z: 6 } });
  host();
  const api = globalThis.rockSandbox;
  const listeners = new Map();
  const subscriptions = [];
  Object.assign(api, {
    on(name, handler) {
      subscriptions.push([name, handler]);
      const list = listeners.get(name) || [];
      list.push(handler);
      listeners.set(name, list);
    },
    off(name, handler) {
      const list = listeners.get(name) || [];
      const index = list.lastIndexOf(handler);
      if (index >= 0) list.splice(index, 1);
    },
    emit(name, ...args) {
      for (const handler of [...(listeners.get(name) || [])]) handler(...args);
    },
  });
  const nativeVictim = api.players.getById(47);
  const nativeKiller = api.players.getById(48);
  const victim = mod.players.getByID(47);
  const killer = mod.players.getByID(48);
  const context = Object.freeze({ life: 9007199254740993n, tick: 18446744073709551615n });
  const calls = [];
  const listener = (...args) => calls.push(args);
  api.emit("playerDeath", nativeVictim, 1, nativeKiller, context);
  mod.net.events.onInternal({ "rm::playerDeath": listener });
  mod.net.events.onInternal({ "rm::playerDeath": listener, "rm::playerConnected": () => {} });
  for (const name of ["playerConnected", "playerDisconnected", "playerDeath"])
    assert.equal(subscriptions.filter(([event]) => event === name).length, 1);
  assert.equal(subscriptions.find(([name]) => name === "rm::playerDeath")[1], listener);
  assert.deepEqual(calls, []);
  records.delete(48);
  // Forwarding uses the supplied native handles, even after they leave the snapshot.
  api.players.getById = () => {
    throw new Error("unexpected lookup in bridge");
  };
  api.emit("playerDeath", nativeVictim, 3, nativeKiller, context);
  assert.deepEqual(calls.splice(0), [
    [victim, 3, killer],
    [victim, 3, killer],
  ]);
  assert.equal(killer.isExists, false);
  mod.net.events.offInternal("rm::playerDeath", listener);
  api.emit("playerDeath", nativeVictim, 0, null, context);
  assert.deepEqual(calls.splice(0), [[victim, 0, null]]);
  const failure = new Error("SDK death failure");
  const fail = () => {
    throw failure;
  };
  mod.net.events.onInternal({ "rm::playerDeath": fail });
  assert.throws(
    () => api.emit("playerDeath", nativeVictim, 2, nativeKiller, context),
    (error) => error === failure,
  );
  mod.net.events.offInternal("rm::playerDeath", fail);
  mod.net.events.offInternal("rm::playerDeath", listener);
  api.emit("playerDeath", nativeVictim, 0, null, context);
});

test("dimension delegates to the native handle without validation, caching or coercion", () => {
  let dimension = 4294967295;
  const calls = [];
  const failure = new Error("native dimension failure");
  const native = {
    id: 42,
    get dimension() {
      if (dimension === null) throw failure;
      return dimension;
    },
    setDimension(value) {
      calls.push([this, value]);
      if (value === null) throw failure;
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(42);
  assert.equal(player.dimension, 4294967295);
  dimension = 32;
  assert.equal(player.dimension, 32);
  for (const value of [0, 4294967295, -1, 1.5, "1", undefined]) {
    assert.equal(player.setDimension(value), undefined);
    assert.deepEqual(calls.at(-1), [native, value]);
  }
  assert.throws(
    () => player.setDimension(null),
    (error) => error === failure,
  );
  dimension = null;
  assert.throws(
    () => player.dimension,
    (error) => error === failure,
  );
});

test("world time delegates native snapshots, values, receiver and errors without clock logic", () => {
  const calls = [];
  const snapshot = Object.freeze({ hour: 7, minute: 8, second: 9 });
  const native = {
    get time() {
      calls.push([this, "time"]);
      return snapshot;
    },
    setTimeHour(value) {
      calls.push([this, "hour", value]);
    },
    setTimeMinute(value) {
      calls.push([this, "minute", value]);
    },
    setTimeSecond(value) {
      calls.push([this, "second", value]);
    },
  };
  Reflect.set(globalThis, "rockSandbox", { world: native });
  assert.equal(mod.world.time, snapshot);
  for (const value of [0, 23, 59, -1, "7", undefined, NaN]) {
    mod.world.setTimeHour(value);
    mod.world.setTimeMinute(value);
    mod.world.setTimeSecond(value);
    assert.deepEqual(calls.slice(-3), [
      [native, "hour", value],
      [native, "minute", value],
      [native, "second", value],
    ]);
  }
  const failure = new Error("native-clock-error");
  const fail = () => {
    throw failure;
  };
  Reflect.set(globalThis, "rockSandbox", {
    world: {
      get time() {
        throw failure;
      },
      setTimeHour: fail,
      setTimeMinute: fail,
      setTimeSecond: fail,
    },
  });
  for (const operation of [
    () => mod.world.time,
    () => mod.world.setTimeHour(1),
    () => mod.world.setTimeMinute(2),
    () => mod.world.setTimeSecond(3),
  ]) {
    assert.throws(operation, (error) => error === failure);
  }
});

test("world weather only translates supported names and delegates native validation and errors", () => {
  const calls = [];
  let preset = "clear";
  const failure = new Error("native weather failure");
  const native = {
    get weather() {
      calls.push([this, "get"]);
      return preset;
    },
    setWeather(value) {
      calls.push([this, value]);
      if (value === "RAIN") throw failure;
    },
  };
  Reflect.set(globalThis, "rockSandbox", { world: native });
  for (const [sdk, engine] of [
    ["CLEAR", "clear"],
    ["CLOUDS", "cloudy"],
    ["OVERCAST", "overcast"],
  ]) {
    preset = engine;
    assert.equal(mod.world.weather, sdk);
    assert.deepEqual(calls.at(-1), [native, "get"]);
    assert.equal(mod.world.setWeather(sdk), undefined);
    assert.deepEqual(calls.at(-1), [native, engine]);
  }
  for (const value of [null, undefined, 7, {}, new String("CLEAR"), "SNOW", "unknown"]) {
    mod.world.setWeather(value);
    assert.deepEqual(calls.at(-1), [native, value]);
  }
  assert.throws(
    () => mod.world.setWeather("RAIN"),
    (error) => error === failure,
  );
  Reflect.set(globalThis, "rockSandbox", {
    world: {
      get weather() {
        throw failure;
      },
    },
  });
  assert.throws(
    () => mod.world.weather,
    (error) => error === failure,
  );
});

test("cylinder wrapper delegates geometry and participants and installs all lifecycle bridges once", () => {
  host();
  const api = globalThis.rockSandbox;
  const calls = [];
  const nativePlayer = {};
  const native = {
    id: 700,
    isExists: true,
    key: "native key",
    position: { x: 1, y: 3, z: -2 },
    dimension: 9,
    playersInside: [nativePlayer],
    setPosition(value) {
      assert.equal(this, native);
      calls.push(["position", value]);
    },
    setDimension(value) {
      assert.equal(this, native);
      calls.push(["dimension", value]);
    },
    destroy() {
      assert.equal(this, native);
      calls.push(["destroy"]);
    },
  };
  const listeners = new Map();
  const subscriptions = [];
  Object.assign(api, {
    colshapes: {
      createCylinder(options) {
        calls.push(["create", options]);
        return native;
      },
      all: () => [native],
      getById: (id) => (id === native.id ? native : null),
    },
    on(name, handler) {
      subscriptions.push([name, handler]);
      const list = listeners.get(name) || [];
      list.push(handler);
      listeners.set(name, list);
    },
    off(name, handler) {
      const list = listeners.get(name) || [];
      const i = list.lastIndexOf(handler);
      if (i >= 0) list.splice(i, 1);
    },
    emit(name, ...args) {
      for (const fn of [...(listeners.get(name) || [])]) fn(...args);
    },
  });
  const shape = mod.colshapes.createCylinder({
    position: { x: 1, y: 2, z: 3 },
    range: 5,
    height: 8,
    dimension: 9,
    key: "zone",
  });
  assert.deepEqual(calls.shift(), [
    "create",
    { position: { x: 1, y: 3, z: -2 }, radius: 5, height: 8, dimension: 9, key: "zone" },
  ]);
  assert.equal(shape.id, native.id);
  assert.equal(shape.type, RockModBaseObjectType.Colshape);
  assert.equal(shape.key, "native key");
  assert.equal(shape.dimension, 9);
  assert.equal(shape.isExists, true);
  assert.deepEqual([shape.position.x, shape.position.y, shape.position.z], [1, 2, 3]);
  assert.equal(mod.colshapes.findByID(native.id), shape);
  assert.equal(mod.colshapes.getByID(native.id), shape);
  assert.equal([...mod.colshapes.iterator.all()][0], shape);
  assert.equal(mod.colshapes.findByID(1), null);
  assert.throws(() => mod.colshapes.getByID(1), /colshape 1 not found/);
  shape.setPosition({ x: 4, y: 5, z: 6 });
  shape.setDimension(4294967295);
  shape.destroy();
  assert.deepEqual(calls.splice(0), [["position", { x: 4, y: 6, z: -5 }], ["dimension", 4294967295], ["destroy"]]);
  const received = [];
  const handler = (p, c) => received.push([p, c]);
  mod.net.events.onInternal({ "rm::playerEnteredColshape": handler });
  mod.net.events.onInternal({ "rm::playerEnteredColshape": handler, "rm::playerLeftColshape": handler });
  for (const name of [
    "playerConnected",
    "playerDisconnected",
    "playerDeath",
    "playerEnteredColshape",
    "playerLeftColshape",
  ])
    assert.equal(subscriptions.filter(([event]) => event === name).length, 1);
  assert.equal(subscriptions.find(([name]) => name === "rm::playerEnteredColshape")[1], handler);
  api.emit("playerEnteredColshape", nativePlayer, native);
  const [wrapped] = mod.colshapes.getParticipants(shape);
  assert.deepEqual(received.splice(0), [
    [wrapped, shape],
    [wrapped, shape],
  ]);
  mod.net.events.offInternal("rm::playerEnteredColshape", handler);
  api.emit("playerEnteredColshape", nativePlayer, native);
  assert.deepEqual(received.splice(0), [[wrapped, shape]]);
  const error = new Error("native colshape setter error");
  native.setDimension = () => {
    throw error;
  };
  assert.throws(
    () => shape.setDimension(-1),
    (e) => e === error,
  );
  assert.throws(() => shape.getNetData("x"), /not implemented/);
  assert.throws(() => mod.colshapes.createSphere({}), /not implemented/);
});

test("blips delegate mutations, preserve handle identity and translate current gamemod presets", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const presets = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/rock-sandbox-blip-presets.json"), "utf8"));
  assert.equal(presets.length, 25);
  const calls = [];
  let next = 1;
  const items = new Map();
  Reflect.set(globalThis, "rockSandbox", {
    blips: {
      create: (options) => {
        calls.push(["create", options]);
        const item = {
          id: next++,
          isExists: true,
          ...options,
          color: { ...options.color, a: options.color.a ?? 255 },
          setPosition: (v) => calls.push(["position", v]),
          setDimension: (v) => calls.push(["dimension", v]),
          setName: (v) => calls.push(["name", v]),
          setIcon: (v) => calls.push(["icon", v]),
          setColor: (v) => calls.push(["color", v]),
          setAlpha: (v) => calls.push(["alpha", v]),
          destroy: () => calls.push(["destroy"]),
        };
        items.set(item.id, item);
        return item;
      },
      all: () => [...items.values()],
      getById: (id) => items.get(id) ?? null,
    },
  });
  for (const preset of presets) {
    const b = mod.blips.create({
      ...preset,
      shortRange: preset.shortRange ?? false,
      position: { x: 1, y: 2, z: 3 },
      dimension: 7,
    });
    assert.equal(b.sprite, preset.sprite);
    assert.equal(b.color, preset.color);
    assert.equal(b.alpha, 255);
    assert.equal(b.id, next - 1);
    assert.equal(b.type, RockModBaseObjectType.Blip);
    assert.equal(b.isExists, true);
    assert.equal(b.dimension, 7);
    assert.deepEqual([b.position.x, b.position.y, b.position.z], [1, 2, 3]);
    assert.equal(b.name, preset.name);
    assert.equal(b.scale, preset.scale);
    assert.equal(b.shortRange, preset.shortRange ?? false);
    assert.equal(mod.blips.findByID(b.id), b);
    assert.equal(mod.blips.getByID(b.id), b);
    assert.equal([...mod.blips.iterator.all()].at(-1), b);
  }
  const b = mod.blips.getByID(1);
  calls.length = 0;
  b.setPosition({ x: 4, y: 5, z: 6 });
  b.setDimension(4294967295);
  b.setName("Дом");
  b.setSprite(921);
  b.setColor(83);
  b.setAlpha(17);
  b.destroy();
  assert.deepEqual(calls, [
    ["position", { x: 4, y: 6, z: -5 }],
    ["dimension", 4294967295],
    ["name", "Дом"],
    ["icon", "pistol"],
    ["color", { r: 155, g: 90, b: 220 }],
    ["alpha", 17],
    ["destroy"],
  ]);
  assert.throws(() => b.setSprite(999999), /unsupported GTA sprite/);
  assert.throws(() => b.setColor(999999), /unsupported GTA palette/);
  assert.throws(
    () => mod.blips.create({ position: { x: 0, y: 0, z: 0 }, dimension: 0, sprite: 999999 }),
    /unsupported GTA sprite/,
  );
  assert.equal(mod.blips.findByID(99999), null);
  assert.throws(() => mod.blips.getByID(99999), /not found/);
  const native = items.get(1);
  native.color = { r: 4, g: 5, b: 6, a: 255 };
  assert.throws(() => b.color, /no SDK palette entry/);
  const error = new Error("native-blip-failure");
  native.setAlpha = () => {
    throw error;
  };
  assert.throws(
    () => b.setAlpha(1),
    (e) => e === error,
  );
});

test("all 16 marker presets delegate to native handles with independent IDs and coordinate bases", () => {
  const presets = require("./fixtures/rock-sandbox-marker-presets.json");
  assert.equal(presets.length, 16);
  const calls = [],
    items = new Map();
  const types = { 0: "cone", 1: "cylinder", 27: "ringArrows" };
  const api = {
    create(options) {
      calls.push(["create", options]);
      const native = { id: items.size + 1, isExists: true, visible: true, ...options };
      for (const method of [
        "setPosition",
        "setRotation",
        "setDimension",
        "setScale",
        "setColor",
        "setVisible",
        "destroy",
      ]) {
        native[method] = function (...args) {
          assert.equal(this, native);
          calls.push([method, ...args]);
        };
      }
      items.set(native.id, native);
      return native;
    },
    all: () => [...items.values()],
    getById: (id) => items.get(id) ?? null,
  };
  Reflect.set(globalThis, "rockSandbox", { markers: api });
  for (const p of presets) {
    const m = mod.markers.create({
      ...p,
      position: { x: 1, y: 2, z: 3 },
      rotation: { x: 10, y: 20, z: 30 },
      dimension: 7,
    });
    assert.equal(calls.at(-1)[1].type, types[p.type]);
    assert.deepEqual(calls.at(-1)[1].position, { x: 1, y: 3, z: -2 });
    assert.deepEqual(calls.at(-1)[1].rotation, { x: 10, y: 30, z: -20 });
    assert.equal(m.type, RockModBaseObjectType.Marker);
    assert.equal(m.markerType, p.type);
    assert.equal(m.isExists, true);
    assert.equal(m.dimension, 7);
    assert.equal(m.scale, p.scale);
    assert.equal(m.visible, true);
    assert.deepEqual([m.position.x, m.position.y, m.position.z], [1, 2, 3]);
    assert.deepEqual([m.rotation.x, m.rotation.y, m.rotation.z], [10, 20, 30]);
    assert.deepEqual([m.color.r, m.color.g, m.color.b, m.color.a], [p.color.r, p.color.g, p.color.b, p.color.a]);
    assert.equal(mod.markers.getByID(m.id), m);
    assert.equal(mod.markers.findByID(m.id), m);
    assert.equal([...mod.markers.iterator.all()].at(-1), m);
  }
  const m = mod.markers.getByID(1),
    native = items.get(1);
  calls.length = 0;
  Reflect.deleteProperty(globalThis, "rockSandbox");
  m.setPosition({ x: 4, y: 5, z: 6 });
  m.setRotation({ x: 40, y: 50, z: 60 });
  m.setDimension(4294967295);
  m.setScale(0.7);
  m.setColor({ r: 4, g: 5, b: 6 });
  m.setVisible(false);
  m.destroy();
  assert.deepEqual(calls, [
    ["setPosition", { x: 4, y: 6, z: -5 }],
    ["setRotation", { x: 40, y: 60, z: -50 }],
    ["setDimension", 4294967295],
    ["setScale", 0.7],
    ["setColor", { r: 4, g: 5, b: 6, a: undefined }],
    ["setVisible", false],
    ["destroy"],
  ]);
  const error = new Error("native-marker-failure");
  native.setScale = () => {
    throw error;
  };
  assert.throws(
    () => m.setScale(NaN),
    (e) => e === error,
  );
  native.scale = 9;
  assert.equal(m.scale, 9);
  Reflect.set(globalThis, "rockSandbox", { markers: api });
  assert.throws(
    () =>
      mod.markers.create({ ...presets[0], type: 999, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }),
    /unsupported GTA marker type/,
  );
  assert.equal(mod.markers.findByID(999), null);
  assert.throws(() => mod.markers.getByID(999), /not found/);
});

test("static objects delegate native state, retain identity and keep colliders explicit", () => {
  const calls = [],
    items = new Map();
  const options = {
    model: "prop_rock_4_b",
    position: { x: 1, y: 2, z: 3 },
    rotation: { x: 10, y: 20, z: 30 },
    dimension: 7,
    alpha: 123,
    collidable: true,
  };
  const api = {
    create(value) {
      calls.push(["create", value]);
      const native = { ...value, id: items.size + 1, isExists: true, modelHash: 4294967295 };
      for (const member of [
        "setPosition",
        "setRotation",
        "setDimension",
        "setAlpha",
        "setNetData",
        "getNetData",
        "destroy",
      ]) {
        native[member] = function (...args) {
          assert.equal(this, native);
          calls.push([member, ...args]);
          return member === "getNetData" ? options : undefined;
        };
      }
      items.set(native.id, native);
      return native;
    },
    all: () => [...items.values()],
    getById: (id) => items.get(id) ?? null,
  };
  Reflect.set(globalThis, "rockSandbox", { objects: api });
  const object = mod.objects.create(options);
  assert.deepEqual(calls[0], [
    "create",
    { ...options, position: { x: 1, y: 3, z: -2 }, rotation: { x: 10, y: 30, z: -20 } },
  ]);
  assert.equal(object.type, RockModBaseObjectType.Object);
  assert.equal(object.model, 4294967295);
  assert.equal(object.alpha, 123);
  assert.equal(object.dimension, 7);
  assert.equal(object.isExists, true);
  assert.deepEqual([object.position.x, object.position.y, object.position.z], [1, 2, 3]);
  assert.deepEqual([object.rotation.x, object.rotation.y, object.rotation.z], [10, 20, 30]);
  assert.equal(mod.objects.getByID(1), object);
  assert.equal(mod.objects.findByID(1), object);
  assert.deepEqual([...mod.objects.iterator.all()], [object]);
  assert.equal(mod.objects.findByID(99), null);
  assert.throws(() => mod.objects.getByID(99), /object 99 not found/);
  Reflect.deleteProperty(globalThis, "rockSandbox");
  calls.length = 0;
  object.setPosition({ x: 4, y: 5, z: 6 });
  object.setRotation({ x: 40, y: 50, z: 60 });
  object.setDimension(8);
  object.setAlpha(0);
  object.setNetData("gameObject:collidable", true);
  assert.equal(object.getNetData("sample"), options);
  object.destroy();
  assert.deepEqual(calls, [
    ["setPosition", { x: 4, y: 6, z: -5 }],
    ["setRotation", { x: 40, y: 60, z: -50 }],
    ["setDimension", 8],
    ["setAlpha", 0],
    ["setNetData", "gameObject:collidable", true],
    ["getNetData", "sample"],
    ["destroy"],
  ]);
  const error = new Error("object native error");
  items.get(1).setAlpha = () => {
    throw error;
  };
  assert.throws(
    () => object.setAlpha(999),
    (e) => e === error,
  );
  assert.throws(() => object.setModel("other"), /not implemented/);
  assert.throws(() => mod.objects.create({ ...options, placeOnGround: true }), /placeOnGround is not supported/);
  assert.throws(() => mod.objects.iterator.dimension(1), /not implemented/);
});

test("heading delegates angles and native errors without normalizing or caching", () => {
  const calls = [];
  let heading = 270;
  const failure = new Error("native heading failure");
  const native = {
    id: 86,
    get heading() {
      return heading;
    },
    setHeading(value) {
      calls.push(value);
      if (value === null) throw failure;
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(86);
  assert.equal(player.heading, 270);
  heading = 45.5;
  assert.equal(player.heading, 45.5);
  for (const value of [-450, 720.25, NaN, Infinity, "90", undefined]) assert.equal(player.setHeading(value), undefined);
  assert.deepEqual(calls, [-450, 720.25, NaN, Infinity, "90", undefined]);
  assert.throws(
    () => player.setHeading(null),
    (error) => error === failure,
  );
  Object.defineProperty(native, "heading", {
    get() {
      throw failure;
    },
  });
  assert.throws(
    () => player.heading,
    (error) => error === failure,
  );
});

test("name delegates unchanged values, published state and native errors", () => {
  const calls = [];
  let name = "Before";
  const failure = new Error("native name failure");
  const native = {
    id: 87,
    get name() {
      return name;
    },
    setName(value) {
      calls.push(value);
      if (value === null) throw failure;
    },
  };
  Reflect.set(globalThis, "rockSandbox", { players: { getById: () => native } });
  const player = mod.players.getByID(87);
  for (const value of ["  Имя  ", "", "a".repeat(100), 42, undefined]) assert.equal(player.setName(value), undefined);
  assert.deepEqual(calls, ["  Имя  ", "", "a".repeat(100), 42, undefined]);
  assert.equal(player.name, "Before");
  name = "After";
  assert.equal(player.name, "After");
  assert.throws(
    () => player.setName(null),
    (error) => error === failure,
  );
});

test("quit-only subscriptions lazily install one bridge and preserve off and exceptions", () => {
  const listeners = new Map();
  const subscriptions = [];
  const api = {
    on(name, handler) {
      subscriptions.push([name, handler]);
      const handlers = listeners.get(name) || [];
      handlers.push(handler);
      listeners.set(name, handlers);
    },
    off(name, handler) {
      const handlers = listeners.get(name) || [];
      const index = handlers.lastIndexOf(handler);
      if (index >= 0) handlers.splice(index, 1);
    },
    emit(name, ...args) {
      for (const handler of [...(listeners.get(name) || [])]) handler(...args);
    },
  };
  Reflect.set(globalThis, "rockSandbox", api);
  const calls = [];
  const handler = (...args) => calls.push(args);
  mod.net.events.onInternal({ "rm::playerQuit": handler });
  mod.net.events.onInternal({ "rm::playerQuit": handler });
  assert.equal(subscriptions.filter(([name]) => name === "playerDisconnected").length, 1);
  assert.equal(subscriptions.find(([name]) => name === "rm::playerQuit")[1], handler);
  const native = { id: 100 };
  const context = {
    exitType: "disconnect",
    reason: "timeout",
    snapshot: {
      id: 100,
      health: 0,
      weaponAmmo: 3,
      position: { x: 1, y: 2, z: 3 },
      heading: 270,
      dimension: 4294967295,
    },
  };
  api.emit("playerDisconnected", native, context);
  assert.equal(calls.length, 2);
  assert.equal(calls[0][0], calls[1][0]);
  mod.net.events.offInternal("rm::playerQuit", handler);
  api.emit("playerDisconnected", native, context);
  assert.equal(calls.length, 3);
  const failure = new Error("quit failure");
  mod.net.events.onInternal({
    "rm::playerQuit": () => {
      throw failure;
    },
  });
  assert.throws(
    () => api.emit("playerDisconnected", native, context),
    (error) => error === failure,
  );
});

test("player metadata delegates values, keys, results and native errors without caching", () => {
  const calls = [];
  const result = Object.freeze({ nested: Object.freeze([1]) });
  const error = new Error("native metadata failure");
  const native = {
    id: 91,
    getNetData(key) {
      calls.push(["get", key]);
      if (key === "failure") throw error;
      return result;
    },
    setNetData(key, value) {
      calls.push(["set", key, value]);
      if (key === "failure") throw error;
    },
  };
  globalThis.rockSandbox = { players: { getById: () => native } };
  const player = mod.players.getByID(91);
  const value = {
    toJSON() {
      throw new Error("wrapper must not serialize");
    },
  };
  assert.equal(player.setNetData("sid", value), undefined);
  assert.equal(player.setNetData("sid", undefined), undefined);
  assert.equal(player.getNetData("sid"), result);
  assert.equal(player.getNetData("sid"), result);
  assert.throws(
    () => player.getNetData("failure"),
    (e) => e === error,
  );
  assert.throws(
    () => player.setNetData("failure", value),
    (e) => e === error,
  );
  assert.equal(player, mod.players.getByID(91));
  assert.deepEqual(calls.slice(0, 4), [
    ["set", "sid", value],
    ["set", "sid", undefined],
    ["get", "sid"],
    ["get", "sid"],
  ]);
});

test("inventory weapon operations delegate issuance tokens and immutable native state", () => {
  const calls = [],
    failure = Error("native inventory error");
  let fail = false;
  const state = Object.freeze({
    weapon: 453432689,
    ammoInClip: 2,
    ammo: 2,
    capacity: 15,
    owned: true,
    revision: 18446744073709551615n,
  });
  const native = { id: 75 };
  for (const name of ["equipWeapon", "addWeaponAmmo", "getWeaponState"])
    native[name] = (...args) => {
      if (fail) throw failure;
      calls.push([name, ...args]);
      return name === "equipWeapon" ? state.revision : name === "getWeaponState" ? state : undefined;
    };
  globalThis.rockSandbox = { players: { getById: () => native } };
  const p = mod.players.getByID(75);
  assert.equal(p.equipWeapon("pistol", 2), state.revision);
  assert.equal(p.addWeaponAmmo("pistol", 1, state.revision), undefined);
  assert.equal(p.getWeaponState("pistol"), state);
  assert.deepEqual(calls, [
    ["equipWeapon", "pistol", 2, undefined],
    ["addWeaponAmmo", "pistol", 1, state.revision],
    ["getWeaponState", "pistol"],
  ]);
  fail = true;
  for (const call of [
    () => p.equipWeapon("pistol", 1),
    () => p.addWeaponAmmo("pistol", 1, 1n),
    () => p.getWeaponState("pistol"),
  ])
    assert.throws(call, (e) => e === failure);
});

test("server accepted shot bridge preserves historical context and listener identity", () => {
  const listeners = new Map(),
    subscriptions = [];
  globalThis.rockSandbox = {
    on(name, handler) {
      subscriptions.push([name, handler]);
      const list = listeners.get(name) || [];
      list.push(handler);
      listeners.set(name, list);
    },
    off(name, handler) {
      const list = listeners.get(name) || [];
      const i = list.lastIndexOf(handler);
      if (i >= 0) list.splice(i, 1);
    },
    emit(name, ...args) {
      for (const handler of [...(listeners.get(name) || [])]) handler(...args);
    },
  };
  const native = { id: 76 },
    context = Object.freeze({ revision: 9007199254740993n, request: 18446744073709551615n }),
    calls = [];
  const handler = (...args) => calls.push(args);
  mod.net.events.onInternal({ "rm::playerWeaponShot": handler });
  mod.net.events.onInternal({ "rm::playerWeaponShot": handler });
  assert.equal(subscriptions.filter(([name]) => name === "playerWeaponShot").length, 1);
  assert.equal(subscriptions.find(([name]) => name === "rm::playerWeaponShot")[1], handler);
  globalThis.rockSandbox.emit("playerWeaponShot", native, context);
  assert.equal(calls.length, 2);
  assert.equal(calls[0][1], context);
  assert.equal(calls[0][0], calls[1][0]);
  mod.net.events.offInternal("rm::playerWeaponShot", handler);
  globalThis.rockSandbox.emit("playerWeaponShot", native, context);
  assert.equal(calls.length, 3);
});

test("legacy server adapters explicitly reject authoritative inventory operations", () => {
  globalThis.AltVShared = { Vector3: class {}, hash() {} };
  globalThis.AltVServer = {};
  try {
    for (const [platform, name] of [
      ["ragemp", "Rage"],
      ["vimp", "VIMP"],
      ["altv", "AltV"],
      ["mock", "Mock"],
    ]) {
      const Class = require(`../dist/server/entities/${platform}/player/${name}Player`)[`${name}Player`];
      for (const member of ["equipWeapon", "addWeaponAmmo", "getWeaponState", "setPassiveMode"])
        assert.throws(
          () => Class.prototype[member].call(undefined, "pistol", 1, 1n),
          new RegExp(`${name}Player.${member}: unsupported operation`),
        );
    }
  } finally {
    delete globalThis.AltVShared;
    delete globalThis.AltVServer;
  }
});

test("RP profile, armour and passive policy delegate exact native arguments and original errors", () => {
  const Class = require("../dist/server/entities/rock-sandbox/player/RockSandboxPlayer").RockSandboxPlayer;
  const calls = [],
    failure = Error("native combat failure");
  let fail = false,
    armour = 37,
    passiveMode = false;
  const native = {
    get armour() {
      if (fail) throw failure;
      return armour;
    },
    get passiveMode() {
      if (fail) throw failure;
      return passiveMode;
    },
    setArmour(value) {
      assert.equal(this, native);
      if (fail) throw failure;
      calls.push(["armour", value]);
      armour = value;
    },
    setPassiveMode(value) {
      assert.equal(this, native);
      if (fail) throw failure;
      calls.push(["passive", value]);
      passiveMode = value;
    },
    equipWeapon(...args) {
      assert.equal(this, native);
      if (fail) throw failure;
      calls.push(["equip", ...args]);
      return 9007199254740993n;
    },
  };
  const player = new Class(native),
    profile = Object.freeze({ arbitrary: "native validation owns this" });
  assert.equal(player.armour, 37);
  assert.equal(player.passiveMode, false);
  player.setArmour(1000);
  player.setPassiveMode("native validates");
  assert.equal(player.equipWeapon("pistol", 3, profile), 9007199254740993n);
  assert.deepEqual(calls, [
    ["armour", 1000],
    ["passive", "native validates"],
    ["equip", "pistol", 3, profile],
  ]);
  assert.equal(calls[2][3], profile);
  fail = true;
  for (const operation of [
    () => player.armour,
    () => player.passiveMode,
    () => player.setArmour(0),
    () => player.setPassiveMode(false),
    () => player.equipWeapon("pistol", 0, profile),
  ])
    assert.throws(operation, (e) => e === failure);
});

test("vehicle collection and mutations directly delegate native state with identity", () => {
  const calls = [],
    failure = new Error("native vehicle failure");
  let throws = false;
  const nativePlayer = { id: 8 };
  const native = {
    id: 5,
    isExists: true,
    modelHash: 99,
    position: { x: 1, y: 2, z: 3 },
    rotation: { x: 4, y: 5, z: 6 },
    dimension: 12,
    engineOn: true,
    isLocked: true,
    numberPlate: "PORT33",
    driver: nativePlayer,
    passengers: [nativePlayer],
    setPosition: (v) => calls.push(["position", v]),
    setRotation: (v) => calls.push(["rotation", v]),
    setDimension: (v) => calls.push(["dimension", v]),
    setEngineOn: (v) => {
      if (throws) throw failure;
      calls.push(["engine", v]);
    },
    setLocked: (v) => calls.push(["locked", v]),
    setNumberPlate: (v) => calls.push(["plate", v]),
    destroy: () => calls.push(["destroy"]),
  };
  let options;
  globalThis.rockSandbox = {
    vehicles: {
      create: (o) => {
        options = o;
        return native;
      },
      getById: (id) => (id === 5 ? native : null),
      all: () => [native],
    },
    players: { getById: (id) => (id === 8 ? nativePlayer : null), all: () => [nativePlayer] },
  };
  const v = mod.vehicles.create({
    model: "riverside",
    position: { x: 1, y: 2, z: 3 },
    rotation: { x: 4, y: 5, z: 6 },
    dimension: 12,
    engine: true,
    locked: true,
    numberPlate: "PORT33",
  });
  assert.deepEqual(options, {
    model: "riverside",
    position: { x: 1, y: 3, z: -2 },
    rotation: { x: -4, y: 186, z: 5 },
    dimension: 12,
    engineOn: true,
    locked: true,
    numberPlate: "PORT33",
  });
  assert.equal(v, mod.vehicles.getByID(5));
  assert.equal(v, [...mod.vehicles.iterator.all()][0]);
  assert.equal(v.driver, mod.players.getByID(8));
  assert.equal([...v.passengers][0], v.driver);
  assert.equal(v.model, 99);
  assert.deepEqual([v.position.x, v.position.y, v.position.z], [1, -3, 2]);
  v.setPosition({ x: 7, y: 8, z: 9 });
  v.setRotation({ x: 10, y: 11, z: 12 });
  v.setDimension(0);
  v.setEngineOn(false);
  v.setLocked(false);
  v.setNumberPlate("new");
  v.destroy();
  assert.deepEqual(calls, [
    ["position", { x: 7, y: 9, z: -8 }],
    ["rotation", { x: -10, y: 192, z: 11 }],
    ["dimension", 0],
    ["engine", false],
    ["locked", false],
    ["plate", "new"],
    ["destroy"],
  ]);
  throws = true;
  assert.throws(
    () => v.setEngineOn(true),
    (e) => e === failure,
  );
  assert.throws(() => v.setWindowTint(10), /not implemented/);
});

test("server vehicle metadata delegates serialization and errors to native API", () => {
  const value = { unchanged: true },
    failure = Error("native vehicle metadata"),
    calls = [];
  let fail = false;
  const native = {
    id: 1,
    getNetData(key) {
      if (fail) throw failure;
      calls.push(["get", key]);
      return value;
    },
    setNetData(key, data) {
      if (fail) throw failure;
      calls.push(["set", key, data]);
    },
  };
  globalThis.rockSandbox = { vehicles: { getById: () => native } };
  const vehicle = mod.vehicles.getByID(1);
  assert.equal(vehicle.getNetData("key"), value);
  vehicle.setNetData("key", value);
  vehicle.setNetData("key", undefined);
  assert.deepEqual(calls, [
    ["get", "key"],
    ["set", "key", value],
    ["set", "key", undefined],
  ]);
  fail = true;
  assert.throws(
    () => vehicle.getNetData("key"),
    (e) => e === failure,
  );
  assert.throws(
    () => vehicle.setNetData("key", value),
    (e) => e === failure,
  );
});

test("vehicle lifecycle bridges preserve server identities, seat numbers and native handlers", () => {
  const callbacks = [],
    emitted = [],
    player = { id: 901 },
    vehicle = { id: 902 };
  globalThis.rockSandbox = {
    on: (name, handler) => callbacks.push([name, handler]),
    off: (...args) => emitted.push(["off", ...args]),
    emit: (...args) => emitted.push(args),
    players: { getById: () => player },
    vehicles: { getById: () => vehicle },
  };
  const handler = () => {};
  mod.net.events.onInternal({ "rm::playerEnterVehicle": handler });
  mod.net.events.onInternal({ "rm::playerExitVehicle": handler });
  for (const name of ["playerEnterVehicle", "playerExitVehicle"])
    assert.equal(callbacks.filter(([event]) => event === name).length, 1);
  callbacks.find(([name]) => name === "playerEnterVehicle")[1](player, vehicle, 3);
  assert.deepEqual(emitted.at(-1), ["rm::playerEnterVehicle", mod.players.getByID(901), mod.vehicles.getByID(902), 3]);
  callbacks.find(([name]) => name === "playerExitVehicle")[1](player, vehicle, 3);
  assert.deepEqual(emitted.at(-1), ["rm::playerExitVehicle", mod.players.getByID(901), mod.vehicles.getByID(902)]);
  assert.equal(callbacks.find(([name]) => name === "rm::playerExitVehicle")[1], handler);
  mod.net.events.offInternal("rm::playerExitVehicle", handler);
  assert.deepEqual(emitted.at(-1), ["off", "rm::playerExitVehicle", handler]);
});

test("vehicle health and repair delegate native primitives and original errors without SDK limits", () => {
  const calls = [],
    native = {
      id: 912,
      bodyHealth: 875.25,
      engineHealth: 1000,
      setBodyHealth: (v) => calls.push(["body", v]),
      setEngineHealth: (v) => calls.push(["engine", v]),
      repair: () => calls.push(["repair"]),
    };
  globalThis.rockSandbox = { vehicles: { getById: () => native } };
  const v = mod.vehicles.getByID(912);
  assert.equal(v.bodyHealth, 875.25);
  assert.equal(v.engineHealth, 1000);
  v.setBodyHealth(-1);
  v.setEngineHealth("invalid");
  v.repair();
  assert.deepEqual(calls, [["body", -1], ["engine", "invalid"], ["repair"]]);
  const error = Error("native vehicle health");
  native.repair = () => {
    throw error;
  };
  native.setBodyHealth = () => {
    throw error;
  };
  assert.throws(
    () => v.repair(),
    (e) => e === error,
  );
  assert.throws(
    () => v.setBodyHealth(1),
    (e) => e === error,
  );
  Object.defineProperty(native, "bodyHealth", {
    get() {
      throw error;
    },
  });
  assert.throws(
    () => v.bodyHealth,
    (e) => e === error,
  );
});

test("vehicle paint delegates published nullable colors, setters and native errors", () => {
  const calls = [];
  const error = Error("native paint");
  let fail = false;
  const rgba = Object.freeze({ r: 0, g: 0, b: 0, a: 91 });
  let indexed = 27;
  const native = {
    id: 73,
    get primaryColor() {
      if (fail) throw error;
      return indexed;
    },
    get secondaryColor() {
      if (fail) throw error;
      return 159;
    },
    get customPrimaryColor() {
      if (fail) throw error;
      return rgba;
    },
    get customSecondaryColor() {
      if (fail) throw error;
      return null;
    },
  };
  for (const key of ["setPrimaryColor", "setSecondaryColor", "setCustomPrimaryColor", "setCustomSecondaryColor"])
    native[key] = (value) => {
      if (fail) throw error;
      calls.push([key, value]);
    };
  Reflect.set(globalThis, "rockSandbox", { vehicles: { getById: () => native } });
  const car = mod.vehicles.getByID(73);
  assert.equal(car.primaryColor, 27);
  assert.equal(car.secondaryColor, 159);
  assert.equal(car.customPrimaryColor, rgba);
  assert.equal(car.customSecondaryColor, null);
  indexed = null;
  assert.equal(car.primaryColor, -1);
  indexed = 27;
  car.setPrimaryColor(64);
  car.setSecondaryColor(89);
  car.setCustomPrimaryColor({ r: 0, g: 0, b: 0 });
  car.setCustomSecondaryColor(rgba);
  assert.deepEqual(calls, [
    ["setPrimaryColor", 64],
    ["setSecondaryColor", 89],
    ["setCustomPrimaryColor", { r: 0, g: 0, b: 0, a: 255 }],
    ["setCustomSecondaryColor", rgba],
  ]);
  fail = true;
  for (const call of [
    () => car.primaryColor,
    () => car.secondaryColor,
    () => car.customPrimaryColor,
    () => car.customSecondaryColor,
    () => car.setPrimaryColor(27),
    () => car.setSecondaryColor(0),
    () => car.setCustomPrimaryColor(rgba),
    () => car.setCustomSecondaryColor(rgba),
  ])
    assert.throws(call, (e) => e === error);
});

test("headlight mode delegates writes and retains the published native state and errors", () => {
  let mode = "auto",
    fail = false;
  const calls = [],
    error = Error("native headlights");
  const native = {
    id: 73,
    get headlightMode() {
      if (fail) throw error;
      return mode;
    },
    setHeadlightMode(value) {
      if (fail) throw error;
      calls.push(value);
    },
  };
  Reflect.set(globalThis, "rockSandbox", { vehicles: { getById: () => native } });
  const car = mod.vehicles.getByID(73);
  car.setHeadlightMode("high_beam");
  assert.deepEqual(calls, ["high_beam"]);
  assert.equal(car.headlightMode, "auto");
  mode = "high_beam";
  assert.equal(car.headlightMode, "high_beam");
  fail = true;
  assert.throws(
    () => car.headlightMode,
    (e) => e === error,
  );
  assert.throws(
    () => car.setHeadlightMode("off"),
    (e) => e === error,
  );
});

test("indicator setters directly delegate and getters wait for native publication and errors", () => {
  let mode = "off",
    pulse = false,
    fail = false;
  const calls = [],
    error = Error("native indicators");
  const native = {
    id: 73,
    get indicatorMode() {
      if (fail) throw error;
      return mode;
    },
    get indicatorPhaseOn() {
      if (fail) throw error;
      return pulse;
    },
    setIndicatorMode(value) {
      if (fail) throw error;
      calls.push(value);
    },
  };
  Reflect.set(globalThis, "rockSandbox", { vehicles: { getById: () => native } });
  const car = mod.vehicles.getByID(73);
  car.setIndicatorMode("hazard");
  assert.equal(car.indicatorMode, "off");
  assert.deepEqual(calls, ["hazard"]);
  mode = "hazard";
  pulse = true;
  assert.equal(car.indicatorMode, "hazard");
  assert.equal(car.indicatorPhaseOn, true);
  fail = true;
  for (const call of [() => car.indicatorMode, () => car.indicatorPhaseOn, () => car.setIndicatorMode("off")])
    assert.throws(call, (e) => e === error);
});
