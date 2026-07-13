import { type IWorldObject, type IWorldObjectOptions } from "../worldObject";

export interface IColshapeOptions extends IWorldObjectOptions {}

export interface IColshape extends IWorldObject {
  get key(): string | undefined;
  getNetData(name: string): unknown;
  setNetData(name: string, value: unknown): void;
}
