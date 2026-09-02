import { type IEntitiesManager } from "../../common/entity/IEntitiesManager";
import { type VIMPEntity } from "./VIMPEntity";
import { type IVIMPWorldObjectsManagerOptions, VIMPWorldObjectsManager } from "../worldObject/VIMPWorldObjectsManager";

export interface IVIMPEntitiesManagerOptions extends IVIMPWorldObjectsManagerOptions {}

export abstract class VIMPEntitiesManager<T extends VIMPEntity>
  extends VIMPWorldObjectsManager<T>
  implements IEntitiesManager<T>
{
  protected constructor(options: IVIMPEntitiesManagerOptions) {
    super(options);
  }
}
