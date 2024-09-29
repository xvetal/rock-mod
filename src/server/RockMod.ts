import { INetManager } from "./net/common/INetManager";
import { IPlayersManager } from "./entities/common/player/IPlayersManager";
import { IVehiclesManager } from "./entities/common/vehicle/IVehiclesManager";
import { IManagersFactory } from "./entities/common/IManagersFactory";
import { AltVManagersFactory } from "./entities/altv/AltVManagersFactory";
import { RageManagersFactory } from "./entities/ragemp/RageManagersFactory";

type MultiplayerType = "RageMP" | "AltV";

export interface RockModOptions {
  multiplayer: MultiplayerType;
}

export class RockMod {
  private readonly _options: RockModOptions;

  private readonly _net: INetManager;

  private readonly _players: IPlayersManager;

  private readonly _vehicles: IVehiclesManager;

  public get net(): INetManager {
    return this._net;
  }

  public get players(): IPlayersManager {
    return this._players;
  }

  public get vehicles(): IVehiclesManager {
    return this._vehicles;
  }

  public constructor(options: RockModOptions) {
    this._options = options;

    const managersFactory = this._initManagersFactory();

    this._net = managersFactory.createNetManager();
    this._players = managersFactory.createPlayersManager();
    this._vehicles = managersFactory.createVehiclesManager();
  }

  public init(): void {
    console.log("RockMod init");
  }

  private _initManagersFactory(): IManagersFactory {
    const { multiplayer } = this._options;

    switch (multiplayer) {
      case "AltV": {
        return new AltVManagersFactory();
      }
      case "RageMP": {
        return new RageManagersFactory();
      }
    }
  }
}
