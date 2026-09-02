import { type INetManager } from "../common/INetManager";
import { VIMPEventsManager } from "./events/VIMPEventsManager";
import { VIMPRPCManager } from "./rpc/VIMPRPCManager";

/**
 * Имя cooperation-события для синтеза `rm::playerReady` на клиенте.
 *
 * Клиент шлёт это сразу после `connectionStateChanged.connected = true`;
 * сервер отвечает тому же игроку этим же именем с `{ remoteId }`. Клиентский
 * `VIMPEventsBridge` ловит ответ и эмитит `rm::playerReady`.
 */
const CLIENT_READY_EVENT = "rm::clientReady";

/**
 * Имя приватного события для зеркалирования клиентских `console.*` вызовов
 * в серверный stdout. Реализация клиента — `VIMPConsoleForwarder`.
 */
const CLIENT_LOG_EVENT = "rm::clientLog";

interface VimpPlayerLike {
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

export class VIMPNetManager implements INetManager {
  private readonly _eventsManager: VIMPEventsManager;

  private readonly _rpcManager: VIMPRPCManager;

  public get events(): VIMPEventsManager {
    return this._eventsManager;
  }

  public get rpc(): VIMPRPCManager {
    return this._rpcManager;
  }

  public constructor() {
    this._eventsManager = new VIMPEventsManager();
    this._rpcManager = new VIMPRPCManager();

    this._registerClientReadyCooperation();
    this._registerClientLogForwarder();
  }

  private _registerClientReadyCooperation(): void {
    // Регистрируем напрямую через `vimp.on` (а не через events.onClient),
    // потому что событие не входит в `IClientToServerEvents` — это
    // приватный rock-mod протокол.
    vimp.on(CLIENT_READY_EVENT, (player: VimpPlayerLike) => {
      const vimpPlayer = vimp.players.getById(player.id);
      if (!vimpPlayer) {
        return;
      }

      // Зеркалит контракт client-side `VIMPEventsManager`: payload всегда
      // массивом, на клиенте развернётся обратно в позиционные аргументы.
      vimpPlayer.emit(CLIENT_READY_EVENT, [{ remoteId: player.id }]);
    });
  }

  /**
   * Принимает зеркалированные клиентские `console.*` вызовы и печатает в
   * серверный stdout. Необходимо для отладки VIMP-клиента: иначе ошибки
   * boot'а уходят в игровую консоль (F8), не видны разработчику.
   *
   * Парный клиент — `VIMPConsoleForwarder`.
   */
  private _registerClientLogForwarder(): void {
    vimp.on(CLIENT_LOG_EVENT, (player: VimpPlayerLike, payload: ClientLogPayload) => {
      const level = payload?.level ?? "log";
      const args = Array.isArray(payload?.args) ? payload.args : [];

      const sink = pickConsoleSink(level);
      sink(`[client:${player.id}]`, ...args.map(rehydrateArg));
    });
  }
}
