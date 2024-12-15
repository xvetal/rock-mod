import { IPlayersManager } from "../../common/player/IPlayersManager";
import { MockPlayer } from "./MockPlayer";
import { MockEntitiesManager } from "../entity/MockEntitiesManager";
import { RockMod } from "../../../RockMod";
import { Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { BaseObjectType } from "../../../../shared";
import { ServerInternalEventName } from "@RockMod/server/net/common/events/types";

export interface IMockPlayerConnectOptions {
  id?: number;
  name?: string;
  socialClub?: string;
  position?: Vector3D;
  dimension?: number;
  health?: number;
  armour?: number;
  ip?: string;
  serial?: string;
}

export class MockPlayersManager extends MockEntitiesManager<MockPlayer> implements IPlayersManager {
  private _nextId: number;

  public constructor() {
    super({
      baseObjectsType: "player",
    });
    this._nextId = 0;
  }

  public getByName(name: string): MockPlayer {
    const player = this.findByName(name);

    if (!player) {
      throw new Error(`Player with name ${name} not found`);
    }

    return player;
  }

  public findByName(name: string): MockPlayer | null {
    for (const player of this.iterator.all()) {
      if (player.name === name) {
        return player;
      }
    }

    return null;
  }

  public getBySocialClub(socialClub: string): MockPlayer {
    const player = this.findBySocialClub(socialClub);

    if (!player) {
      throw new Error(`Player with socialClub ${socialClub} not found`);
    }

    return player;
  }

  public findBySocialClub(socialClub: string): MockPlayer | null {
    for (const player of this.iterator.all()) {
      if (player.socialClub === socialClub) {
        return player;
      }
    }

    return null;
  }

  public createPlayer(options: IMockPlayerConnectOptions = {}): MockPlayer {
    const {
      id = this._nextId++,
      name = `Player${id}`,
      socialClub = `Player${id}`,
      position = new Vector3D(0, 0, 0),
      dimension = 0,
      health = 100,
      armour = 0,
      ip = "127.0.0.1",
      serial = `MOCK_${id}`,
    } = options;

    const player = new MockPlayer({
      id,
      type: BaseObjectType.Player,
      name,
      socialClub,
      position,
      dimension,
      health,
      armour,
      ip,
      serial,
      model: 0,
      rotation: new Vector3D(0, 0, 0),
    });

    this.registerBaseObject(player);
    return player;
  }

  public simulateConnect(options: IMockPlayerConnectOptions = {}): MockPlayer {
    const player = this.createPlayer(options);
    RockMod.instance.net.events.emitInternal(ServerInternalEventName.PlayerConnected, player);
    return player;
  }

  public simulateDisconnect(player: MockPlayer): void {
    if (!this._baseObjects.has(player.id)) {
      throw new Error(`Player with id ${player.id} not found`);
    }

    RockMod.instance.net.events.emitInternal(ServerInternalEventName.PlayerDisconnected, player);
    this.unregisterBaseObject(player);
  }
}
