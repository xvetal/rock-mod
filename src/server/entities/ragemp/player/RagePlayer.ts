import { RageEntity } from "../entity/RageEntity";
import { IPlayer, IPlayerOptions } from "../../common/player/IPlayer";

export class RagePlayer extends RageEntity implements IPlayer {
  private _name: string;

  private _health: number;

  public get name(): string {
    return this._name;
  }

  public get health(): number {
    return this._health;
  }

  public constructor(options: IPlayerOptions) {
    super(options);
    this._name = options.name;
    this._health = 100;
  }

  public setName(value: string): void {
    this._name = value;
  }

  public setHealth(value: number): void {
    this._health = value;
  }
}
