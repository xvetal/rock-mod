export interface IConsoleManager {
  logInfo(message: string, save?: boolean, saveAsync?: boolean): void;
  logWarning(message: string, save?: boolean, saveAsync?: boolean): void;
  logError(message: string, save?: boolean, saveAsync?: boolean): void;
  logFatal(message: string, save?: boolean, saveAsync?: boolean): void;
  clear(): void;
  reset(): void;
}
