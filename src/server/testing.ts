import { MockPlayer } from "entities/mock/player/MockPlayer";
import { RockMod } from "./RockMod";
import { IMockPlayerConnectOptions, MockPlayersManager } from "./entities/mock/player/MockPlayersManager";

export class RockModTesting {
  public static simulatePlayerConnect(options?: IMockPlayerConnectOptions): MockPlayer {
    const manager = RockMod.instance.players as MockPlayersManager;
    return manager.simulateConnect(options);
  }

  public static simulatePlayerDisconnect(player: MockPlayer): void {
    const manager = RockMod.instance.players as MockPlayersManager;
    return manager.simulateDisconnect(player);
  }

  public static createMockPlayerNow(options?: IMockPlayerConnectOptions): MockPlayer {
    const manager = RockMod.instance.players as MockPlayersManager;
    return manager.createPlayer(options);
  }
}

export { IMockPlayerConnectOptions, type MockPlayer };
