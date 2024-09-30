import BaseObject = AltVServer.BaseObject;

export enum BaseObjectType {
  Player = "player",
  Vehicle = "vehicle",
}

export interface IBaseObjectOptions {
  mpEntity: EntityMp | BaseObject;
}

export interface IBaseObject {
  id: number;
  type: BaseObjectType;
  destroy(): void;
}
