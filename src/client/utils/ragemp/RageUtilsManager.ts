import { IUtilsManager } from "../common";

export class RageUtilsManager implements IUtilsManager {
  public hash(value: string): number {
    return mp.game.joaat(value);
  }
}
