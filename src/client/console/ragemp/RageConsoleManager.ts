import { type IConsoleManager } from "@RockMod/client/console/common";

export class RageConsoleManager implements IConsoleManager {
  public logInfo(message: string, save?: boolean, saveAsync?: boolean): void {
    mp.console.logInfo(message, save, saveAsync);
  }

  public logWarning(message: string, save?: boolean, saveAsync?: boolean): void {
    mp.console.logWarning(message, save, saveAsync);
  }

  public logError(message: string, save?: boolean, saveAsync?: boolean): void {
    mp.console.logError(message, save, saveAsync);
  }

  public logFatal(message: string, save?: boolean, saveAsync?: boolean): void {
    mp.console.logFatal(message, save, saveAsync);
  }

  public clear(): void {
    mp.console.clear();
  }

  public reset(): void {
    mp.console.reset();
  }
}
