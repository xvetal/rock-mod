import { type IEntity } from "@RockMod/client/entities";
import type { IBaseObjectDto } from "@shared/entities";

export interface IEntityPoolRouter {
  registerByDto(entity: IBaseObjectDto): IEntity | null;
  unregisterByDto(entity: IBaseObjectDto): IEntity | null;
  registerFromMp(mpEntity: EntityMp): IEntity | null;
  resolveFromMp(mpEntity: EntityMp): IEntity | null;
}
