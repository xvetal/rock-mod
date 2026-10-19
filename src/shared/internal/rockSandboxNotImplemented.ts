export function rockSandboxNotImplemented(side: "client" | "server", member: string): never {
  throw new Error(`[RockSandbox:${side}] ${member}: not implemented`);
}
