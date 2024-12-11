import BaseObject = AltVClient.BaseObject;
import { BaseObjectType } from "@shared/entities";

export interface IBaseObjectOptions {
  mpEntity: EntityMp | BaseObject;
}

export interface IBaseObject {
  get id(): number;
  get type(): BaseObjectType;
  get isExists(): boolean;
}
