import { IPlayerNetManager } from "../../common/player/IPlayerNetManager";
import Player = AltVServer.Player;

export class AltVPlayerNetManager implements IPlayerNetManager {
  private readonly _player: Player;

  public constructor(player: Player) {
    this._player = player;
  }

  public callEvent(eventName: string, ...args: unknown[]): void {
    return this._player.emit(eventName, ...args);
  }

  public callRPC(rpcName: string, ...args: unknown[]): Promise<unknown> {
    return this._player.emitRpc(rpcName, ...args);
  }
}
