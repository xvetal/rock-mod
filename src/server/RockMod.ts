import { IPlayersManager } from "./entities/common/player/IPlayersManager";
import { RagePlayersManager } from "./entities/ragemp/player/RagePlayersManager";
import { IVehiclesManager } from "./entities/common/vehicle/IVehiclesManager";
import { RageVehiclesManager } from "./entities/ragemp/vehicle/RageVehiclesManager";
import { AltVPlayersManager } from "./entities/altv/player/AltVPlayersManager";
import { AltVVehiclesManager } from "./entities/altv/vehicle/AltVVehiclesManager";

type MultiplayerType = "RageMP" | "AltV";

export interface RockModOptions {
  multiplayer: MultiplayerType;
}

export class RockMod {
  private readonly _options: RockModOptions;

  private readonly _players: IPlayersManager;

  private readonly _vehicles: IVehiclesManager;

  public get players(): IPlayersManager {
    return this._players;
  }

  public get vehicles(): IVehiclesManager {
    return this._vehicles;
  }

  public constructor(options: RockModOptions) {
    this._options = options;
    this._players = this._initPlayersManager();
    this._vehicles = this._initVehiclesManager();
  }

  public init(): void {
    console.log("RockMod init");
  }

  private _initPlayersManager(): IPlayersManager {
    const { multiplayer } = this._options;

    switch (multiplayer) {
      case "RageMP": {
        return new RagePlayersManager();
      }
      case "AltV": {
        return new AltVPlayersManager();
      }
    }
  }

  private _initVehiclesManager(): IVehiclesManager {
    const { multiplayer } = this._options;

    switch (multiplayer) {
      case "RageMP": {
        return new RageVehiclesManager();
      }
      case "AltV": {
        return new AltVVehiclesManager();
      }
    }
  }
}