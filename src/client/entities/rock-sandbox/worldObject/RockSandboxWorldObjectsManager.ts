import { type IWorldObjectsManager } from "../../common/worldObject/IWorldObjectsManager";
import { type IWorldObject } from "../../common/worldObject/IWorldObject";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { RockSandboxBaseObjectsManager } from "../baseObject/RockSandboxBaseObjectsManager";
import { RockSandboxWorldObjectsIterator } from "./RockSandboxWorldObjectsIterator";

export class RockSandboxWorldObjectsManager<T extends IWorldObject>
  extends RockSandboxBaseObjectsManager<T>
  implements IWorldObjectsManager<T>
{
  private readonly _worldObjectsIterator = new RockSandboxWorldObjectsIterator<T>();

  public override get iterator(): IWorldObjectsIterator<T> {
    return this._worldObjectsIterator;
  }
}
