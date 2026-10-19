import { type IRPCManager } from "../../common/rpc/IRPCManager";
import { type IPlayer } from "../../../entities/common/player/IPlayer";
import { type IClientRPCList, type IServerRPCList } from "../../../../shared/net/common/rpc/types";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxRPCManager implements IRPCManager {
  public register<K extends keyof IServerRPCList>(
    _rpcName: K,
    _handler: (player: IPlayer, ...args: Parameters<IServerRPCList[K]>) => ReturnType<IServerRPCList[K]>,
  ): void {
    return rockSandboxNotImplemented("server", "RockSandboxRPCManager.register");
  }

  public unregister<K extends keyof IServerRPCList>(_rpcName: K): void {
    return rockSandboxNotImplemented("server", "RockSandboxRPCManager.unregister");
  }

  public emitClient<K extends keyof IClientRPCList>(
    _player: IPlayer,
    _rpcName: K,
    ..._args: Parameters<IClientRPCList[K]>
  ): Promise<ReturnType<IClientRPCList[K]>> {
    return rockSandboxNotImplemented("server", "RockSandboxRPCManager.emitClient");
  }
}
