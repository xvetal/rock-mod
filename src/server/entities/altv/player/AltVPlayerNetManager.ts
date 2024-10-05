import { IPlayerNetManager } from "../../common/player/IPlayerNetManager";
import Player = AltVServer.Player;
import { IAltVClientEvents } from "../../../net/altv/events/AltVEventsManager";
import { IAltVClientRPC } from "../../../net/altv/rpc/AltVRPCManager";

export class AltVPlayerNetManager implements IPlayerNetManager {
  private readonly _player: Player;

  public constructor(player: Player) {
    this._player = player;
  }

  public emitEvent<K extends keyof IAltVClientEvents>(eventName: K, ...args: Parameters<IAltVClientEvents[K]>): void {
    return this._player.emit(eventName, ...args);
  }

  public emitRPC<K extends keyof IAltVClientRPC>(
    rpcName: K,
    ...args: Parameters<IAltVClientRPC[K]>
  ): Promise<ReturnType<IAltVClientRPC[K]>> {
    return this._player.emitRpc(rpcName, ...args);
  }
}
