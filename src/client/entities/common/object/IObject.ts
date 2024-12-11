import { IEntity, IEntityOptions } from "../entity";

export interface IObjectOptions extends IEntityOptions {}

export interface IObject extends IEntity {
  get alpha(): number;
  setAlpha(value: number): void;
}
