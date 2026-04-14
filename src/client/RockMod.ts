import { type INetManager } from "./net/common/INetManager";
import {
  type IBlipsManager,
  type ICameraManager,
  type IColshapesManager,
  type IMarkersManager,
  type IObjectsManager,
  type IPedsManager,
  type IPlayersManager,
  type IVehicleNativeManager,
  type IVehiclesManager,
} from "./entities";
import { type IUtilsManager } from "./utils";
import { type IManagersFactory } from "./factories/common/IManagersFactory";
import { type IBrowserManager, type IStorageManager } from "@RockMod/client/game";

type MultiplayerType = "RageMP" | "AltV" | "Mock";

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
      throw new Error("RockMod is not created");
    }

    return this._instance;
  }

  private static async _initManagersFactory(options: RockModOptions): Promise<IManagersFactory> {
    const { multiplayer } = options;

    switch (multiplayer) {
      case "RageMP": {
        const { RageManagersFactory } = await import("./factories/ragemp/RageManagersFactory");
        return new RageManagersFactory();
      }
      case "AltV":
      case "Mock": {
        throw new Error("This multiplayer type is not implemented yet on client side");
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

  private readonly _vehicleNative: IVehicleNativeManager;

  private readonly _browser: IBrowserManager;

  private readonly _cameras: ICameraManager;

  private readonly _storage: IStorageManager;

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

  public get vehicleNative(): IVehicleNativeManager {
    return this._vehicleNative;
  }

  public get browser(): IBrowserManager {
    return this._browser;
  }

  public get cameras(): ICameraManager {
    return this._cameras;
  }

  public get storage(): IStorageManager {
    return this._storage;
  }

  protected constructor(managersFactory: IManagersFactory) {
    this._net = managersFactory.createNetManager();
    this._blips = managersFactory.createBlipsManager();
    this._colshapes = managersFactory.createColshapesManager();
    this._markers = managersFactory.createMarkersManager();
    this._objects = managersFactory.createObjectsManager();
    this._peds = managersFactory.createPedsManager();
    this._players = managersFactory.createPlayersManager();
    this._utils = managersFactory.createUtilsManager();
    this._vehicles = managersFactory.createVehiclesManager();
    this._vehicleNative = managersFactory.createVehicleNativeManager();
    this._browser = managersFactory.createBrowserManager();
    this._cameras = managersFactory.createCameraManager();
    this._storage = managersFactory.createStorageManager();
  }
}
