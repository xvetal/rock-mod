import { IWorldObject, IWorldObjectOptions } from "../worldObject";
import { IBlipColor, IBlipSprite } from "../../../../shared";

export interface IBlipOptions extends IWorldObjectOptions {}

export interface IBlip extends IWorldObject {
  get name(): string;
  get sprite(): IBlipSprite;
  get color(): number;
  get alpha(): number;
  get scale(): number;
  get drawDistance(): number;
  get shortRange(): boolean;
  get rotation(): number;
  get dimension(): number;
  setName(value: string): void;
  setSprite(value: IBlipSprite): void;
  setColor(value: IBlipColor): void;
  setAlpha(value: number): void;
}
