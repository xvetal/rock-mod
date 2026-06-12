import { type INetManager } from "../common/INetManager";
import { CCMPConsoleForwarder } from "./CCMPConsoleForwarder";
import { CCMPDataHandler } from "./dataHandler/CCMPDataHandler";
import { CCMPEventsBridge } from "./events/CCMPEventsBridge";
import { CCMPEventsManager } from "./events/CCMPEventsManager";
import { CCMPRenderTicker } from "./events/CCMPRenderTicker";
import { CCMPRPCManager } from "./rpc/CCMPRPCManager";

/**
 * Корневой сетевой менеджер CCMP-клиента.
 *
 * Симметричен `RageNetManager` (`src/client/net/ragemp/RageNetManager.ts`), но
 * без `IEntityPoolRouter` — CCMP entity pool ещё не реализован, а events+RPC
 * milestone от него не зависит.
 */
export class CCMPNetManager implements INetManager {
  private readonly _eventsManager: CCMPEventsManager;

  private readonly _rpcManager: CCMPRPCManager;

  private readonly _dataHandler: CCMPDataHandler;

  private readonly _bridge: CCMPEventsBridge;

  private readonly _renderTicker: CCMPRenderTicker;

  private readonly _consoleForwarder: CCMPConsoleForwarder;

  public get events(): CCMPEventsManager {
    return this._eventsManager;
  }

  public get rpc(): CCMPRPCManager {
    return this._rpcManager;
  }

  public get dataHandler(): CCMPDataHandler {
    return this._dataHandler;
  }

  public constructor() {
    // Прямой ping на сервер — не зависит от console-обёртки и других
    // менеджеров. Серверная сторона (`CCMPNetManager`) логирует через
    // `rm::clientLog` handler с уровнем info. Если в серверном stdout не
    // видно "[client:<id>] [rock-mod] CCMP client net manager constructed" —
    // значит client-бандл не загрузился / не дошёл до этого места.
    try {
      ccmp.emitServer("rm::clientLog", {
        level: "info",
        args: ["[rock-mod] CCMP client net manager constructed"],
      });
    } catch {
      // Если сетевой канал не готов, эта диагностическая строка теряется.
    }

    // Console forwarder ставим первым: чтобы любые `console.*` из
    // конструкторов других менеджеров/модулей уже зеркалились на сервер.
    this._consoleForwarder = new CCMPConsoleForwarder();
    this._consoleForwarder.install();

    this._eventsManager = new CCMPEventsManager();
    this._rpcManager = new CCMPRPCManager();
    // DataHandler сначала, чтобы он успел подписаться на internal-bus до
    // первых эмиссий `rm::syncedMetaChange` от `CCMPSyncedMetaBridge`
    // (registers later, when all stream-synced base-object managers are ready).
    this._dataHandler = new CCMPDataHandler(this._eventsManager);
    this._bridge = new CCMPEventsBridge(this._eventsManager);
    this._renderTicker = new CCMPRenderTicker();

    this._bridge.registerRawEvents();
    this._bridge.registerServerEvents();
    this._renderTicker.start(this._eventsManager);
  }
}
