import { INetClientRPC, INetServerRPC, IRPCManager } from "../../common/rpc/IRPCManager";
import { RagePlayer } from "../../../entities/ragemp/player/RagePlayer";

export interface IRageServerRPC extends INetServerRPC {}

export interface IRageClientRPC extends INetClientRPC {}

export class RageRPCManager implements IRPCManager {
  public register<K extends keyof IRageServerRPC>(
    rpcName: K,
    handler: (player: RagePlayer, ...args: Parameters<IRageServerRPC[K]>) => ReturnType<IRageServerRPC[K]>,
  ): void {
    return mp.events.addProc(rpcName, handler);
  }

  public unregister<K extends keyof IRageServerRPC>(rpcName: K): void {
    return mp.events.remove(rpcName);
  }

  public emitClient<K extends keyof IRageClientRPC>(
    player: RagePlayer,
    rpcName: K,
    ...args: Parameters<IRageClientRPC[K]>
  ): Promise<ReturnType<IRageClientRPC[K]>> {
    const mpPlayer = mp.players.at(player.id);

    if (!mpPlayer) {
      throw new Error(`Player with id ${player.id} not found`);
    }

    return mpPlayer.callProc(rpcName, args);
  }
}
