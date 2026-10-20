import { type RockSandboxServer } from "@rock-sandbox/types/server";

export function getRockSandbox(): RockSandboxServer {
  return Reflect.get(globalThis, "rockSandbox") as RockSandboxServer;
}
