import { type IObject } from "../../common/object/IObject";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxObject extends RockSandboxEntity implements IObject {
  public attachTo(
    _entity: Handle,
    _boneIndex: number,
    _xPos: number,
    _yPos: number,
    _zPos: number,
    _xRot: number,
    _yRot: number,
    _zRot: number,
    _useSoftPinning: boolean,
    _collision: boolean,
    _isPed: boolean,
    _vertexIndex: number,
    _fixedRot: boolean,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxObject.attachTo");
  }

  public isAttachedTo(_entity: number): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxObject.isAttachedTo");
  }
}
