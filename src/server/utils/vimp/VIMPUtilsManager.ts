import { type IUtilsManager } from "../common";

export class VIMPUtilsManager implements IUtilsManager {
  public hash(value: string): number {
    return vimp.hash(value);
  }
}
