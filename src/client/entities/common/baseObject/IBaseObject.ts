import BaseObject = AltVClient.BaseObject;

export enum BaseObjectType {
  Player = "player",
}

export interface IBaseObjectOptions {
  mpEntity: EntityMp | BaseObject;
}

export interface IBaseObject {
  get id(): number;
  get type(): BaseObjectType;
  get isExists(): boolean;
}
