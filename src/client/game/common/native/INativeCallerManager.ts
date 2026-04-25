export interface INativeCallerManager {
  callNative(hash: string, ...args: unknown[]): unknown;
}
