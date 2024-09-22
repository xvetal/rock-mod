import { RageEntity } from "../entity/RageEntity";
import { IPlayer, IPlayerOptions } from "../../common/player/IPlayer";

export class RagePlayer extends RageEntity implements IPlayer {
  private _name: string;

  private _health: number;

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get health() {
    return this._health;
  }

  set health(value: number) {
    this._health = value;
  }

  constructor(options: IPlayerOptions) {
    super(options);
    this._name = options.name;
    this._health = 100;
  }
}
