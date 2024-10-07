import { IWorldObjectCreateOptions, IWorldObjectsManager } from "../worldObject";
import { IBlip } from "./IBlip";

export interface IBlipCreateOptions extends IWorldObjectCreateOptions {
  sprite: number;
  alpha: number;
}

export interface IBlipsManager extends IWorldObjectsManager<IBlip> {
  create(options: IBlipCreateOptions): IBlip;
}
