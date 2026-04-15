import type { IBaseObjectCreateOptions, IBaseObjectsManager } from "@RockMod/client/entities";
import { type ICamera } from "@RockMod/client/entities/common/camera/ICamera";
import { type IVector3D } from "@shared/common/utils";

export interface ICameraCreateOptions extends IBaseObjectCreateOptions {
  name: string;
  position: IVector3D;
  rotation: IVector3D;
  fov: number;
}

export interface ICameraManager extends IBaseObjectsManager<ICamera> {
  create(options: ICameraCreateOptions): ICamera;
  renderScriptCams(render: boolean, ease: boolean, easeTime: number, freezePreviousCamera: boolean): void;
  getGameplayCamera(): ICamera;
}
