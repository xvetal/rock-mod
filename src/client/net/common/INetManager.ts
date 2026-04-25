import { type IEventsManager } from "./events/IEventsManager";
import { type IRPCManager } from "./rpc/IRPCManager";
import { type IDataHandler } from "@RockMod/client/net/common/dataHandler/IDataHandler";

export interface INetManager {
  get events(): IEventsManager;
  get rpc(): IRPCManager;
  get dataHandler(): IDataHandler;
}
