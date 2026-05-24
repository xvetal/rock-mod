export interface IChatManager {
  activate(state: boolean): void;
  show(state: boolean): void;
  push(text: string): void;
}
