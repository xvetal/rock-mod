import { INetManager } from "../common/INetManager";
import { MockEventsManager } from "./events/MockEventsManager";
import { MockRPCManager } from "./rpc/MockRPCManager";

export class MockNetManager implements INetManager {
  private readonly _eventsManager: MockEventsManager;

  private readonly _rpcManager: MockRPCManager;

  public get events(): MockEventsManager {
    return this._eventsManager;
  }

  public get rpc(): MockRPCManager {
    return this._rpcManager;
  }

  public constructor() {
    this._eventsManager = new MockEventsManager();
    this._rpcManager = new MockRPCManager();
  }
}
