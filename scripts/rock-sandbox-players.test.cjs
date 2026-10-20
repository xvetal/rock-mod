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

test("creation and iterator access need no host; operations diagnose missing APIs", () => {
  assert.equal(typeof mod.players.iterator.all, "function");
  for (const candidate of [undefined, null, {}, { players: {} }, { players: { all() {} } }]) {
    Reflect.set(globalThis, "rockSandbox", candidate);
    assert.throws(() => mod.players.findByID(1), /native player API is unavailable/);
    assert.throws(() => mod.players.iterator.all(), /python3 scripts\/nodejs.py build/);
    assert.throws(() => mod.players.findByName("name"), /RockSandbox:server/);
  }
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
