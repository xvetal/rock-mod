import { INetClientRPC, INetServerRPC, IRPCManager } from "../../common/rpc/IRPCManager";
import { AltVPlayer } from "../../../entities/altv/player/AltVPlayer";
import alt = AltVServer;
import shared = AltVShared;
import Player = AltVServer.Player;

export interface IAltVServerRPC extends shared.ICustomClientServerRpc, INetServerRPC {}

export interface IAltVClientRPC extends shared.ICustomServerClientRpc, INetClientRPC {}

export class AltVRPCManager implements IRPCManager {
  public register<K extends keyof IAltVServerRPC>(
    rpcName: K,
    handler: (player: AltVPlayer, ...args: Parameters<IAltVServerRPC[K]>) => ReturnType<IAltVServerRPC[K]>,
  ): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return alt.onRpc(rpcName, handler);
  }

  public unregister<K extends keyof IAltVServerRPC>(rpcName: K): void {
    return alt.offRpc(rpcName);
  }

  public emitClient<K extends keyof IAltVClientRPC>(
    player: AltVPlayer,
    rpcName: K,
    ...args: Parameters<IAltVClientRPC[K]>
  ): Promise<ReturnType<IAltVClientRPC[K]>> {
    const mpPlayer = Player.getByID(player.id);

    if (!mpPlayer) {
      throw new Error(`Player with id ${player.id} not found`);
    }

    return mpPlayer.emitRpc(rpcName, ...args);
  }
}
