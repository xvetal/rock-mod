import { type IUtilsManager } from "../common";

export class CCMPUtilsManager implements IUtilsManager {
  public hash(value: string): number {
    return ccmp.hash(value);
  }
}
