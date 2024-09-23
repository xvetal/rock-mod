import { IEntitiesManager } from "../../common/entity/IEntitiesManager";
import { AltVEntity } from "./AltVEntity";
import { AltVWorldObjectsManager } from "../worldObject/AltVWorldObjectsManager";

export abstract class AltVEntitiesManager<T extends AltVEntity>
  extends AltVWorldObjectsManager<T>
  implements IEntitiesManager<T> {}
