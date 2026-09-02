/// <reference types="@classic-mp/types/client" />
import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IClientInternalEvents } from "../../common/events/types";
import { type IClientToServerEvents, type IServerToClientEvents } from "@shared/net/common/events/types";
import { CCMPInProcessEmitter } from "./VIMPInProcessEmitter";

type Listener = (...args: unknown[]) => void;

/**
 * Реализация `IEventsManager` поверх нативного CCMP клиента.
 *
 * Важные особенности CCMP, продиктовавшие дизайн:
 *
 * 1. У `ccmp.on(name, cb)` **нет** парного `ccmp.off`. Поэтому unsubscribe
 *    реализован через собственный реестр: на каждое имя регистрируется ровно
 *    один диспетчер в `ccmp`, который проходит по нашему `Set` подписчиков.
 *    `off` лишь удаляет колбэк из `Set`, диспетчер на стороне CCMP остаётся
 *    висеть (становится no-op).
 *
 * 2. `ccmp.emitServer(event, data)` принимает **одно** значение `data`. Наш
 *    контракт `emitServer(name, ...args)` — variadic. Чтобы не терять
 *    позиционные аргументы, всегда отправляем `args` массивом, а на приёме
 *    разворачиваем обратно. Это совпадает с тем, как сервер уже шлёт клиенту
 *    (`ccmpPlayer.emit(name, args)` в `CCMPEventsManager` на сервере).
 *
 * 3. Локальной in-process шины событий (аналог `mp.events.call`) у CCMP нет —
 *    под `emitInternal` подкладываем `CCMPInProcessEmitter`. Однако `onInternal`
 *    дополнительно подписывает handler ещё и на нативный `ccmp.on(name, ...)`,
 *    потому что геймод использует `events.onInternal` как канал для UI-ingress
 *    (см. `rock-mod-event-emitter.adapter.ts:61-66` в геймоде: `registerUI()`
 *    делегирует в `events.onInternal`). Под RageMP такого дубля не нужно,
 *    потому что `mp.events.add` естественно ловит и `mp.events.call`, и
 *    CEF-выпуски `mp.trigger`. Побочный эффект: server/system события с тем
 *    же именем тоже долетят до internal-handler'а — на практике конфликтов
 *    нет, потому что namespace'ы геймода различаются (`rm::*` server,
 *    `api:*` UI, `player:*`/`vehicle:*`/etc. internal).
 *
 * 4. `IClientEvents` (для `onRaw`/`offRaw`) — RageMP-specific глобальный
 *    тип. Под CCMP осмысленно регистрировать `ccmp.on('playerConnected', ...)`
 *    и другие билтины, но строго типизировать их через `IClientEvents` нельзя
 *    — используем `@ts-expect-error` по аналогии с серверным `CCMPEventsManager`.
 */
export class CCMPEventsManager implements IEventsManager {
  /** Реестр всех серверных/raw/generic подписчиков. */
  private readonly _externalListeners = new Map<string, Set<Listener>>();

  /** Имена, для которых уже зарегистрирован диспетчер в нативном `ccmp`. */
  private readonly _dispatched = new Set<string>();

  /** Локальная in-process шина — питает `onInternal`/`emitInternal`. */
  private readonly _internalEmitter = new CCMPInProcessEmitter();

  // -- Raw (CCMP builtin) ---------------------------------------------------

  public onRaw(events: Partial<IClientEvents>): void {
    // IClientEvents is RageMP-specific; под CCMP принимаем тот же call-shape,
    // но привязываем через свой реестр диспетчеров.
    for (const eventName of Object.keys(events)) {
      const handler = (events as Record<string, Listener>)[eventName];
      if (!handler) {
        continue;
      }
      this._registerExternal(eventName, handler);
    }
  }

  public offRaw<K extends keyof IClientEvents>(eventName: K, listener?: IClientEvents[K]): void {
    this._unregisterExternal(eventName as unknown as string, listener as unknown as Listener | undefined);
  }

  // -- Internal (in-process) ------------------------------------------------

  public onInternal(events: Partial<IClientInternalEvents>): void {
    for (const eventName of Object.keys(events) as Array<keyof IClientInternalEvents>) {
      const handler = events[eventName];
      if (!handler) {
        continue;
      }

      // 1) Локальная in-process шина — питает `emitInternal` от client-кода.
      this._internalEmitter.on(eventName as string, handler as Listener);

      // 2) UI ingress. Геймод-адаптер `registerUI()` маппит UI-events через
      //    `events.onInternal`. Под CCMP UI шлёт `window.ccmp.emitClient(name, payload)`,
      //    которое приходит на клиент через `ccmp.on(name, handler)`. Подписываем
      //    тот же handler на нативный канал через общий `_registerExternal`-реестр
      //    (он управляет single-dispatcher'ом и Array.isArray-unwrap'ом).
      this._registerExternal(eventName as string, handler as Listener);
    }
  }

