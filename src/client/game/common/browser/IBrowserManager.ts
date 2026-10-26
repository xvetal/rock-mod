export interface IBrowserHandle {
  readonly isAlive: boolean;
  execute(code: string): void;
  destroy(): void;
  setOrderId?(orderId: number): void;
  /** Optional native overlay input gate; visibility is unchanged. */
  setInputEnabled?(enabled: boolean): void;
}

export interface IBrowserManager {
  create(url: string): void;
  createInstance(url: string): IBrowserHandle;
  destroy(): void;
  execute(code: string): void;
}
