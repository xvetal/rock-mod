import { type IConsoleManager } from "../common/IConsoleManager";
import { rockSandboxNotImplemented } from "../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxConsoleManager implements IConsoleManager {
  public logInfo(_message: string, _save?: boolean, _saveAsync?: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxConsoleManager.logInfo");
  }

  public logWarning(_message: string, _save?: boolean, _saveAsync?: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxConsoleManager.logWarning");
  }

  public logError(_message: string, _save?: boolean, _saveAsync?: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxConsoleManager.logError");
  }

  public logFatal(_message: string, _save?: boolean, _saveAsync?: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxConsoleManager.logFatal");
  }

  public clear(): void {
    return rockSandboxNotImplemented("client", "RockSandboxConsoleManager.clear");
  }

  public reset(): void {
    return rockSandboxNotImplemented("client", "RockSandboxConsoleManager.reset");
  }
}
