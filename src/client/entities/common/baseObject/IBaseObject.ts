import BaseObject = AltVClient.BaseObject;
import { type BaseObjectType } from "@shared/entities";

export interface IBaseObjectOptions {
  mpEntity: EntityMp | BaseObject;
}

export interface IBaseObject {
  get id(): number;
  get remoteId(): number;
  get type(): BaseObjectType;
  get isExists(): boolean;
  destroy(): void;
}
