import { IPlayersManager } from "./server/entities/common/player/IPlayersManager";
import { RagePlayersManager } from "./server/entities/ragemp/player/RagePlayersManager";
import { IVehiclesManager } from "./server/entities/common/vehicle/IVehiclesManager";
import { RageVehiclesManager } from "./server/entities/ragemp/vehicle/RageVehiclesManager";

type MultiplayerType = "RageMP" | "AltV";

export interface RockModOptions {
  multiplayer: MultiplayerType;
}

export class RockMod {
  private readonly _options: RockModOptions;

  private readonly _players: IPlayersManager;

  private readonly _vehicles: IVehiclesManager;

  get players() {
    return this._players;
  }

  get vehicles() {
    return this._vehicles;
  }

  constructor(options: RockModOptions) {
    this._options = options;
    this._players = this._initPlayersManager();
    this._vehicles = this._initVehiclesManager();
  }

  init() {
    console.log("RockMod init");
  }

  private _initPlayersManager(): IPlayersManager {
    const { multiplayer } = this._options;

    switch (this._options.multiplayer) {
      case "RageMP": {
        return new RagePlayersManager();
      }
    }

    throw new Error(`${multiplayer} is not supported`);
  }

  private _initVehiclesManager(): IVehiclesManager {
    const { multiplayer } = this._options;

    switch (this._options.multiplayer) {
      case "RageMP": {
        return new RageVehiclesManager();
      }
    }

    throw new Error(`${multiplayer} is not supported`);
  }
}
