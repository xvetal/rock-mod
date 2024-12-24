import { type IWorldObjectsManager } from "../../common";
import { type IRageBaseObjectsManagerOptions, RageBaseObjectsManager } from "../baseObject/RageBaseObjectsManager";
import { type RageWorldObject } from "./RageWorldObject";
import { RageWorldObjectsIterator } from "./RageWorldObjectsIterator";

export interface IRageWorldObjectsManagerOptions extends IRageBaseObjectsManagerOptions {}

export abstract class RageWorldObjectsManager<T extends RageWorldObject<EntityMp>>
  extends RageBaseObjectsManager<T>
  implements IWorldObjectsManager<T>
{
  protected override readonly _iterator: RageWorldObjectsIterator<T>;

  public override get iterator(): RageWorldObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: IRageWorldObjectsManagerOptions) {
    super(options);
    this._iterator = new RageWorldObjectsIterator(this.baseObjects);
  }
}
