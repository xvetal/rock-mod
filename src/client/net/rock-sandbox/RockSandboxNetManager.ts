import { type INetManager } from "../common/INetManager";
import { type IEventsManager } from "../common/events/IEventsManager";
import { type IRPCManager } from "../common/rpc/IRPCManager";
import { type IDataHandler } from "../common/dataHandler/IDataHandler";
import { RockSandboxEventsManager } from "./events/RockSandboxEventsManager";
import { RockSandboxRPCManager } from "./rpc/RockSandboxRPCManager";
import { RockSandboxDataHandler } from "./dataHandler/RockSandboxDataHandler";

export class RockSandboxNetManager implements INetManager {
  private readonly _events = new RockSandboxEventsManager();

  private readonly _rpc = new RockSandboxRPCManager();

  private readonly _dataHandler = new RockSandboxDataHandler();

  public get events(): IEventsManager {
    return this._events;
  }

  public get rpc(): IRPCManager {
    return this._rpc;
  }

  public get dataHandler(): IDataHandler {
    return this._dataHandler;
  }
}
