import { IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { IPlayer } from "../../common/player/IPlayer";
import { RagePlayerNetManager } from "./RagePlayerNetManager";

interface IRagePlayerOptions extends IRageEntityOptions<PlayerMp> {}

export class RagePlayer extends RageEntity<PlayerMp> implements IPlayer {
  private readonly _net: RagePlayerNetManager;

  public get net(): RagePlayerNetManager {
    return this._net;
  }

  public get name(): string {
    return this.mpEntity.name;
  }

  public get socialClub(): string {
    return this.mpEntity.socialClub;
  }

  public get health(): number {
    return this.mpEntity.health;
  }

  public constructor(options: IRagePlayerOptions) {
    super(options);
    this._net = new RagePlayerNetManager(this.mpEntity);
  }

  public setHealth(value: number): void {
    this.mpEntity.health = value;
  }
}
