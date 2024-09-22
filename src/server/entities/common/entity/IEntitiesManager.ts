import { EntityType, IEntity } from "./IEntity";

export interface IEntitiesManagerOptions {
  entitiesType: `${EntityType}`;
}

export interface IEntitiesManager<T extends IEntity> {
  getByID(id: number): T;
}
