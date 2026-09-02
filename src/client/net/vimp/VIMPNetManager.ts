import { type INetManager } from "../common/INetManager";
import { CCMPConsoleForwarder } from "./VIMPConsoleForwarder";
import { CCMPDataHandler } from "./dataHandler/VIMPDataHandler";
import { CCMPEventsBridge } from "./events/VIMPEventsBridge";
import { CCMPEventsManager } from "./events/VIMPEventsManager";
import { CCMPRenderTicker } from "./events/VIMPRenderTicker";
import { CCMPRPCManager } from "./rpc/VIMPRPCManager";

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
    this._consoleForwarder = new CCMPConsoleForwarder();
    this._consoleForwarder.install();

    this._eventsManager = new CCMPEventsManager();
    this._rpcManager = new CCMPRPCManager();
    this._dataHandler = new CCMPDataHandler(this._eventsManager);
    this._bridge = new CCMPEventsBridge(this._eventsManager);
    this._renderTicker = new CCMPRenderTicker();

    this._bridge.registerRawEvents();
    this._bridge.registerServerEvents();
    this._renderTicker.start(this._eventsManager);
  }
}
