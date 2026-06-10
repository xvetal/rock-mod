import BaseObject = AltVClient.BaseObject;
import { type BaseObjectType } from "@shared/entities";

export interface IBaseObjectOptions {
  mpEntity: EntityMp | BaseObject;
}

export interface IBaseObject {
  get id(): number;
  /** Server/network id for remote objects; null for client-only objects. */
  get remoteId(): number | null;
  get type(): BaseObjectType;
  get isExists(): boolean;
  get handle(): number;
  destroy(): void;
}
