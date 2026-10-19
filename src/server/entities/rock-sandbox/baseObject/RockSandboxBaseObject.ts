import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type BaseObjectType } from "../../../../shared";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxBaseObject implements IBaseObject {
  public get id(): number {
    return rockSandboxNotImplemented("server", "RockSandboxBaseObject.id");
  }

  public get type(): BaseObjectType {
    return rockSandboxNotImplemented("server", "RockSandboxBaseObject.type");
  }

  public get isExists(): boolean {
    return rockSandboxNotImplemented("server", "RockSandboxBaseObject.isExists");
  }

  public destroy(): void {
    return rockSandboxNotImplemented("server", "RockSandboxBaseObject.destroy");
  }
}
