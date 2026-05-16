import { type IRPCManager } from "../../common/rpc/IRPCManager";
import { type IClientRPCList, type IServerRPCList } from "@shared/net/common/rpc/types";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

/**
 * Заглушка `IRPCManager` под CCMP.
 *
 * Зачем заглушка, а не реализация:
 *
 * Геймод реализует server↔client RPC поверх `net.events` (см.
 * `rock-mod-rpc-caller.adapter.ts` / `rock-mod-rpc-registrar.adapter.ts` —
 * собственный протокол с `rpc:request`/`rpc:response` и correlationId через
 * обычные события). Поэтому для запуска геймода под CCMP методы этого менеджера
 * не дёргаются.
 *
 * Этот RPC-слой нужен только для UI↔client взаимодействия (см.
 * `RockModRPCRegistrarAdapter.registerUIHandler`), а UI у нас не запустится до
 * реализации `CCMPBrowserManager` — это следующий milestone. Тогда же сюда
 * приедет реализация поверх событийного протокола с correlationId.
 *
 * Важно: бросаем только при **вызове**, не в конструкторе — иначе DI-сборка
 * геймода упадёт.
 */
export class CCMPRPCManager implements IRPCManager {
  public register<K extends keyof IClientRPCList>(
    rpcName: K,
    handler: (...args: Parameters<IClientRPCList[K]>) => ReturnType<IClientRPCList[K]>,
  ): void {
    void handler;
    notImplemented(`CCMPRPCManager.register(${String(rpcName)})`);
  }

  public unregister<K extends keyof IClientRPCList>(rpcName: K): void {
    notImplemented(`CCMPRPCManager.unregister(${String(rpcName)})`);
  }

  public emitServer<K extends keyof IServerRPCList>(
    rpcName: K,
    ...args: Parameters<IServerRPCList[K]>
  ): Promise<ReturnType<IServerRPCList[K]>> {
    void args;
    return notImplemented(`CCMPRPCManager.emitServer(${String(rpcName)})`);
  }
}
