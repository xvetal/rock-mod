import { type IRPCManager } from "../../common/rpc/IRPCManager";
import { type CCMPPlayer } from "../../../entities/vimp/player/VIMPPlayer";
import { type IClientRPCList, type IServerRPCList } from "../../../../shared/net/common/rpc/types";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPRPCManager implements IRPCManager {
  public register<K extends keyof IServerRPCList>(
    _rpcName: K,
    _handler: (player: CCMPPlayer, ...args: Parameters<IServerRPCList[K]>) => ReturnType<IServerRPCList[K]>,
  ): void {
    notImplemented("CCMPRPCManager.register");
  }

  public unregister<K extends keyof IServerRPCList>(_rpcName: K): void {
    notImplemented("CCMPRPCManager.unregister");
  }

  public emitClient<K extends keyof IClientRPCList>(
    _player: CCMPPlayer,
    _rpcName: K,
    ..._args: Parameters<IClientRPCList[K]>
  ): Promise<ReturnType<IClientRPCList[K]>> {
    return notImplemented("CCMPRPCManager.emitClient");
  }
}
