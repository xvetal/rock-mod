import { AltVEntity } from "../entity/AltVEntity";
import { IPlayer, IPlayerOptions } from "../../common/player/IPlayer";
import { AltVPlayerNetManager } from "./AltVPlayerNetManager";
import PlayerMP = AltV.PlayerMP;

interface AltVPlayerOptions extends IPlayerOptions {
  entity: PlayerMP;
}

export class AltVPlayer extends AltVEntity implements IPlayer {
  private readonly _entity: PlayerMP;

  private readonly _net: AltVPlayerNetManager;

  private _name: string;

  private readonly _socialClub: string;

  private _health: number;

  public get net(): AltVPlayerNetManager {
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

  public constructor(options: AltVPlayerOptions) {
    super(options);
    this._entity = options.entity;
    this._net = new AltVPlayerNetManager(this._entity);
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
