import { type IDataHandler } from "../../common/dataHandler/IDataHandler";
import { type IBaseObject } from "../../../entities";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxDataHandler implements IDataHandler {
  public addDataHandler(
    _key: string,
    _callback: (object: IBaseObject, value: unknown, oldValue?: unknown) => void,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxDataHandler.addDataHandler");
  }
}
