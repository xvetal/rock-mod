import { ClientInternalEventName } from "../../common/events/types";
import { type CCMPEventsManager } from "./CCMPEventsManager";

const TARGET_FPS = 60;
const TICK_INTERVAL_MS = Math.floor(1000 / TARGET_FPS);

type IntervalHandle = ReturnType<typeof setInterval>;
type SetInterval = (handler: () => void, ms: number) => IntervalHandle;
type ClearInterval = (handle: IntervalHandle) => void;

/**
 * Достаём `setInterval` из global scope не вызывая ReferenceError.
 *
 * Под bare deno_core просто `setInterval` бросает `ReferenceError: setInterval
 * is not defined` ещё до того как мы можем проверить `typeof`. `globalThis`
 * безопасен — обращение к несуществующему свойству даёт `undefined`.
 */
function getSetInterval(): SetInterval | null {
  const fn = (globalThis as { setInterval?: SetInterval }).setInterval;
  return typeof fn === "function" ? fn : null;
}

function getClearInterval(): ClearInterval | null {
  const fn = (globalThis as { clearInterval?: ClearInterval }).clearInterval;
  return typeof fn === "function" ? fn : null;
}

/**
 * Имитация per-frame события `rm::render` под CCMP.
 *
 * У RageMP клиента есть нативный raw-event `render`, на котором завязаны
 * декораторы `@Render` и `@Interval` в геймоде. У CCMP нет ни нативного
 * per-frame callback'а, ни даже базовых таймеров: bare `deno_core` не
 * подключает `deno_web` extension, который регистрирует `setInterval`/
 * `setTimeout`. Поэтому пытаемся использовать `setInterval`, если он есть
 * в runtime, иначе — no-op + одноразовое предупреждение.
 *
 * Следствие no-op'а: декораторы `@Render`/`@Interval` в геймоде не сработают
 * под CCMP. Это известное ограничение из плана интеграции; модули,
 * полагающиеся на per-frame тик, деградируют тихо.
 *
 * Долгосрочный фикс — добавить per-frame hook в CCMP-клиенте (Rust):
 * `emit_event("render", "")` из game loop. Тогда этот класс заменяется
 * подпиской на `ccmp.on("render", ...)`.
 */
export class CCMPRenderTicker {
  private _emitter: CCMPEventsManager | null = null;

  private _handle: IntervalHandle | null = null;

  public start(emitter: CCMPEventsManager): void {
    if (this._handle !== null) {
      return;
    }

    const setIntervalFn = getSetInterval();
    if (!setIntervalFn) {
      console.warn(
        "[CCMPRenderTicker] `setInterval` отсутствует в текущем JS runtime " +
          "(bare deno_core без deno_web extension). `rm::render` эмититься " +
          "не будет — декораторы @Render и @Interval в геймоде не сработают.",
      );
      return;
    }

    this._emitter = emitter;
    this._handle = setIntervalFn(() => {
      this._emitter?.emitInternal(ClientInternalEventName.Render);
    }, TICK_INTERVAL_MS);
  }

  public stop(): void {
    if (this._handle !== null) {
      const clearIntervalFn = getClearInterval();
      clearIntervalFn?.(this._handle);
      this._handle = null;
    }
    this._emitter = null;
  }
}
