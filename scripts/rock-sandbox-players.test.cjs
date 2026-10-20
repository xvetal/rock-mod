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
    () => player.health,
    () => player.dimension,
    () => player.setPosition(player.position),
    () => player.destroy(),
    () => mod.players.getBySocialClub("value"),
    () => mod.players.iterator.range3D(player.position, 10),
    () => mod.objects.findByID(1),
  ]) {
    assert.throws(operation, /\[RockSandbox:server\].*: not implemented/);
  }
});
