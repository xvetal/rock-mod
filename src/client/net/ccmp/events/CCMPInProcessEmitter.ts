type Listener = (...args: unknown[]) => void;

/**
 * Тонкий внутренний event bus.
 *
 * RageMP даёт `mp.events.call(name, ...args)` для локальной шины поверх своего
 * движка событий. У CCMP нативной внутренней шины нет — её роль выполняет этот
 * класс. Используется только из `CCMPEventsManager` для `onInternal` /
 * `offInternal` / `emitInternal` и из `CCMPEventsBridge` для синтезированных
 * `rm::*` событий.
 */
export class CCMPInProcessEmitter {
  private readonly _listeners = new Map<string, Set<Listener>>();

  public on(event: string, listener: Listener): void {
    let bucket = this._listeners.get(event);
    if (!bucket) {
      bucket = new Set();
      this._listeners.set(event, bucket);
    }

    bucket.add(listener);
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
}
