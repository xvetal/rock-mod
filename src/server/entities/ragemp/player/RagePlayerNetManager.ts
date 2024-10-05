import { IPlayerNetManager } from "../../common/player/IPlayerNetManager";
import { IRageClientEvents } from "../../../net/ragemp/events/RageEventsManager";
import { IRageClientRPC } from "../../../net/ragemp/rpc/RageRPCManager";

export class RagePlayerNetManager implements IPlayerNetManager {
  private readonly _player: PlayerMp;

  public constructor(player: PlayerMp) {
    this._player = player;
  }

  public emitEvent<K extends keyof IRageClientEvents>(eventName: K, ...args: Parameters<IRageClientEvents[K]>): void {
    return this._player.call(eventName, args);
  }

  public emitRPC<K extends keyof IRageClientRPC>(
    rpcName: K,
    ...args: Parameters<IRageClientRPC[K]>
  ): Promise<ReturnType<IRageClientRPC[K]>> {
    return this._player.callProc(rpcName, args);
  }
}