  public offInternal<K extends keyof IClientInternalEvents>(eventName: K, listener?: IClientInternalEvents[K]): void {
    this._internalEmitter.off(eventName as string, listener as Listener | undefined);
    this._unregisterExternal(eventName as string, listener as Listener | undefined);
  }

  public emitInternal<K extends keyof IClientInternalEvents>(
    eventName: K,
    ...args: Parameters<IClientInternalEvents[K]>
  ): void {
    this._internalEmitter.emit(eventName as string, ...(args as unknown[]));
  }

  /**
   * Sticky-вариант `emitInternal`. Кэширует последнее значение, чтобы поздние
   * подписчики (`onInternal`) получили его сразу при подписке. Использовать
   * для one-shot lifecycle-событий (`rm::playerReady` и т.п.), где гонка между
   * "событие случилось" и "подписчик зарегистрирован" критична.
   *
   * См. `CCMPInProcessEmitter.emitSticky` для подробностей семантики.
   */
  public emitInternalSticky<K extends keyof IClientInternalEvents>(
    eventName: K,
    ...args: Parameters<IClientInternalEvents[K]>
  ): void {
    this._internalEmitter.emitSticky(eventName as string, ...(args as unknown[]));
  }

  /**
   * Очищает sticky-кэш для конкретного internal-события. Использовать на
   * disconnect/reset чтобы новые подписчики не получали устаревший local-
   * player-stub после реконнекта.
   */
  public clearInternalSticky<K extends keyof IClientInternalEvents>(eventName: K): void {
    this._internalEmitter.clearSticky(eventName as string);
  }

  // -- Server <-> Client ----------------------------------------------------

  public onServer(events: Partial<IServerToClientEvents>): void {
    for (const eventName of Object.keys(events) as Array<keyof IServerToClientEvents>) {
      const handler = events[eventName] as unknown as Listener | undefined;
      if (!handler) {
        continue;
      }

      this._registerExternal(eventName as string, handler);
    }
  }

  public offServer<K extends keyof IServerToClientEvents>(eventName: K, listener?: IServerToClientEvents[K]): void {
    this._unregisterExternal(eventName as string, listener as unknown as Listener | undefined);
  }

  public emitServer<K extends keyof IClientToServerEvents>(
    eventName: K,
    ...args: Parameters<IClientToServerEvents[K]>
  ): void {
    // Заворачиваем variadic args в массив — соответствует контракту приёма
    // на сервере (`CCMPEventsManager.onClient` разворачивает обратно).
    ccmp.emitServer(eventName as string, args as unknown[]);
  }

  // -- Generic escape hatch -------------------------------------------------

  public register(event: string, listener: (...args: unknown[]) => void): void {
    this._internalEmitter.on(event, listener);
    this._registerExternal(event, listener);
  }

  public unregister(event: string): void {
    this._internalEmitter.off(event);
    this._unregisterExternal(event);
  }

  // -- Implementation details -----------------------------------------------

  private _registerExternal(event: string, listener: Listener): void {
    let bucket = this._externalListeners.get(event);
    if (!bucket) {
      bucket = new Set();
      this._externalListeners.set(event, bucket);
    }

    bucket.add(listener);

    if (!this._dispatched.has(event)) {
      this._dispatched.add(event);
      ccmp.on(event, (payload: unknown) => {
        const handlers = this._externalListeners.get(event);
        if (!handlers || handlers.size === 0) {
          return;
        }

        // Сервер заворачивает variadic args в массив через
        // `ccmpPlayer.emit(name, args)`. Однопараметрические/нативные события
        // (билтины CCMP типа `playerConnected`) приходят как один объект —
        // их прокидываем как единственный аргумент.
        const args = Array.isArray(payload) ? payload : [payload];

        for (const handler of [...handlers]) {
          try {
            handler(...args);
          } catch (error) {
            console.error(`[CCMPEventsManager] handler "${event}" failed:`, error);
          }
        }
      });
    }
  }

  private _unregisterExternal(event: string, listener?: Listener): void {
    const bucket = this._externalListeners.get(event);
    if (!bucket) {
      return;
    }

    if (listener) {
      bucket.delete(listener);
      if (bucket.size === 0) {
        this._externalListeners.delete(event);
      }
      return;
    }

    this._externalListeners.delete(event);
    // Нативный `ccmp.on`-диспетчер остаётся висеть — у CCMP нет `off`.
    // Когда в реестре пусто, он просто ничего не делает.
  }
}
