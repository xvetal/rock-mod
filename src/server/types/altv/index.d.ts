declare namespace AltV {
  interface PlayerMP {
    emit(eventName: string, ...args: unknown[]): void;
    emitRpc(rpcName: string, ...args: unknown): Promise<unknown>;
  }
}

declare const alt: {
  on(eventName: string, listener: unknown): void;
  onRpc(rpcName: string, listener: unknown): void;
  off(rpcName: string, listener: unknown): void;
  offRpc(rpcName: string): void;
  emit(eventName: string, ...args: unknown[]): void;
};
