declare namespace AltV {
  interface PlayerMP {
    emit(eventName: string, ...args: unknown[]): void;
    emitRpc(rpcName: string, ...args: unknown): Promise<unknown>;
  }
}

declare const alt: AltV;
