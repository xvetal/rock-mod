declare namespace RageMP {
  interface PlayerMP {
    call(eventName: string, args?: unknown[]): void;
    callProc(rpcName: string, args?: unknown[]): Promise<unknown>;
  }
}

declare const mp: RageMP;
