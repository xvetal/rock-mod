export interface IStorageManager {
  getData<T>(key: string): T | null;
  setData<T>(key: string, value: T): void;
  removeData(key: string): void;
  clearData(prefix?: string): void;
}
