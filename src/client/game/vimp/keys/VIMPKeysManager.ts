/// <reference types="@vimp-mp/types/client" />

import { type IKeysManager } from "../../common/keys/IKeysManager";

type KeyHandler = () => void;

interface KeyBinding {
  readonly down: Set<KeyHandler>;
  readonly up: Set<KeyHandler>;
}

/**
 * Реализация `IKeysManager` поверх нативных VIMP-событий `keyDown`/`keyUp`.
 *
 * Contract (mirrors RageMP `mp.keys.bind`, see `KeysMp.bind` in the RageMP typings):
 *  - `keyHold = true`  → the handler fires on **press** (`keyDown`).
 *  - `keyHold = false` → the handler fires on **release** (`keyUp`).
 *    Consumers bind `true` for press and `false` for release; that is what
 *    RAGE does, and VIMP has to answer the same way, otherwise every
 *    hold-to-act interaction starts on release and can never be cancelled.
 *
 * Архитектура:
 *  - Делаем **одну** глобальную подписку на `vimp.on('keyDown')` и одну
 *    на `keyUp` в конструкторе. Дальше сами роутим по `key`-коду через
 *    `Map<key, { down: Set, up: Set }>`. Это намного эффективнее, чем
 *    регистрировать новый `vimp.on` на каждый `bind`, и убирает проблему
 *    отсутствующего у VIMP `vimp.off` (наш dispatcher остаётся в силе,
 *    меняется только содержимое внутреннего реестра).
 *  - Параллельно ведём `_pressedKeys: Set<number>` — текущее состояние,
 *    чтобы `isDown`/`isUp` отвечали синхронно (у VIMP нет API запроса
 *    состояния клавиши).
 *
 * Auto-repeat: если VIMP-клиент эмитит `keyDown` повторно при удержании
 * (как WM_KEYDOWN auto-repeat), то и наши `down`-handler'ы будут срабатывать
 * повторно — это зеркало RageMP-поведения. Не маскируем намеренно: gamemod-
 * консьюмеры писались под такую семантику.
 *
 * Snapshot при диспатче (`[...binding.down]`) защищает от модификации Set
 * из handler'а — `bind`/`unbind` внутри callback'а не ломают текущую итерацию.
 */
export class VIMPKeysManager implements IKeysManager {
  private readonly _pressedKeys = new Set<number>();

  private readonly _bindings = new Map<number, KeyBinding>();

  public constructor() {
    vimp.on("keyDown", (key: number) => {
      this._pressedKeys.add(key);
      this._dispatch(key, "down");
    });

    vimp.on("keyUp", (key: number) => {
      this._pressedKeys.delete(key);
      this._dispatch(key, "up");
    });
  }

  public isDown(key: number): boolean {
    return this._pressedKeys.has(key);
  }

  public isUp(key: number): boolean {
    return !this._pressedKeys.has(key);
  }

  public bind(key: number, keyHold: boolean, handler: KeyHandler): void {
    let binding = this._bindings.get(key);
    if (!binding) {
      binding = { down: new Set(), up: new Set() };
      this._bindings.set(key, binding);
    }
    (keyHold ? binding.down : binding.up).add(handler);
  }

  public unbind(key: number, keyHold: boolean, handler?: KeyHandler): void {
    const binding = this._bindings.get(key);
    if (!binding) {
      return;
    }

    const set = keyHold ? binding.down : binding.up;
    if (handler === undefined) {
      // RageMP-семантика: без handler — удаляем все подписки на (key, keyHold).
      set.clear();
    } else {
      set.delete(handler);
    }

    if (binding.down.size === 0 && binding.up.size === 0) {
      this._bindings.delete(key);
    }
  }

  private _dispatch(key: number, phase: "down" | "up"): void {
    const binding = this._bindings.get(key);
    if (!binding) {
      return;
    }

    const handlers = phase === "down" ? binding.down : binding.up;
    if (handlers.size === 0) {
      return;
    }

    // Snapshot: handler может вызвать bind/unbind, мы не должны ломать
    // итерацию по Set.
    for (const handler of [...handlers]) {
      try {
        handler();
      } catch (error) {
        console.error(`[VIMPKeysManager] ${phase}-handler for key ${key} threw:`, error);
      }
    }
  }
}
