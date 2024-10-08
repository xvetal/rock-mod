import BaseObject = AltVServer.BaseObject;

export enum BaseObjectType {
  Blip = "blip",
  Marker = "marker",
  Object = "object",
  Ped = "ped",
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
