import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { type CCMPWorldObject } from "./CCMPWorldObject";
import { CCMPBaseObjectsIterator } from "../baseObject/CCMPBaseObjectsIterator";
import { type Vector2D, type Vector3D } from "../../../../shared/common/utils/math/Vectors";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPWorldObjectsIterator<T extends CCMPWorldObject>
  extends CCMPBaseObjectsIterator<T>
  implements IWorldObjectsIterator<T>
{
  public constructor(baseObjects: ReadonlyMap<number, T>) {
    super(baseObjects);
  }

  public dimension(_value: number): IterableIterator<T> {
    return notImplemented("CCMPWorldObjectsIterator.dimension");
  }

  public range2D(_center: Vector2D, _range: number): IterableIterator<T> {
    return notImplemented("CCMPWorldObjectsIterator.range2D");
  }

  public range3D(_center: Vector3D, _range: number): IterableIterator<T> {
    return notImplemented("CCMPWorldObjectsIterator.range3D");
  }
}
