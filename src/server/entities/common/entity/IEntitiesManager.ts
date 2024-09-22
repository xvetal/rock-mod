import { EntityType, IEntity } from "./IEntity";

export interface IEntitiesManagerOptions {
  entitiesType: `${EntityType}`;
}

export interface IEntitiesManager {
  getByID(id: number): IEntity;
}
