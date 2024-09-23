import { IEntity, IEntityOptions } from "../entity/IEntity";

export interface IPlayerOptions extends IEntityOptions {
  name: string;
}

export interface IPlayer extends IEntity {
  get name(): string;
  get health(): number;
  setName(value: string): void;
  setHealth(value: number): void;
}
