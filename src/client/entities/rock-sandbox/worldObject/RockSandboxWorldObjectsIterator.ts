import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { type IWorldObject } from "../../common/worldObject/IWorldObject";
import { type Vector2D, type Vector3D } from "../../../../shared/common/utils";
import { RockSandboxBaseObjectsIterator } from "../baseObject/RockSandboxBaseObjectsIterator";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxWorldObjectsIterator<T extends IWorldObject>
  extends RockSandboxBaseObjectsIterator<T>
  implements IWorldObjectsIterator<T>
{
  public dimension(_value: number): IterableIterator<T> {
    return rockSandboxNotImplemented("client", "RockSandboxWorldObjectsIterator.dimension");
  }

  public range2D(_center: Vector2D, _range: number): IterableIterator<T> {
    return rockSandboxNotImplemented("client", "RockSandboxWorldObjectsIterator.range2D");
  }

  public range3D(_center: Vector3D, _range: number): IterableIterator<T> {
    return rockSandboxNotImplemented("client", "RockSandboxWorldObjectsIterator.range3D");
  }
}
