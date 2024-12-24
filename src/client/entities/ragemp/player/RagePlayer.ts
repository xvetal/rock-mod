import { type IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { type IPlayer } from "../../common/player/IPlayer";

interface IRagePlayerOptions extends IRageEntityOptions<PlayerMp> {}

export class RagePlayer extends RageEntity<PlayerMp> implements IPlayer {
  public get name(): string {
    return this.mpEntity.name;
  }

  public get heading(): number {
    return this.mpEntity.heading;
  }

  public get health(): number {
    return this.mpEntity.health;
  }

  public get armour(): number {
    return this.mpEntity.armour;
  }

  public get isDead(): boolean {
    return this.mpEntity.health <= 0;
  }

  public constructor(options: IRagePlayerOptions) {
    super(options);
  }
}
