/// <reference types="@classic-mp/types/client" />

import { type IGameObjectManager } from "../../common/object/IGameObjectManager";

export class CCMPGameObjectManager implements IGameObjectManager {
  public doorControl(
    modelHash: number,
    x: number,
    y: number,
    z: number,
    locked: boolean,
    xRotMult: number,
    yRotMult: number,
    zRotMult: number,
  ): void {
    ccmp.natives.object.setLockedUnstreamedInDoorOfType(modelHash, x, y, z, locked, xRotMult, yRotMult, zRotMult);
  }
}
