import { IEntitiesManager } from "../../common/entity/IEntitiesManager";
import { AltVEntity } from "./AltVEntity";
import { AltVWorldObjectsManager } from "../worldObject/AltVWorldObjectsManager";
import Entity = AltVServer.Entity;

export abstract class AltVEntitiesManager<T extends AltVEntity<Entity>>
  extends AltVWorldObjectsManager<T>
  implements IEntitiesManager<T> {}
