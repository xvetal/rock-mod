import { type RockSandboxPlayers, type RockSandboxServer } from "@rock-sandbox/types/server";

export function nativePlayers(member: string): RockSandboxPlayers {
  const candidate: unknown = Reflect.get(globalThis, "rockSandbox");
  const api = candidate as Partial<RockSandboxServer> | null | undefined;
  const players = api?.players;
  if (
    typeof players !== "object" ||
    players === null ||
    typeof players.all !== "function" ||
    typeof players.getById !== "function"
  ) {
    throw new Error(
      `[RockSandbox:server] RockSandboxPlayersManager.${member}: native player API is unavailable. ` +
        "Run inside Rock Sandbox with nodejs and rebuild the complete runtime with python3 scripts/nodejs.py build.",
    );
  }
  return players;
}
