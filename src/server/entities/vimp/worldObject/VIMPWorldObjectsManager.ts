import { type IWorldObjectsManager } from "../../common/worldObject/IWorldObjectsManager";
import { type IVIMPBaseObjectsManagerOptions, VIMPBaseObjectsManager } from "../baseObject/VIMPBaseObjectsManager";
import { type VIMPWorldObject } from "./VIMPWorldObject";
import { VIMPWorldObjectsIterator } from "./VIMPWorldObjectsIterator";

export interface IVIMPWorldObjectsManagerOptions extends IVIMPBaseObjectsManagerOptions {}

export abstract class VIMPWorldObjectsManager<T extends VIMPWorldObject>
  extends VIMPBaseObjectsManager<T>
  implements IWorldObjectsManager<T>
{
  protected override readonly _iterator: VIMPWorldObjectsIterator<T>;

  public override get iterator(): VIMPWorldObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: IVIMPWorldObjectsManagerOptions) {
    super(options);
    this._iterator = new VIMPWorldObjectsIterator(this.baseObjects);
  }
}
