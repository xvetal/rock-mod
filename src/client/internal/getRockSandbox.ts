import { type RockSandboxClient } from "@rock-sandbox/types/client";

export function getRockSandbox(): RockSandboxClient {
  return Reflect.get(globalThis, "rockSandbox") as RockSandboxClient;
}
