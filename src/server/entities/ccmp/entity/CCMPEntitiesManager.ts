import { type IEntitiesManager } from "../../common/entity/IEntitiesManager";
import { type CCMPEntity } from "./CCMPEntity";
import { type ICCMPWorldObjectsManagerOptions, CCMPWorldObjectsManager } from "../worldObject/CCMPWorldObjectsManager";

export interface ICCMPEntitiesManagerOptions extends ICCMPWorldObjectsManagerOptions {}

export abstract class CCMPEntitiesManager<T extends CCMPEntity>
  extends CCMPWorldObjectsManager<T>
  implements IEntitiesManager<T>
{
  protected constructor(options: ICCMPEntitiesManagerOptions) {
    super(options);
  }
}
