import { type IChatManager } from "../../common/chat/IChatManager";

/**
 * No-op реализация `IChatManager` под CCMP.
 *
 * У RageMP клиента есть `mp.gui.chat.activate(state)` (разрешает игроку
 * печатать в чат по T) и `mp.gui.chat.show(state)` (видимость чат-окна).
 * У CCMP **нет JS API для управления чатом** — только встроенное событие
 * `chatMessage` на приём входящих сообщений и `ccmp.notify(text)` для HUD-
 * уведомлений (не относится к чату).
 *
 * Бросать нельзя: геймод-консьюмер `RockModChatAdapter.activate` вызывается
 * из `ChatService.onModuleInit` — исключение поднимет весь bootstrap DI.
 * Поэтому игнорируем + один раз пишем warn, чтобы было видно в логах что
 * фича недоступна.
 *
 * Следствие: под CCMP программное управление чатом не работает. Чат-UI
 * (если он есть) рисуется самим CCMP-клиентом на Rust-стороне и реагирует
 * на свои клавиши. Когда (если) CCMP добавит JS-API для чата — заменим.
 */
export class CCMPChatManager implements IChatManager {
  private _warned = false;

  public activate(state: boolean): void {
    this._warnOnce("activate", state);
  }

  public show(state: boolean): void {
    this._warnOnce("show", state);
  }

  private _warnOnce(method: "activate" | "show", state: boolean): void {
    if (this._warned) {
      return;
    }
    this._warned = true;
    console.warn(
      `[CCMPChatManager] ${method}(${String(state)}) вызван, но CCMP не ` +
        `предоставляет JS API для управления чатом. Дальнейшие вызовы ` +
        `activate/show будут проигнорированы молча.`,
    );
  }
}
