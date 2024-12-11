import BaseObject = AltVServer.BaseObject;
import { BaseObjectType } from "../../../../shared";

export interface IBaseObjectOptions {
  mpEntity: EntityMp | BaseObject;
}

export interface IBaseObject {
  get id(): number;
  get type(): BaseObjectType;
  get isExists(): boolean;
  destroy(): void;
}
