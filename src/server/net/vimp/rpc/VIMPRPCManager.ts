import { type IRPCManager } from "../../common/rpc/IRPCManager";
import { type VIMPPlayer } from "../../../entities/vimp/player/VIMPPlayer";
import { type IClientRPCList, type IServerRPCList } from "../../../../shared/net/common/rpc/types";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class VIMPRPCManager implements IRPCManager {
  public register<K extends keyof IServerRPCList>(
    _rpcName: K,
    _handler: (player: VIMPPlayer, ...args: Parameters<IServerRPCList[K]>) => ReturnType<IServerRPCList[K]>,
  ): void {
    notImplemented("VIMPRPCManager.register");
  }

  public unregister<K extends keyof IServerRPCList>(_rpcName: K): void {
    notImplemented("VIMPRPCManager.unregister");
  }

  public emitClient<K extends keyof IClientRPCList>(
    _player: VIMPPlayer,
    _rpcName: K,
    ..._args: Parameters<IClientRPCList[K]>
  ): Promise<ReturnType<IClientRPCList[K]>> {
    return notImplemented("VIMPRPCManager.emitClient");
  }
}
