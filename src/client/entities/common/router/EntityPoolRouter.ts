import { type IEntity } from "@RockMod/client/entities/common";
import { RockMod } from "@RockMod/client/RockMod";
import { BaseObjectType, type IBaseObjectDto } from "@shared/entities/IBaseObject";
import {
  type IEntityPoolBridge,
  type IEntityPoolRouter,
} from "@RockMod/client/entities/common/router/IEntityPoolRouter";

export class EntityPoolRouter implements IEntityPoolRouter {
  private static readonly _entityPoolsByType: Readonly<
    Partial<Record<BaseObjectType, (rockMod: RockMod) => IEntityPoolBridge>>
  > = {
    [BaseObjectType.Player]: (rockMod) => rockMod.players,
    [BaseObjectType.Vehicle]: (rockMod) => rockMod.vehicles,
    [BaseObjectType.Object]: (rockMod) => rockMod.objects,
    [BaseObjectType.Ped]: (rockMod) => rockMod.peds,
  };

  public registerByDto(entity: IBaseObjectDto): IEntity | null {
    return this._withEntityPool(entity.type, (pool) => pool.registerByRemoteId(entity.id));
  }

  public unregisterByDto(entity: IBaseObjectDto): IEntity | null {
    return this._withEntityPool(entity.type, (pool) => pool.unregisterByRemoteId(entity.id));
  }

  public registerFromMp(mpEntity: EntityMp): IEntity | null {
    const entityType = mpEntity.type as unknown as BaseObjectType;

    return this._withEntityPool(entityType, (pool) => pool.registerByRemoteId(mpEntity.remoteId));
  }

  public resolveFromMp(mpEntity: EntityMp): IEntity | null {
    const entityType = mpEntity.type as unknown as BaseObjectType;

    return this._withEntityPool(entityType, (pool) => pool.findByRemoteID(mpEntity.remoteId));
  }

  private _withEntityPool(
    entityType: BaseObjectType,
    operation: (pool: IEntityPoolBridge) => IEntity | null,
  ): IEntity | null {
    const rockMod = RockMod.instance;
    if (!rockMod) {
      return null;
    }

    const resolvePool = EntityPoolRouter._entityPoolsByType[entityType];
    if (!resolvePool) {
      return null;
    }

    return operation(resolvePool(rockMod));
  }
}
