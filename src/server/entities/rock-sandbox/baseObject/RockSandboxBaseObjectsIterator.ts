import { type IBaseObjectsIterator } from "../../common/baseObject/IBaseObjectsIterator";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxBaseObjectsIterator<T extends IBaseObject> implements IBaseObjectsIterator<T> {
  public all(): IterableIterator<T> {
    return rockSandboxNotImplemented("server", "RockSandboxBaseObjectsIterator.all");
  }
}
