import { type IWorldObjectCreateOptions, type IWorldObjectsManager } from "../worldObject";
import { type IRockModBlip } from "./IRockModBlip";

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

export interface IBlipsManager extends IWorldObjectsManager<IRockModBlip> {
  create(options: IBlipCreateOptions): IRockModBlip;
}
