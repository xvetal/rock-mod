import { type INetManager } from "../common/INetManager";
import { VIMPConsoleForwarder } from "./VIMPConsoleForwarder";
import { VIMPDataHandler } from "./dataHandler/VIMPDataHandler";
import { VIMPEventsBridge } from "./events/VIMPEventsBridge";
import { VIMPEventsManager } from "./events/VIMPEventsManager";
import { VIMPRenderTicker } from "./events/VIMPRenderTicker";
import { VIMPRPCManager } from "./rpc/VIMPRPCManager";

export class VIMPNetManager implements INetManager {
  private readonly _eventsManager: VIMPEventsManager;

  private readonly _rpcManager: VIMPRPCManager;

  private readonly _dataHandler: VIMPDataHandler;

  private readonly _bridge: VIMPEventsBridge;

  private readonly _renderTicker: VIMPRenderTicker;

  private readonly _consoleForwarder: VIMPConsoleForwarder;

  public get events(): VIMPEventsManager {
    return this._eventsManager;
  }

  public get rpc(): VIMPRPCManager {
    return this._rpcManager;
  }

  public get dataHandler(): VIMPDataHandler {
    return this._dataHandler;
  }

  public constructor() {
    this._consoleForwarder = new VIMPConsoleForwarder();
    this._consoleForwarder.install();

    this._eventsManager = new VIMPEventsManager();
    this._rpcManager = new VIMPRPCManager();
    this._dataHandler = new VIMPDataHandler(this._eventsManager);
    this._bridge = new VIMPEventsBridge(this._eventsManager);
    this._renderTicker = new VIMPRenderTicker();

    this._bridge.registerRawEvents();
    this._bridge.registerServerEvents();
    this._renderTicker.start(this._eventsManager);
  }
}
