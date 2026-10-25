import { type IVehicle } from "../../common/vehicle/IVehicle";
import { RockSandboxWorldObjectsIterator } from "../worldObject/RockSandboxWorldObjectsIterator";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapVehicle } from "./RockSandboxVehicle";
export class RockSandboxVehiclesIterator extends RockSandboxWorldObjectsIterator<IVehicle> {
  public override all(): IterableIterator<IVehicle> {
    return getRockSandbox().vehicles.all().map(wrapVehicle).values();
  }
}
