import { IUtilsManager } from "../common";

export class AltVUtilsManager implements IUtilsManager {
  public hash(value: string): number {
    return AltVShared.hash(value);
  }
}
