import { type INetManager } from "../common/INetManager";
import { CCMPEventsManager } from "./events/CCMPEventsManager";
import { CCMPRPCManager } from "./rpc/CCMPRPCManager";

/**
 * Имя cooperation-события для синтеза `rm::playerReady` на клиенте.
 *
 * Клиент шлёт это сразу после `connectionStateChanged.connected = true`;
 * сервер отвечает тому же игроку этим же именем с `{ remoteId }`. Клиентский
 * `CCMPEventsBridge` ловит ответ и эмитит `rm::playerReady`.
 */
const CLIENT_READY_EVENT = "rm::clientReady";

/**
 * Имя приватного события для зеркалирования клиентских `console.*` вызовов
 * в серверный stdout. Реализация клиента — `CCMPConsoleForwarder`.
 */
const CLIENT_LOG_EVENT = "rm::clientLog";

interface CcmpPlayerLike {
  readonly id: number;
}

type ClientLogLevel = "log" | "info" | "warn" | "error" | "debug";

interface ClientLogPayload {
  level: ClientLogLevel;
  args: unknown[];
}

interface SerializedError {
  __error: true;
  name?: string;
  message?: string;
  stack?: string;
  toString?: string;
}

interface SerializedToString {
  __toString: string;
  __raw?: unknown;
}

function isSerializedError(value: unknown): value is SerializedError {
  return typeof value === "object" && value !== null && (value as { __error?: unknown }).__error === true;
}

function isSerializedToString(value: unknown): value is SerializedToString {
  return (
    typeof value === "object" && value !== null && typeof (value as { __toString?: unknown }).__toString === "string"
  );
}

function rehydrateArg(value: unknown): unknown {
  if (isSerializedError(value)) {
    // Приоритет: stack -> name+message -> toString-репрезентация.
    if (value.stack) {
      return value.stack;
    }
    if (value.name && value.message) {
      return `${value.name}: ${value.message}`;
    }
    if (value.message) {
      return value.message;
    }
    if (value.toString) {
      return value.toString;
    }
    return "<unknown error>";
  }

  if (isSerializedToString(value)) {
    return value.__toString;
  }

  return value;
}

function pickConsoleSink(level: ClientLogLevel): (...args: unknown[]) => void {
  switch (level) {
    case "error":
      return console.error.bind(console);
    case "warn":
      return console.warn.bind(console);
    case "info":
      return console.info ? console.info.bind(console) : console.log.bind(console);
    case "debug":
      return console.debug ? console.debug.bind(console) : console.log.bind(console);
    case "log":
    default:
      return console.log.bind(console);
  }
}

export class CCMPNetManager implements INetManager {
  private readonly _eventsManager: CCMPEventsManager;

  private readonly _rpcManager: CCMPRPCManager;

  public get events(): CCMPEventsManager {
    return this._eventsManager;
  }

  public get rpc(): CCMPRPCManager {
    return this._rpcManager;
  }

  public constructor() {
    this._eventsManager = new CCMPEventsManager();
    this._rpcManager = new CCMPRPCManager();

    this._registerClientReadyCooperation();
    this._registerClientLogForwarder();

    // Маркер успешной загрузки актуального rock-mod на серверной стороне.
    // Если эта строка не появилась в stdout при старте ccmp-server.exe —
    // значит сервер всё ещё держит в памяти старую сборку rock-mod (не
    // забыт перезапуск процесса).
    console.log("[rock-mod] CCMP server net manager initialized");
  }

  private _registerClientReadyCooperation(): void {
    // Регистрируем напрямую через `ccmp.on` (а не через events.onClient),
    // потому что событие не входит в `IClientToServerEvents` — это
    // приватный rock-mod протокол.
    ccmp.on(CLIENT_READY_EVENT, (player: CcmpPlayerLike) => {
      const ccmpPlayer = ccmp.players.getById(player.id);
      if (!ccmpPlayer) {
        return;
      }

      // Зеркалит контракт client-side `CCMPEventsManager`: payload всегда
      // массивом, на клиенте развернётся обратно в позиционные аргументы.
      ccmpPlayer.emit(CLIENT_READY_EVENT, [{ remoteId: player.id }]);
    });
  }

  /**
   * Принимает зеркалированные клиентские `console.*` вызовы и печатает в
   * серверный stdout. Необходимо для отладки CCMP-клиента: иначе ошибки
   * boot'а уходят в игровую консоль (F8), не видны разработчику.
   *
   * Парный клиент — `CCMPConsoleForwarder`.
   */
  private _registerClientLogForwarder(): void {
    ccmp.on(CLIENT_LOG_EVENT, (player: CcmpPlayerLike, payload: ClientLogPayload) => {
      const level = payload?.level ?? "log";
      const args = Array.isArray(payload?.args) ? payload.args : [];

      const sink = pickConsoleSink(level);
      sink(`[client:${player.id}]`, ...args.map(rehydrateArg));
    });
  }
}
