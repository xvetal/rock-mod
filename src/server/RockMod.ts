import { INetManager } from "./net/common/INetManager";
import { IObjectsManager, IPedsManager, IPlayersManager, IVehiclesManager } from "./entities";
import { IManagersFactory } from "./factories/common/IManagersFactory";

type MultiplayerType = "RageMP" | "AltV";

export interface RockModOptions {
  multiplayer: MultiplayerType;
}

export class RockMod {
  private static _instance?: RockMod;

  public static async create(options: RockModOptions): Promise<RockMod> {
    if (this._instance) {
      throw new Error("RockMod already created");
    }

    const managersFactory = await this._initManagersFactory(options);

    this._instance = new RockMod(managersFactory);

    return this._instance;
  }

  public static get instance(): RockMod {
    if (!this._instance) {
      throw new Error("RockMod not created");
    }

    return this._instance;
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

  private readonly _managersFactory: IManagersFactory;

  private readonly _net: INetManager;

  private readonly _objects: IObjectsManager;

  private readonly _peds: IPedsManager;

  private readonly _players: IPlayersManager;

  private readonly _vehicles: IVehiclesManager;

  public get net(): INetManager {
    return this._net;
  }

  public get objects(): IObjectsManager {
    return this._objects;
  }

  public get peds(): IPedsManager {
    return this._peds;
  }

  public get players(): IPlayersManager {
    return this._players;
  }

  public get vehicles(): IVehiclesManager {
    return this._vehicles;
  }

  private constructor(managersFactory: IManagersFactory) {
    this._managersFactory = managersFactory;
    this._net = managersFactory.createNetManager();
    this._objects = this._managersFactory.createObjectsManager();
    this._peds = this._managersFactory.createPedsManager();
    this._players = this._managersFactory.createPlayersManager();
    this._vehicles = this._managersFactory.createVehiclesManager();
  }

  public init(): void {
    console.log("RockMod init");
  }
}
