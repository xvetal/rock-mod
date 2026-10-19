import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type BaseObjectType } from "../../../../shared/entities";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxBaseObject implements IBaseObject {
  public get id(): number {
    return rockSandboxNotImplemented("client", "RockSandboxBaseObject.id");
  }

  public get remoteId(): number | null {
    return rockSandboxNotImplemented("client", "RockSandboxBaseObject.remoteId");
  }

  public get type(): BaseObjectType {
    return rockSandboxNotImplemented("client", "RockSandboxBaseObject.type");
  }

  public get isExists(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxBaseObject.isExists");
  }

  public get handle(): number {
    return rockSandboxNotImplemented("client", "RockSandboxBaseObject.handle");
  }

  public destroy(): void {
    return rockSandboxNotImplemented("client", "RockSandboxBaseObject.destroy");
  }
}
