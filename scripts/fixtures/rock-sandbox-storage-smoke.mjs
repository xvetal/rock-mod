import { RockMod } from "../../dist/client/index.js";

// Let Rollup inline factory namespaces initialize before create() resumes.
async function main() {
  const mod = await RockMod.create({ multiplayer: "RockSandbox" });
  const storage = mod.game.storage;
  const previous = storage.getData("sdk:counter");
  const value = { text: "Привет", nested: [null, true] };
  storage.setData("sdk:value", value);
  value.nested.push(false);
  if (storage.getData("sdk:value").nested.length !== 2) throw Error("SDK JSON copy lost");
  storage.setData("sdk:counter", (previous ?? 0) + 1);
  storage.setData("sdk:remove", 1);
  storage.removeData("sdk:remove");
  storage.setData("temporary:one", 1);
  storage.clearData("temporary:");
  if (storage.getData("sdk:remove") !== null || storage.getData("temporary:one") !== null)
    throw Error("SDK removal failed");
  rockSandbox.onServer("storage:ack", (result) => console.log(JSON.stringify({ kind: "storage_ack", result })));
  await rockSandbox.storage.flush();
  mod.net.events.emitServer("storage:result", {
    source: "sdk",
    previous,
    current: storage.getData("sdk:counter"),
  });
}
void main();
