import { type INetManager } from "../common/INetManager";
import { type IEventsManager } from "../common/events/IEventsManager";
import { type IRPCManager } from "../common/rpc/IRPCManager";
import { RockSandboxEventsManager } from "./events/RockSandboxEventsManager";
import { RockSandboxRPCManager } from "./rpc/RockSandboxRPCManager";

export class RockSandboxNetManager implements INetManager {
  private readonly _events = new RockSandboxEventsManager();

  private readonly _rpc = new RockSandboxRPCManager();

  public get events(): IEventsManager {
    return this._events;
  }

  public get rpc(): IRPCManager {
    return this._rpc;
  }
}
