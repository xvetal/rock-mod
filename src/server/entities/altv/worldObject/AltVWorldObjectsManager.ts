import { IWorldObjectsManager } from "../../common/worldObject/IWorldObjectsManager";
import { AltVWorldObject } from "./AltVWorldObject";
import { AltVBaseObjectsManager } from "../baseObject/AltVBaseObjectsManager";

export abstract class AltVWorldObjectsManager<T extends AltVWorldObject>
  extends AltVBaseObjectsManager<T>
  implements IWorldObjectsManager<T> {}
