import { type IEntity } from "@RockMod/client/entities";

export interface IDataHandler {
  addDataHandler(key: string, callback: (entity: IEntity, value: unknown, oldValue?: unknown) => void): void;
}
