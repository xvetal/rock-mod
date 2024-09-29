declare namespace RageMP {
  interface PlayerMP {
    call(eventName: string, args?: unknown[]): void;
    callProc(rpcName: string, args?: unknown[]): Promise<unknown>;
  }

  interface Events {
    add(eventName: string, handler: unknown): void;
    addProc(eventName: string, handler: unknown): void;
    call(eventName: string, ...args: unknown[]): void;
    remove(eventName: string, handler?: unknown): void;
  }
}

declare const mp: {
  events: RageMP.Events;
};
