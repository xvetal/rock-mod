import BaseObject = AltVServer.BaseObject;

export enum BaseObjectType {
  Player = "player",
  Vehicle = "vehicle",
}

export interface IBaseObjectOptions {
  mpEntity: EntityMp | BaseObject;
}

export interface IBaseObject {
  get id(): number;
  get type(): BaseObjectType;
  get isExists(): boolean;
  destroy(): void;
}
