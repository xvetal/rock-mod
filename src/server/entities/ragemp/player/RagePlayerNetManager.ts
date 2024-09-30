import { IPlayerNetManager } from "../../common/player/IPlayerNetManager";

export class RagePlayerNetManager implements IPlayerNetManager {
  private readonly _player: PlayerMp;

  public constructor(player: PlayerMp) {
    this._player = player;
  }

  public callEvent(eventName: string, ...args: unknown[]): void {
    return this._player.call(eventName, args);
  }

  public callRPC(rpcName: string, ...args: unknown[]): Promise<unknown> {
    return this._player.callProc(rpcName, args);
  }
}
