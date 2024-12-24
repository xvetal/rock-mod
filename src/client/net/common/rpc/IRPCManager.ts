import { type IClientRPCList, type IServerRPCList } from "@shared/net/common/rpc/types";

export interface IRPCManager {
  register<K extends keyof IClientRPCList>(
    rpcName: K,
    handler: (...args: Parameters<IClientRPCList[K]>) => ReturnType<IClientRPCList[K]>,
  ): void;
  unregister<K extends keyof IClientRPCList>(rpcName: K): void;
  emitServer<K extends keyof IServerRPCList>(
    rpcName: K,
    ...args: Parameters<IServerRPCList[K]>
  ): Promise<ReturnType<IServerRPCList[K]>>;
}
