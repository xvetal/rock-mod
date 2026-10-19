import { type IRPCManager } from "../../common/rpc/IRPCManager";
import { type IClientRPCList, type IServerRPCList } from "../../../../shared/net/common/rpc/types";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxRPCManager implements IRPCManager {
  public register<K extends keyof IClientRPCList>(
    _rpcName: K,
    _handler: (...args: Parameters<IClientRPCList[K]>) => ReturnType<IClientRPCList[K]>,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxRPCManager.register");
  }

  public unregister<K extends keyof IClientRPCList>(_rpcName: K): void {
    return rockSandboxNotImplemented("client", "RockSandboxRPCManager.unregister");
  }

  public emitServer<K extends keyof IServerRPCList>(
    _rpcName: K,
    ..._args: Parameters<IServerRPCList[K]>
  ): Promise<ReturnType<IServerRPCList[K]>> {
    return rockSandboxNotImplemented("client", "RockSandboxRPCManager.emitServer");
  }
}
