import { type IBaseObject } from "@RockMod/client/entities";

export interface IDataHandler {
  addDataHandler(key: string, callback: (object: IBaseObject, value: unknown, oldValue?: unknown) => void): void;
}
