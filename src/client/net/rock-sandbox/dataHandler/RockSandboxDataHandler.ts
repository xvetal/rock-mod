import { type IDataHandler } from "../../common/dataHandler/IDataHandler";
import { type IBaseObject } from "../../../entities";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapPlayer } from "../../../entities/rock-sandbox/player/RockSandboxPlayer";

export class RockSandboxDataHandler implements IDataHandler {
  public addDataHandler(
    key: string,
    callback: (object: IBaseObject, value: unknown, oldValue?: unknown) => void,
  ): void {
    getRockSandbox().dataHandler.addDataHandler(key, (player, value, oldValue) =>
      callback(wrapPlayer(player), value, oldValue),
    );
  }
}
