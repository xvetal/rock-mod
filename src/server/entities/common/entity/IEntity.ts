export enum EntityType {
  Player = "player",
  Vehicle = "vehicle",
}

export interface IEntityOptions {
  id: number;
  type: EntityType;
  model: string;
}

export interface IEntity {
  get id(): number;
  get type(): EntityType;
}
