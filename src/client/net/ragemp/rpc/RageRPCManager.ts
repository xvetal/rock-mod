import { INetClientRPC, IRPCManager } from "../../common/rpc/IRPCManager";

export interface IRageClientRPC extends INetClientRPC {}

export class RageRPCManager implements IRPCManager {
  public register(rpcName: string, handler: (...args: unknown[]) => unknown): void {
    return mp.events.addProc(rpcName, handler);
  }

  public unregister(rpcName: string): void {
    return mp.events.remove(rpcName);
  }

  public emitServer(rpcName: string, ...args: unknown[]): Promise<unknown> {
    return mp.events.callRemoteProc(rpcName, ...args);
  }
}
