import { IWorldObject, IWorldObjectOptions } from "../worldObject/IWorldObject";

export interface IEntityOptions extends IWorldObjectOptions {}

export interface IEntity extends IWorldObject {
  get model(): number;
  setModel(value: number): void;
}
