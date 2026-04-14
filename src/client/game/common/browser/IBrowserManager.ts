export interface IBrowserManager {
  create(url: string): void;
  destroy(): void;
  execute(code: string): void;
}
