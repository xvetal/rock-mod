import { type INetManager } from "../common/INetManager";
import { RageEventsManager } from "./events/RageEventsManager";
import { RageEventsBridge } from "./events/RageEventsBridge";
import { RageRPCManager } from "./rpc/RageRPCManager";

export class RageNetManager implements INetManager {
  private readonly _eventsManager: RageEventsManager;

  private readonly _rpcManager: RageRPCManager;

  private readonly _eventsBridge: RageEventsBridge;

  public get events(): RageEventsManager {
    return this._eventsManager;
  }

  public get rpc(): RageRPCManager {
    return this._rpcManager;
  }

  public constructor() {
    this._eventsManager = new RageEventsManager();
    this._rpcManager = new RageRPCManager();
    this._eventsBridge = new RageEventsBridge(this._eventsManager);

    this._eventsBridge.registerRawEvents();
    this._eventsBridge.registerServerEvents();
  }
}
