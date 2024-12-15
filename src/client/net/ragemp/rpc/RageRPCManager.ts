import { IRPCManager } from "../../common/rpc/IRPCManager";
import { IClientRPCList, IServerRPCList } from "@shared/net/common/rpc/types";

export class RageRPCManager implements IRPCManager {
  public register<K extends keyof IClientRPCList>(
    rpcName: K,
    handler: (...args: Parameters<IClientRPCList[K]>) => ReturnType<IClientRPCList[K]>,
  ): void {
    return mp.events.addProc(rpcName, handler);
  }

  public unregister<K extends keyof IClientRPCList>(rpcName: K): void {
    return mp.events.remove(rpcName);
  }

  public emitServer<K extends keyof IServerRPCList>(
    rpcName: K,
    ...args: Parameters<IServerRPCList[K]>
  ): Promise<ReturnType<IServerRPCList[K]>> {
    return mp.events.callRemoteProc(rpcName, ...args);
  }
}
