import { type IUtilsManager } from "../common/IUtilsManager";
import { getRockSandbox } from "../../internal/getRockSandbox";

export class RockSandboxUtilsManager implements IUtilsManager {
  public hash(value: string): number {
    return getRockSandbox().utils.hash(value);
  }
}
