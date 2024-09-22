import { AltVEntity } from "../entity/AltVEntity";
import { IPlayer, IPlayerOptions } from "../../common/player/IPlayer";

export class AltVPlayer extends AltVEntity implements IPlayer {
  private _name: string;

  private _health: number;

  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get health(): number {
    return this._health;
  }

  public set health(value: number) {
    this._health = value;
  }

  public constructor(options: IPlayerOptions) {
    super(options);
    this._name = options.name;
    this._health = 100;
  }
}
