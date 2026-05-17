import { type IRPCManager } from "../../common/rpc/IRPCManager";
import { type IClientRPCList, type IServerRPCList } from "@shared/net/common/rpc/types";

type UIHandler = (...args: unknown[]) => unknown;

/**
 * Реализация `IRPCManager` под CCMP — частичная.
 *
 * Что реализовано:
 *  - `register` / `unregister` — ведут внутренний реестр UI-handler'ов.
 *    Это нужно, потому что геймод сразу при boot'е регистрирует UI-RPC
 *    (см. `RockModRPCRegistrarAdapter.registerUIHandler` →
 *    `network.rpc.register`). Без молчаливой регистрации DI-цикл
 *    `Application._registerRPC` бросает на первом же контроллере.
 *
 *  - `getHandler(name)` — экспонирован для будущего UI-bridge'а внутри
 *    `CCMPBrowserManager` (CEF↔client RPC), который будет диспатчить
 *    приходящие из CEF вызовы через этот реестр. Сейчас реестр —
 *    "dead storage": handler'ы зарегистрированы, но ничто их не вызывает.
 *
 * Что НЕ реализовано:
 *  - `emitServer(rpc, ...args)` — client→server RPC через нативный канал.
 *    Геймод использует **собственный** RPC поверх `net.events`
 *    (`rock-mod-rpc-caller.adapter.ts` шлёт `rpc:request`, ждёт
 *    `rpc:response` по correlationId), поэтому метод фактически не
 *    дёргается. Если кто-то всё же позовёт — бросаем, чтобы было видно
 *    в логе что нет fallback'а через native RPC.
 *
 * Известное ограничение: до реализации UI-bridge'а в `CCMPBrowserManager`
 * (`window.ccmp.emit` через CEF → диспатч в `_uiHandlers`) UI не может
 * вызвать ни одного client-side RPC. Это OK — геймод-UI всё равно не
 * запустится без полноценного browser-bridge'a (следующий milestone).
 */
export class CCMPRPCManager implements IRPCManager {
  private readonly _uiHandlers = new Map<string, UIHandler>();

  private _warnedNoBridge = false;

  public register<K extends keyof IClientRPCList>(
    rpcName: K,
    handler: (...args: Parameters<IClientRPCList[K]>) => ReturnType<IClientRPCList[K]>,
  ): void {
    this._uiHandlers.set(String(rpcName), handler as unknown as UIHandler);
    this._warnAboutBridgeOnce();
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
        `CCMPRPCManager.emitServer(${String(rpcName)}): native client→server ` +
          `RPC не реализован под CCMP. Используй net.events с собственным ` +
          `correlationId-протоколом (как делает rock-mod-rpc-caller.adapter).`,
      ),
    );
  }

  /**
   * Возвращает зарегистрированный UI-handler по имени или `undefined`.
   *
   * Зарезервировано для будущего `CCMPBrowserManager` UI-bridge'а,
   * который будет диспатчить приходящие из CEF RPC через этот реестр.
   * Внешнее использование (вне rock-mod) не предполагается.
   */
  public getHandler(name: string): UIHandler | undefined {
    return this._uiHandlers.get(name);
  }

  private _warnAboutBridgeOnce(): void {
    if (this._warnedNoBridge) {
      return;
    }
    this._warnedNoBridge = true;
    console.warn(
      "[CCMPRPCManager] register() вызван, но UI↔client bridge (CEF dispatch) " +
        "ещё не реализован в CCMPBrowserManager. Зарегистрированные UI-RPC " +
        "будут лежать в реестре, но не вызовутся пока UI-bridge не появится.",
    );
  }
}
