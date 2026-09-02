import { type IRPCManager } from "../../common/rpc/IRPCManager";
import { type IClientRPCList, type IServerRPCList } from "@shared/net/common/rpc/types";

type UIHandler = (...args: unknown[]) => unknown;

/**
 * VIMP implementation of the rock-mod client RPC registry.
 *
 * The current gamemod routes UI RPC through the event bridge:
 * `window.vimp.emitClient(...)` -> `vimp.on(...)` -> NetworkRPCService.
 * `register` therefore keeps the same public contract as RageMP's
 * `mp.events.addProc` without emitting noisy startup warnings.
 *
 * Native client->server RPC is still intentionally unsupported here. The
 * gamemod uses its correlation-id protocol over `net.events` for that path.
 */
export class VIMPRPCManager implements IRPCManager {
  private readonly _uiHandlers = new Map<string, UIHandler>();

  public register<K extends keyof IClientRPCList>(
    rpcName: K,
    handler: (...args: Parameters<IClientRPCList[K]>) => ReturnType<IClientRPCList[K]>,
  ): void {
    this._uiHandlers.set(String(rpcName), handler as unknown as UIHandler);
  }

  public unregister<K extends keyof IClientRPCList>(rpcName: K): void {
    this._uiHandlers.delete(String(rpcName));
  }

  public emitServer<K extends keyof IServerRPCList>(
    rpcName: K,
    ...args: Parameters<IServerRPCList[K]>
  ): Promise<ReturnType<IServerRPCList[K]>> {
    void args;
    return Promise.reject(
      new Error(
        `VIMPRPCManager.emitServer(${String(rpcName)}): native client→server ` +
          `RPC не реализован под VIMP. Используй net.events с собственным ` +
          `correlationId-протоколом (как делает rock-mod-rpc-caller.adapter).`,
      ),
    );
  }

  public getHandler(name: string): UIHandler | undefined {
    return this._uiHandlers.get(name);
  }
}
