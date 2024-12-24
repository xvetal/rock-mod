import { type IWorldObject, type IWorldObjectOptions } from "../worldObject";
import { type IBlipColor, type IBlipSprite } from "@shared/entities";

export interface IBlipOptions extends IWorldObjectOptions {}

export interface IBlip extends IWorldObject {
  get sprite(): IBlipSprite;
  get color(): number;
  get alpha(): number;
  get shortRange(): boolean;
  get dimension(): number;
  setSprite(value: IBlipSprite): void;
  setColor(value: IBlipColor): void;
  setAlpha(value: number): void;
}
