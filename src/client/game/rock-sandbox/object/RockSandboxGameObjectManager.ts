import { type IGameObjectManager } from "../../common/object/IGameObjectManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxGameObjectManager implements IGameObjectManager {
  public doorControl(
    _modelHash: number,
    _x: number,
    _y: number,
    _z: number,
    _locked: boolean,
    _xRotMult: number,
    _yRotMult: number,
    _zRotMult: number,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxGameObjectManager.doorControl");
  }
}
