import { type IEntitiesManager, type IEntity } from "@RockMod/client/entities/common";
import { RockMod } from "@RockMod/client/RockMod";
import { BaseObjectType, type IBaseObjectDto } from "@shared/entities/IBaseObject";
import { type IEntityPoolRouter } from "@RockMod/client/entities/common/router/IEntityPoolRouter";

export class RageEntityPoolRouter implements IEntityPoolRouter {
  private static readonly _entityPoolsByType: Readonly<
    Partial<Record<BaseObjectType, (rockMod: RockMod) => IEntitiesManager<IEntity>>>
  > = {
    [BaseObjectType.Player]: (rockMod) => rockMod.players,
    [BaseObjectType.Vehicle]: (rockMod) => rockMod.vehicles,
    [BaseObjectType.Object]: (rockMod) => rockMod.objects,
    [BaseObjectType.Ped]: (rockMod) => rockMod.peds,
  };

  public registerByDto(entity: IBaseObjectDto): IEntity | null {
    return this._withEntityPool(entity.type, (pool) => {
      const existingEntity = pool.findByRemoteID(entity.remoteId);
      if (existingEntity) {
        return existingEntity;
      }

      const mpEntity = this._getMpEntityByRemoteId(entity.type, entity.remoteId);
      if (!mpEntity) {
        return null;
      }

      return pool.registerById(mpEntity.id);
    });
  }

  public unregisterByDto(entity: IBaseObjectDto): IEntity | null {
    return this._withEntityPool(entity.type, (pool) => {
      const existingEntity = pool.findByRemoteID(entity.remoteId);
      if (!existingEntity) {
        return null;
      }

      return pool.unregisterById(existingEntity.id);
    });
  }

  public registerFromMp(mpEntity: EntityMp | null | undefined): IEntity | null {
    if (!mpEntity) {
      return null;
    }

    const entityType = mpEntity.type as unknown as BaseObjectType;

    return this._withEntityPool(entityType, (pool) => pool.registerById(mpEntity.id));
  }

  public resolveFromMp(mpEntity: EntityMp | null | undefined): IEntity | null {
    if (!mpEntity) {
      return null;
    }

    const entityType = mpEntity.type as unknown as BaseObjectType;

    return this._withEntityPool(entityType, (pool) => pool.findByID(mpEntity.id));
  }

  private _withEntityPool(
    entityType: BaseObjectType,
    operation: (pool: IEntitiesManager<IEntity>) => IEntity | null,
  ): IEntity | null {
    const rockMod = RockMod.instance;
    if (!rockMod) {
      return null;
    }

    const resolvePool = RageEntityPoolRouter._entityPoolsByType[entityType];
    if (!resolvePool) {
      return null;
    }

    return operation(resolvePool(rockMod));
  }

  private _getMpEntityByRemoteId(entityType: BaseObjectType, remoteId: number): EntityMp | null {
    switch (entityType) {
      case BaseObjectType.Player:
        return mp.players.atRemoteId(remoteId);
      case BaseObjectType.Vehicle:
        return mp.vehicles.atRemoteId(remoteId);
      case BaseObjectType.Object:
        return mp.objects.atRemoteId(remoteId);
      case BaseObjectType.Ped:
        return mp.peds.atRemoteId(remoteId);
      default:
        return null;
    }
  }
}
