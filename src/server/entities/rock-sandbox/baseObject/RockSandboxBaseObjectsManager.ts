import { type IBaseObjectsManager } from "../../common/baseObject/IBaseObjectsManager";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type IBaseObjectsIterator } from "../../common/baseObject/IBaseObjectsIterator";
import { RockSandboxBaseObjectsIterator } from "./RockSandboxBaseObjectsIterator";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxBaseObjectsManager<T extends IBaseObject> implements IBaseObjectsManager<T> {
  private readonly _iterator = new RockSandboxBaseObjectsIterator<T>();

  public get iterator(): IBaseObjectsIterator<T> {
    return this._iterator;
  }

  public getByID(_id: number): T {
    return rockSandboxNotImplemented("server", "RockSandboxBaseObjectsManager.getByID");
  }

  public findByID(_id: number): T | null {
    return rockSandboxNotImplemented("server", "RockSandboxBaseObjectsManager.findByID");
  }
}
