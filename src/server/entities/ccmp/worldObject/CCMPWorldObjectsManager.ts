import { type IWorldObjectsManager } from "../../common/worldObject/IWorldObjectsManager";
import { type ICCMPBaseObjectsManagerOptions, CCMPBaseObjectsManager } from "../baseObject/CCMPBaseObjectsManager";
import { type CCMPWorldObject } from "./CCMPWorldObject";
import { CCMPWorldObjectsIterator } from "./CCMPWorldObjectsIterator";

export interface ICCMPWorldObjectsManagerOptions extends ICCMPBaseObjectsManagerOptions {}

export abstract class CCMPWorldObjectsManager<T extends CCMPWorldObject>
  extends CCMPBaseObjectsManager<T>
  implements IWorldObjectsManager<T>
{
  protected override readonly _iterator: CCMPWorldObjectsIterator<T>;

  public override get iterator(): CCMPWorldObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: ICCMPWorldObjectsManagerOptions) {
    super(options);
    this._iterator = new CCMPWorldObjectsIterator(this.baseObjects);
  }
}
