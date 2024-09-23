export enum BaseObjectType {
  Player = "player",
  Vehicle = "vehicle",
}

export interface IBaseObjectOptions {
  id: number;
  type: BaseObjectType;
}

export interface IBaseObject {
  id: number;
  type: BaseObjectType;
  destroy(): void;
}
