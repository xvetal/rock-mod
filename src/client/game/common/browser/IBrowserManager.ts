export interface IBrowserHandle {
  readonly isAlive: boolean;
  execute(code: string): void;
  destroy(): void;
  setOrderId?(orderId: number): void;
}

export interface IBrowserManager {
  create(url: string): void;
  createInstance(url: string): IBrowserHandle;
  destroy(): void;
  execute(code: string): void;
}
