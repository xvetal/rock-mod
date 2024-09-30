import { IEntity, IEntityOptions } from "../entity/IEntity";
import { IPlayerNetManager } from "./IPlayerNetManager";

export interface IPlayerOptions extends IEntityOptions {
  name: string;
  socialClub: string;
}

export interface IPlayer extends IEntity {
  get net(): IPlayerNetManager;
  get name(): string;
  get socialClub(): string;
  get health(): number;
  setHealth(value: number): void;
}
