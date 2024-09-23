import { IWorldObjectsManager, IWorldObjectsManagerOptions } from "../../common/worldObject/IWorldObjectsManager";
import { RageBaseObjectsManager } from "../baseObject/RageBaseObjectsManager";
import { RageWorldObject } from "./RageWorldObject";
import { RageWorldObjectsIterator } from "./RageWorldObjectsIterator";

export abstract class RageWorldObjectsManager<T extends RageWorldObject>
  extends RageBaseObjectsManager<T>
  implements IWorldObjectsManager<T>
{
  protected override readonly _iterator: RageWorldObjectsIterator<T>;

  public override get iterator(): RageWorldObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: IWorldObjectsManagerOptions) {
    super(options);
    this._iterator = new RageWorldObjectsIterator(this.baseObjects);
  }
}
