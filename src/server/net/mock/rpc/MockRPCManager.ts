import { IRPCManager } from "../../common/rpc/IRPCManager";
import { IPlayer } from "../../../entities/common/player/IPlayer";
import { MockPlayer } from "../../../entities/mock/player/MockPlayer";
import { IClientRPCList, IServerRPCList } from "@shared/net/common/rpc/types";

export interface IMockServerRPC extends IServerRPCList {}

export interface IMockClientRPC extends IClientRPCList {}

export class MockRPCManager implements IRPCManager {
  private readonly _handlers: Map<string, (player: MockPlayer, ...args: unknown[]) => unknown> = new Map();

  public register<K extends keyof IMockServerRPC>(
    rpcName: K,
    handler: (player: MockPlayer, ...args: Parameters<IMockServerRPC[K]>) => ReturnType<IMockServerRPC[K]>,
  ): void {
    this._handlers.set(rpcName, handler as (player: MockPlayer, ...args: unknown[]) => unknown);
  }

  public unregister<K extends keyof IMockServerRPC>(rpcName: K): void {
    this._handlers.delete(rpcName);
  }

  public emitClient<K extends keyof IMockClientRPC>(
    player: IPlayer,
    rpcName: K,
    ...args: Parameters<IMockClientRPC[K]>
  ): Promise<ReturnType<IMockClientRPC[K]>> {
    const handler = this._handlers.get(rpcName);
    if (handler) {
      try {
        const result = handler(player as MockPlayer, ...args);
        return Promise.resolve(result as ReturnType<IMockClientRPC[K]>);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.resolve(null as ReturnType<IMockClientRPC[K]>);
  }
}
