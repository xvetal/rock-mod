import { IEntity, IEntityOptions } from "../entity/IEntity";

export interface IPlayerOptions extends IEntityOptions {
  name: string;
}

export interface IPlayer extends IEntity {
  get name(): string;
  set name(value: string);
  get health(): number;
  set health(value: number);
}
