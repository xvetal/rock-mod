import { type IPlayersManager } from "../../common/player/IPlayersManager";
import { CCMPEntitiesManager } from "../entity/CCMPEntitiesManager";
import { type CCMPPlayer } from "./CCMPPlayer";
import type { CCMPNetManager } from "../../../net/ccmp/CCMPNetManager";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPPlayersManager extends CCMPEntitiesManager<CCMPPlayer> implements IPlayersManager {
  public constructor(_net: CCMPNetManager) {
    super({
      baseObjectsType: "player",
    });
  }

  public getByName(_name: string): CCMPPlayer {
    return notImplemented("CCMPPlayersManager.getByName");
  }

  public findByName(_name: string): CCMPPlayer | null {
    return notImplemented("CCMPPlayersManager.findByName");
  }

  public getBySocialClub(_socialClub: string): CCMPPlayer {
    return notImplemented("CCMPPlayersManager.getBySocialClub");
  }

  public findBySocialClub(_socialClub: string): CCMPPlayer | null {
    return notImplemented("CCMPPlayersManager.findBySocialClub");
  }
}
