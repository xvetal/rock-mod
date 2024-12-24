import { type IEventsManager } from "./events/IEventsManager";
import { type IRPCManager } from "./rpc/IRPCManager";

export interface INetManager {
  get events(): IEventsManager;
  get rpc(): IRPCManager;
}
