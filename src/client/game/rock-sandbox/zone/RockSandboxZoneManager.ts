import { type IZoneManager } from "../../common/zone/IZoneManager";
import { type IVector3D } from "../../../../shared/common/utils";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxZoneManager implements IZoneManager {
  public getNameOfZone(_position: IVector3D): string {
    return rockSandboxNotImplemented("client", "RockSandboxZoneManager.getNameOfZone");
  }
}
