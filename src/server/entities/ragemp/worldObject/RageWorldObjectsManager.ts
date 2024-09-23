import { IWorldObjectsManager } from "../../common/worldObject/IWorldObjectsManager";
import { RageBaseObjectsManager } from "../baseObject/RageBaseObjectsManager";
import { RageWorldObject } from "./RageWorldObject";

export abstract class RageWorldObjectsManager<T extends RageWorldObject>
  extends RageBaseObjectsManager<T>
  implements IWorldObjectsManager<T> {}
