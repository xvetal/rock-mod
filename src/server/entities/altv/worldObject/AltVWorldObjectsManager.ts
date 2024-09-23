import { IWorldObjectsManager, IWorldObjectsManagerOptions } from "../../common/worldObject/IWorldObjectsManager";
import { AltVWorldObject } from "./AltVWorldObject";
import { AltVBaseObjectsManager } from "../baseObject/AltVBaseObjectsManager";
import { AltVWorldObjectsIterator } from "./AltVWorldObjectsIterator";

export abstract class AltVWorldObjectsManager<T extends AltVWorldObject>
  extends AltVBaseObjectsManager<T>
  implements IWorldObjectsManager<T>
{
  protected override readonly _iterator: AltVWorldObjectsIterator<T>;

  public override get iterator(): AltVWorldObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: IWorldObjectsManagerOptions) {
    super(options);
    this._iterator = new AltVWorldObjectsIterator(this.baseObjects);
  }
}
