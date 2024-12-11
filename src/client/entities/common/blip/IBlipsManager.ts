import { IWorldObjectCreateOptions, IWorldObjectsManager } from "../worldObject";
import { IBlip } from "./IBlip";

export interface IBlipCreateOptions extends IWorldObjectCreateOptions {
  alpha?: number;
  color?: number;
  drawDistance?: number;
  name?: string;
  rotation?: number;
  scale?: number;
  shortRange?: boolean;
  sprite: number;
}

export interface IBlipsManager extends IWorldObjectsManager<IBlip> {
  create(options: IBlipCreateOptions): IBlip;
}
