import { type INetManager } from "../common/INetManager";
import { CCMPEventsManager } from "./events/CCMPEventsManager";
import { CCMPRPCManager } from "./rpc/CCMPRPCManager";

export class CCMPNetManager implements INetManager {
  private readonly _eventsManager: CCMPEventsManager;

  private readonly _rpcManager: CCMPRPCManager;

  public get events(): CCMPEventsManager {
    return this._eventsManager;
  }

  public get rpc(): CCMPRPCManager {
    return this._rpcManager;
  }

  public constructor() {
    this._eventsManager = new CCMPEventsManager();
    this._rpcManager = new CCMPRPCManager();
  }
}
