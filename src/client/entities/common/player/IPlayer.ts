import { type IEntity, type IEntityOptions } from "../entity/IEntity";

export interface IPlayerOptions extends IEntityOptions {}

export interface IPlayer extends IEntity {
  get name(): string;
  get heading(): number;
  get health(): number;
  get armour(): number;
  get isDead(): boolean;
}
