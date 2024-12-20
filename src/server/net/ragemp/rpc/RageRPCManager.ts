import { IRPCManager } from "../../common/rpc/IRPCManager";
import { RagePlayer } from "../../../entities/ragemp/player/RagePlayer";
import { IClientRPCList, IServerRPCList } from "../../../../shared/net/common/rpc/types";

export class RageRPCManager implements IRPCManager {
  public register<K extends keyof IServerRPCList>(
    rpcName: K,
    handler: (player: RagePlayer, ...args: Parameters<IServerRPCList[K]>) => ReturnType<IServerRPCList[K]>,
  ): void {
    return mp.events.addProc(rpcName, handler);
  }

  public unregister<K extends keyof IServerRPCList>(rpcName: K): void {
    return mp.events.remove(rpcName);
  }

  public emitClient<K extends keyof IClientRPCList>(
    player: RagePlayer,
    rpcName: K,
    ...args: Parameters<IClientRPCList[K]>
  ): Promise<ReturnType<IClientRPCList[K]>> {
    const mpPlayer = mp.players.at(player.id);

    if (!mpPlayer) {
      throw new Error(`Player with id ${player.id} not found`);
    }

    return mpPlayer.callProc(rpcName, args);
  }
}
