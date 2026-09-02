import { ClientInternalEventName } from "../../common/events/types";
import { type VIMPEventsManager } from "./VIMPEventsManager";

const TARGET_FPS = 60;
const TICK_INTERVAL_MS = Math.floor(1000 / TARGET_FPS);

type IntervalHandle = ReturnType<typeof setInterval>;
type SetInterval = (handler: () => void, ms: number) => IntervalHandle;
type ClearInterval = (handle: IntervalHandle) => void;
type VIMPRenderEventSource = {
  on?: (eventName: "render", callback: () => void) => void;
};

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

function getNativeRenderEventSource(): VIMPRenderEventSource | null {
  const maybeVimp = (globalThis as { vimp?: VIMPRenderEventSource }).vimp;
  return typeof maybeVimp?.on === "function" ? maybeVimp : null;
}

/**
 * Per-frame событие `rm::render` под VIMP.
 *
 * У RageMP клиента есть нативный raw-event `render`, на котором завязаны
 * декораторы `@Render` и `@Interval` в геймоде. Современный VIMP runtime
 * эмитит coalesced native `vimp.on("render")` из game loop; используем его,
 * чтобы render не зависел от JS timer pump и не копился в очереди.
 *
 * `setInterval` остаётся только fallback'ом для старых runtime.
 */
export class VIMPRenderTicker {
  private _emitter: VIMPEventsManager | null = null;

  private _handle: IntervalHandle | null = null;

  private _nativeRenderRegistered = false;

  public start(emitter: VIMPEventsManager): void {
    this._emitter = emitter;

    const nativeRender = getNativeRenderEventSource();
    if (nativeRender) {
      if (!this._nativeRenderRegistered) {
        this._nativeRenderRegistered = true;
        nativeRender.on?.("render", () => {
          this._emitter?.emitInternal(ClientInternalEventName.Render);
        });
      }
      return;
    }

    if (this._handle !== null) return;

    const setIntervalFn = getSetInterval();
    if (!setIntervalFn) {
      console.warn(
        '[VIMPRenderTicker] native `vimp.on("render")` and `setInterval` are unavailable. ' +
          "`rm::render` will not be emitted.",
      );
      return;
    }

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
