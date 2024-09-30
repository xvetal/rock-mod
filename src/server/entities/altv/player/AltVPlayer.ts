import { AltVEntity, IAltVEntityOptions } from "../entity/AltVEntity";
import { IPlayer } from "../../common/player/IPlayer";
import { AltVPlayerNetManager } from "./AltVPlayerNetManager";
import Player = AltVServer.Player;

interface AltVPlayerOptions extends IAltVEntityOptions<Player> {}

export class AltVPlayer extends AltVEntity<Player> implements IPlayer {
  private readonly _net: AltVPlayerNetManager;

  public get net(): AltVPlayerNetManager {
    return this._net;
  }

  public get name(): string {
    return this.mpEntity.name;
  }

  public get socialClub(): string {
    return this.mpEntity.socialID;
  }

  public get health(): number {
    return this.mpEntity.health;
  }

  public constructor(options: AltVPlayerOptions) {
    super(options);
    this._net = new AltVPlayerNetManager(this.mpEntity);
  }

  public setHealth(value: number): void {
    this.mpEntity.health = value;
  }
}
