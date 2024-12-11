import { IEventsManager } from "./events/IEventsManager";
import { IRPCManager } from "./rpc/IRPCManager";

export interface INetManager {
  get events(): IEventsManager;
  get rpc(): IRPCManager;
}
