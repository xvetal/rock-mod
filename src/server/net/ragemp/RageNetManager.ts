import { INetManager } from "../common/INetManager";
import { RageEventsManager } from "./events/RageEventsManager";
import { RageRPCManager } from "./rpc/RageRPCManager";

export class RageNetManager implements INetManager {
  private readonly _eventsManager: RageEventsManager;

  private readonly _rpcManager: RageRPCManager;

  public get events(): RageEventsManager {
    return this._eventsManager;
  }

  public get rpc(): RageRPCManager {
    return this._rpcManager;
  }

  public constructor() {
    this._eventsManager = new RageEventsManager();
    this._rpcManager = new RageRPCManager();
  }
}
