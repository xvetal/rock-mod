import { type IEntity } from "../../common/entity/IEntity";
import { type IVector3D } from "../../../../shared/common/utils";
import { RockSandboxWorldObject } from "../worldObject/RockSandboxWorldObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxEntity extends RockSandboxWorldObject implements IEntity {
  public get model(): number {
    return rockSandboxNotImplemented("server", "RockSandboxEntity.model");
  }

  public get rotation(): IVector3D {
    return rockSandboxNotImplemented("server", "RockSandboxEntity.rotation");
  }

  public setModel(_value: string): void {
    return rockSandboxNotImplemented("server", "RockSandboxEntity.setModel");
  }

  public setRotation(_value: IVector3D): void {
    return rockSandboxNotImplemented("server", "RockSandboxEntity.setRotation");
  }

  public getNetData(_name: string): unknown {
    return rockSandboxNotImplemented("server", "RockSandboxEntity.getNetData");
  }

  public setNetData(_name: string, _value: unknown): void {
    return rockSandboxNotImplemented("server", "RockSandboxEntity.setNetData");
  }
}
