import { type IPed } from "../../common/ped/IPed";
import { RockSandboxWorldObjectsIterator } from "../worldObject/RockSandboxWorldObjectsIterator";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapPed } from "./RockSandboxPed";
import { type Vector2D, type Vector3D } from "../../../../shared/common/utils/math/Vectors";

export class RockSandboxPedsIterator extends RockSandboxWorldObjectsIterator<IPed> {
  public override all(): IterableIterator<IPed> {
    return getRockSandbox().peds.all().map(wrapPed).values();
  }

  public override dimension(value: number): IterableIterator<IPed> {
    if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) throw new RangeError("Invalid NPC dimension");
    return [...this.all()].filter((ped) => ped.dimension === value).values();
  }

  public override range2D(center: Vector2D, range: number): IterableIterator<IPed> {
    if (![center.x, center.y, range].every(Number.isFinite) || range < 0) throw new RangeError("Invalid NPC range");
    return [...this.all()]
      .filter((ped) => Math.hypot(ped.position.x - center.x, ped.position.y - center.y) <= range)
      .values();
  }

  public override range3D(center: Vector3D, range: number): IterableIterator<IPed> {
    if (![center.x, center.y, center.z, range].every(Number.isFinite) || range < 0)
      throw new RangeError("Invalid NPC range");
    return [...this.all()]
      .filter(
        (ped) => Math.hypot(ped.position.x - center.x, ped.position.y - center.y, ped.position.z - center.z) <= range,
      )
      .values();
  }
}
