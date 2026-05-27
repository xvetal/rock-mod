type Listener = (...args: unknown[]) => void;

type CCMPCallbackProfiler = {
  __ccmp_profileCallback?: (label: string, callback: Listener, args: unknown[], thresholdMs?: number) => void;
  __ccmp_registerCallbackProfile?: (label: string, callback: Listener, site?: string) => void;
};

const RENDER_EVENT = "rm::render";
const RENDER_LISTENER_WARN_THRESHOLD_MS = 10;

function getCCMPCallbackProfiler(): CCMPCallbackProfiler {
  return globalThis as CCMPCallbackProfiler;
}

function profileLabel(event: string): string {
  return `rm internal "${event}"`;
}

function captureRegistrationSite(): string {
  const stack = String(new Error().stack ?? "");
  const lines = stack
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (
      line === "Error" ||
      line.includes("captureRegistrationSite") ||
      line.includes("CCMPInProcessEmitter") ||
      line.includes("getCCMPCallbackProfiler") ||
      line.includes("profileLabel")
    ) {
      continue;
    }

    return line.replace(/^at\s+/, "");
  }

  return "<unknown>";
}

/**
 * Тонкий внутренний event bus.
 *
 * RageMP даёт `mp.events.call(name, ...args)` для локальной шины поверх своего
 * движка событий. У CCMP нативной внутренней шины нет — её роль выполняет этот
 * класс. Используется только из `CCMPEventsManager` для `onInternal` /
 * `offInternal` / `emitInternal` и из `CCMPEventsBridge` для синтезированных
 * `rm::*` событий.
 *
 * Поддерживает "sticky" events (см. `emitSticky`) для one-shot lifecycle-
 * сигналов (например `rm::playerReady`), которые могут эмититься до того,
 * как поздние подписчики из DI-цепочки геймода успели зарегистрироваться.
 * Sticky-кэш гарантирует, что любой `on()`-вызов после `emitSticky` получит
 * последнее значение synchronously.
 */
export class CCMPInProcessEmitter {
  private readonly _listeners = new Map<string, Set<Listener>>();

  /** Кэш аргументов для sticky-events. См. `emitSticky` / `on`. */
  private readonly _stickyCache = new Map<string, unknown[]>();

  public on(event: string, listener: Listener): void {
    let bucket = this._listeners.get(event);
    if (!bucket) {
      bucket = new Set();
      this._listeners.set(event, bucket);
    }

    bucket.add(listener);
    getCCMPCallbackProfiler().__ccmp_registerCallbackProfile?.(
      profileLabel(event),
      listener,
      captureRegistrationSite(),
    );

    // Sticky replay: если событие уже было эмитнуто как sticky — сразу
    // воспроизводим последнее значение новому подписчику. Это решает гонку
    // "CCMPEventsBridge эмитит rm::playerReady до того, как геймод-адаптер
    // успел подписаться" — типично для async DI-bootstrap'а.
    const sticky = this._stickyCache.get(event);
    if (sticky !== undefined) {
      try {
        this._callListener(event, listener, sticky);
      } catch (error) {
        console.error(`[CCMPInProcessEmitter] sticky replay "${event}" failed for new subscriber:`, error);
      }
    }
  }

  public off(event: string, listener?: Listener): void {
    const bucket = this._listeners.get(event);
    if (!bucket) {
      return;
    }

    if (listener) {
      bucket.delete(listener);
      if (bucket.size === 0) {
        this._listeners.delete(event);
      }
      return;
    }

    this._listeners.delete(event);
  }

  public emit(event: string, ...args: unknown[]): void {
    const bucket = this._listeners.get(event);
    if (!bucket || bucket.size === 0) {
      return;
    }

    // Копия на случай, если хендлер изменит реестр во время итерации.
    for (const listener of [...bucket]) {
      try {
        this._callListener(event, listener, args);
      } catch (error) {
        console.error(`[CCMPInProcessEmitter] listener "${event}" failed:`, error);
      }
    }
  }

  /**
   * Как `emit`, но дополнительно кэширует args, чтобы любой будущий
   * `on(event, listener)` сразу получил воспроизведение последнего значения.
   *
   * Использовать только для one-shot lifecycle-событий (`rm::playerReady` и
   * т.п.), где "позднее" подписавшийся обработчик всё равно должен получить
   * сигнал. Для регулярных событий (`rm::playerConnected` на каждого нового
   * игрока) sticky-кэш приведёт к нежелательному поведению — используйте
   * обычный `emit`.
   *
   * Кэш переписывается на каждый последующий вызов с тем же event'ом, так
   * что подписчики получат последнее значение, не цепочку историй.
   */
  public emitSticky(event: string, ...args: unknown[]): void {
    this._stickyCache.set(event, args);
    this.emit(event, ...args);
  }

  /**
   * Удаляет sticky-кэш для события. Полезно на disconnect/reset, чтобы
   * новые подписчики не получили устаревший local-player-stub.
   */
  public clearSticky(event: string): void {
    this._stickyCache.delete(event);
  }

  private _callListener(event: string, listener: Listener, args: unknown[]): void {
    const profiler = getCCMPCallbackProfiler().__ccmp_profileCallback;
    if (profiler) {
      profiler(
        profileLabel(event),
        listener,
        args,
        event === RENDER_EVENT ? RENDER_LISTENER_WARN_THRESHOLD_MS : undefined,
      );
      return;
    }

    listener(...args);
  }
}
