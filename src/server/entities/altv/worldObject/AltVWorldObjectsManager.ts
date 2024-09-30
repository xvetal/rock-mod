import { IWorldObjectsManager } from "../../common/worldObject/IWorldObjectsManager";
import { AltVWorldObject } from "./AltVWorldObject";
import { AltVBaseObjectsManager, IAltVBaseObjectsManagerOptions } from "../baseObject/AltVBaseObjectsManager";
import { AltVWorldObjectsIterator } from "./AltVWorldObjectsIterator";
import WorldObject = AltVServer.WorldObject;

export interface IAltVWorldObjectsManagerOptions extends IAltVBaseObjectsManagerOptions {}

export abstract class AltVWorldObjectsManager<T extends AltVWorldObject<WorldObject>>
  extends AltVBaseObjectsManager<T>
  implements IWorldObjectsManager<T>
{
  protected override readonly _iterator: AltVWorldObjectsIterator<T>;

  public override get iterator(): AltVWorldObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: IAltVWorldObjectsManagerOptions) {
    super(options);
    this._iterator = new AltVWorldObjectsIterator(this.baseObjects);
  }
}
