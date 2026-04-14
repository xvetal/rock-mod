import type { IBaseObjectCreateOptions, IBaseObjectsManager } from "@RockMod/client/entities";
import { type IRockModCamera } from "@RockMod/client/entities/common/camera/IRockModCamera";
import { type IVector3D } from "@shared/common/utils";

export interface ICameraCreateOptions extends IBaseObjectCreateOptions {
  name: string;
  position: IVector3D;
  rotation: IVector3D;
  fov: number;
}

export interface ICameraManager extends IBaseObjectsManager<IRockModCamera> {
  create(options: ICameraCreateOptions): IRockModCamera;
  renderScriptCams(render: boolean, ease: boolean, easeTime: number, freezePreviousCamera: boolean): void;
  getGameplayCamera(): IRockModCamera;
}
