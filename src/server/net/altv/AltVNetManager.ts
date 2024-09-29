import { INetManager } from "../common/INetManager";
import { AltVEventsManager } from "./events/AltVEventsManager";
import { AltVRPCManager } from "./rpc/AltVRPCManager";

export class AltVNetManager implements INetManager {
  private readonly _eventsManager: AltVEventsManager;

  private readonly _rpcManager: AltVRPCManager;

  public get events(): AltVEventsManager {
    return this._eventsManager;
  }

  public get rpc(): AltVRPCManager {
    return this._rpcManager;
  }

  public constructor() {
    this._eventsManager = new AltVEventsManager();
    this._rpcManager = new AltVRPCManager();
  }
}
