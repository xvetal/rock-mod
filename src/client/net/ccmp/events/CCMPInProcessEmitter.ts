type Listener = (...args: unknown[]) => void;

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

    // Sticky replay: если событие уже было эмитнуто как sticky — сразу
    // воспроизводим последнее значение новому подписчику. Это решает гонку
    // "CCMPEventsBridge эмитит rm::playerReady до того, как геймод-адаптер
    // успел подписаться" — типично для async DI-bootstrap'а.
    const sticky = this._stickyCache.get(event);
    if (sticky !== undefined) {
      try {
        listener(...sticky);
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
        listener(...args);
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
}
