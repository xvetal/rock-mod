export interface INetClientRPC {}

export interface IRPCManager {
  register(rpcName: string, handler: (...args: unknown[]) => unknown): void;
  unregister(rpcName: string): void;
  emitServer(rpcName: string, ...args: unknown[]): Promise<unknown>;
}
