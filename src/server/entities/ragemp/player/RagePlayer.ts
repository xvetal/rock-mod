import { RageEntity } from "../entity/RageEntity";
import { IPlayer, IPlayerOptions } from "../../common/player/IPlayer";
import { RagePlayerNetManager } from "./RagePlayerNetManager";
import PlayerMP = RageMP.PlayerMP;

interface IRagePlayerOptions extends IPlayerOptions {
  entity: PlayerMP;
}

export class RagePlayer extends RageEntity implements IPlayer {
  private readonly _entity: PlayerMP;

  private readonly _net: RagePlayerNetManager;

  private _name: string;

  private readonly _socialClub: string;

  private _health: number;

  public get net(): RagePlayerNetManager {
    return this._net;
  }

  public get name(): string {
    return this._name;
  }

  public get socialClub(): string {
    return this._socialClub;
  }

  public get health(): number {
    return this._health;
  }

  public constructor(options: IRagePlayerOptions) {
    super(options);
    this._entity = options.entity;
    this._net = new RagePlayerNetManager(this._entity);
    this._name = options.name;
    this._socialClub = options.socialClub;
    this._health = 100;
  }

  public setName(value: string): void {
    this._name = value;
  }

  public setHealth(value: number): void {
    this._health = value;
  }
}
