import { type IEntity } from "@RockMod/client/entities";
import type { IBaseObjectDto } from "@shared/entities";

export interface IEntityPoolBridge {
  registerByRemoteId(remoteId: number): IEntity;
  unregisterByRemoteId(remoteId: number): IEntity;
}

export interface IEntityPoolRouter {
  registerByDto(entity: IBaseObjectDto): IEntity | null;
  unregisterByDto(entity: IBaseObjectDto): IEntity | null;
  resolveFromMp(mpEntity: EntityMp): IEntity | null;
}
