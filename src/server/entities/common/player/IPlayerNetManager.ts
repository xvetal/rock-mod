export interface IPlayerNetManager {
  callEvent(eventName: string, ...args: unknown[]): void;
  callRPC(rpcName: string, ...args: unknown[]): Promise<unknown>;
}
