import { type IGameObjectManager } from "@RockMod/client/game";

export class RageGameObjectManager implements IGameObjectManager {
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
    mp.game.object.doorControl(modelHash, x, y, z, locked, xRotMult, yRotMult, zRotMult);
  }
}
