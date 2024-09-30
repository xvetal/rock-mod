declare namespace RageMP {
  interface Vector3MP {
    x: number;
    y: number;
    z: number;
  }

  interface PlayerMP {
    id: number;
    name: string;
    model: string;
    socialClub: string;
    dimension: number;
    position: Vector3MP;
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
