import { INetManager } from "./net/common/INetManager";
import { IPlayersManager } from "./entities/common/player/IPlayersManager";
import { IVehiclesManager } from "./entities/common/vehicle/IVehiclesManager";
import { IManagersFactory } from "./factories/common/IManagersFactory";

type MultiplayerType = "RageMP" | "AltV";

export interface RockModOptions {
  multiplayer: MultiplayerType;
}

export class RockMod {
  public static async create(options: RockModOptions): Promise<RockMod> {
    const managersFactory = await this._initManagersFactory(options);

    return new RockMod(managersFactory);
  }

  private static async _initManagersFactory(options: RockModOptions): Promise<IManagersFactory> {
    const { multiplayer } = options;

    switch (multiplayer) {
      case "AltV": {
        const { AltVManagersFactory } = await import("./factories/altv/AltVManagersFactory");
        return new AltVManagersFactory();
      }
      case "RageMP": {
        const { RageManagersFactory } = await import("./factories/ragemp/RageManagersFactory");
        return new RageManagersFactory();
      }
    }
  }

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

  private constructor(managersFactory: IManagersFactory) {
    this._net = managersFactory.createNetManager();
    this._players = managersFactory.createPlayersManager(this._net);
    this._vehicles = managersFactory.createVehiclesManager(this._net);
  }

  public init(): void {
    console.log("RockMod init");
  }
}
