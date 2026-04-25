export enum BaseObjectType {
  Blip = "blip",
  Colshape = "colshape",
  Marker = "marker",
  Object = "object",
  Ped = "ped",
  Player = "player",
  Vehicle = "vehicle",
  Camera = "camera",
}

export interface IBaseObjectDto {
  type: BaseObjectType;
  remoteId: number;
}
