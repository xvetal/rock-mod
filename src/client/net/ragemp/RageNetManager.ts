import { type INetManager } from "../common/INetManager";
import { RageEventsManager } from "./events/RageEventsManager";
import { RageEventsBridge } from "./events/RageEventsBridge";
import { RageRPCManager } from "./rpc/RageRPCManager";
import { type IDataHandler } from "@RockMod/client/net/common/dataHandler/IDataHandler";
import { RageDataHandler } from "@RockMod/client/net/ragemp/dataHandler/RageDataHandler";
import { type IEntityPoolRouter } from "@RockMod/client/entities";
import { RageEntityPoolRouter } from "@RockMod/client/entities/ragemp/router/RageEntityPoolRouter";

export class RageNetManager implements INetManager {
  private readonly _eventsManager: RageEventsManager;

  private readonly _rpcManager: RageRPCManager;

  private readonly _eventsBridge: RageEventsBridge;

  private readonly _dataHandler: IDataHandler;

  private readonly _entityPoolRouter: IEntityPoolRouter;

  public get events(): RageEventsManager {
    return this._eventsManager;
  }

  public get rpc(): RageRPCManager {
    return this._rpcManager;
  }

  public get dataHandler(): IDataHandler {
    return this._dataHandler;
  }

  public constructor() {
    this._entityPoolRouter = new RageEntityPoolRouter();
    this._eventsManager = new RageEventsManager();
    this._rpcManager = new RageRPCManager();
    this._eventsBridge = new RageEventsBridge(this._eventsManager, this._entityPoolRouter);
    this._dataHandler = new RageDataHandler(this._entityPoolRouter);

    this._eventsBridge.registerRawEvents();
    this._eventsBridge.registerServerEvents();
  }
}
