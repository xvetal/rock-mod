import { IWorldObject, IWorldObjectOptions } from "../worldObject/IWorldObject";

export interface IEntityOptions extends IWorldObjectOptions {
  model: string;
}

export interface IEntity extends IWorldObject {
  get model(): string;
  setModel(value: string): void;
}
