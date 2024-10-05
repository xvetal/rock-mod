import { INetClientEvents } from "../../../net/common/events/IEventsManager";
import { INetClientRPC } from "../../../net/common/rpc/IRPCManager";

export interface IPlayerNetManager {
  emitEvent<K extends keyof INetClientEvents>(eventName: K, ...args: Parameters<INetClientEvents[K]>): void;
  emitRPC<K extends keyof INetClientEvents>(
    rpcName: K,
    ...args: Parameters<INetClientEvents[K]>
  ): Promise<ReturnType<INetClientRPC[K]>>;
}
