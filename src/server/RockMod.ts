import { INetManager } from "./net/common/INetManager";
import {
  IBlipsManager,
  IColshapesManager,
  IMarkersManager,
  IObjectsManager,
  IPedsManager,
  IPlayersManager,
  IVehiclesManager,
} from "./entities";
import { IUtilsManager } from "./utils";
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

  private readonly _net: INetManager;

  private readonly _blips: IBlipsManager;

  private readonly _colshapes: IColshapesManager;

  private readonly _markers: IMarkersManager;

  private readonly _objects: IObjectsManager;

  private readonly _peds: IPedsManager;

  private readonly _players: IPlayersManager;

  private readonly _utils: IUtilsManager;

  private readonly _vehicles: IVehiclesManager;

  public get net(): INetManager {
    return this._net;
  }

  public get blips(): IBlipsManager {
    return this._blips;
  }

  public get colshapes(): IColshapesManager {
    return this._colshapes;
  }

  public get markers(): IMarkersManager {
    return this._markers;
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

  public get utils(): IUtilsManager {
    return this._utils;
  }

  public get vehicles(): IVehiclesManager {
    return this._vehicles;
  }

  private constructor(managersFactory: IManagersFactory) {
    this._net = managersFactory.createNetManager();
    this._blips = managersFactory.createBlipsManager();
    this._colshapes = managersFactory.createColshapesManager();
    this._markers = managersFactory.createMarkersManager();
    this._objects = managersFactory.createObjectsManager();
    this._peds = managersFactory.createPedsManager();
    this._players = managersFactory.createPlayersManager(this._net);
    this._utils = managersFactory.createUtilsManager();
    this._vehicles = managersFactory.createVehiclesManager();
  }
}
