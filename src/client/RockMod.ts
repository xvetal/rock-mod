import { type INetManager } from "./net/common/INetManager";
import {
  type IBlipsManager,
  type ICameraManager,
  type IColshapesManager,
  type IMarkersManager,
  type IObjectsManager,
  type IPedsManager,
  type IPlayersManager,
  type IVehiclesManager,
} from "./entities";
import { type IUtilsManager } from "./utils";
import { type IManagersFactory } from "./factories/common/IManagersFactory";
import {
  type IBrowserManager,
  type IControlsManager,
  type IGameplayManager,
  type IGraphicsManager,
  type IKeysManager,
  type ILocalPlayerManager,
  type INametagsManager,
  type INativeCallerManager,
  type IPathfindManager,
  type IStorageManager,
  type IStreamingManager,
  type IUiManager,
  type IZoneManager,
} from "@RockMod/client/game";
import { type IConsoleManager } from "@RockMod/client/console";

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

  private readonly _browser: IBrowserManager;

  private readonly _cameras: ICameraManager;

  private readonly _storage: IStorageManager;

  private readonly _graphics: IGraphicsManager;

  private readonly _native: INativeCallerManager;

  private readonly _streaming: IStreamingManager;

  private readonly _localPlayer: ILocalPlayerManager;

  private readonly _controls: IControlsManager;

  private readonly _keys: IKeysManager;

  private readonly _gameplay: IGameplayManager;

  private readonly _ui: IUiManager;

  private readonly _nametags: INametagsManager;

  private readonly _pathfind: IPathfindManager;

  private readonly _zone: IZoneManager;

  private readonly _console: IConsoleManager;

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

  public get browser(): IBrowserManager {
    return this._browser;
  }

  public get cameras(): ICameraManager {
    return this._cameras;
  }

  public get storage(): IStorageManager {
    return this._storage;
  }

  public get graphics(): IGraphicsManager {
    return this._graphics;
  }

  public get native(): INativeCallerManager {
    return this._native;
  }

  public get streaming(): IStreamingManager {
    return this._streaming;
  }

  public get localPlayer(): ILocalPlayerManager {
    return this._localPlayer;
  }

  public get controls(): IControlsManager {
    return this._controls;
  }

  public get keys(): IKeysManager {
    return this._keys;
  }

  public get gameplay(): IGameplayManager {
    return this._gameplay;
  }

  public get ui(): IUiManager {
    return this._ui;
  }

  public get nametags(): INametagsManager {
    return this._nametags;
  }

  public get pathfind(): IPathfindManager {
    return this._pathfind;
  }

  public get zone(): IZoneManager {
    return this._zone;
  }

  public get console(): IConsoleManager {
    return this._console;
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
    this._browser = managersFactory.createBrowserManager();
    this._cameras = managersFactory.createCameraManager();
    this._storage = managersFactory.createStorageManager();
    this._graphics = managersFactory.createGraphicsManager();
    this._native = managersFactory.createNativeManager();
    this._streaming = managersFactory.createStreamingManager();
    this._localPlayer = managersFactory.createLocalPlayerManager();
    this._controls = managersFactory.createControlsManager();
    this._keys = managersFactory.createKeysManager();
    this._gameplay = managersFactory.createGameplayManager();
    this._ui = managersFactory.createUiManager();
    this._nametags = managersFactory.createNametagsManager();
    this._pathfind = managersFactory.createPathfindManager();
    this._zone = managersFactory.createZoneManager();
    this._console = managersFactory.createConsoleManager();
  }
}
