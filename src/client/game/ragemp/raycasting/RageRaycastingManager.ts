import { type IRaycastIgnoreEntity, type IRaycastResult, type IRaycastingManager } from "@RockMod/client/game";
import { type IVector3D, Vector3D } from "@shared/common/utils";
import { BaseObjectType } from "@shared/entities";
import { type TIgnoreEntityType } from "@RockMod/client/game/common/raycasting/IRaycastingManager";

export class RageRaycastingManager implements IRaycastingManager {
  public testPointToPoint(
    startPos: IVector3D,
    endPos: IVector3D,
    ignoreEntity?: TIgnoreEntityType,
    flags?: number | number[],
  ): IRaycastResult | null {
    const result = mp.raycasting.testPointToPoint(
      new mp.Vector3(startPos.x, startPos.y, startPos.z),
      new mp.Vector3(endPos.x, endPos.y, endPos.z),
      this._resolveIgnoreEntity(ignoreEntity),
      flags,
    );

    if (!result) {
      return null;
    }

    return {
      entityHandle: typeof result.entity === "number" ? result.entity : result.entity.handle,
      position: new Vector3D(result.position.x, result.position.y, result.position.z),
      surfaceNormal: new Vector3D(result.surfaceNormal.x, result.surfaceNormal.y, result.surfaceNormal.z),
    };
  }

  private _resolveIgnoreEntity(ignoreEntity?: TIgnoreEntityType): EntityMp | EntityMp[] | undefined {
    if (!ignoreEntity) {
      return undefined;
    }

    if (Array.isArray(ignoreEntity)) {
      const entities = ignoreEntity
        .map((entity) => this._resolveMpEntity(entity))
        .filter((entity): entity is EntityMp => Boolean(entity));

      return entities.length > 0 ? entities : undefined;
    }

    return this._resolveMpEntity(ignoreEntity);
  }

  private _resolveMpEntity(entity: IRaycastIgnoreEntity): EntityMp | undefined {
    switch (entity.type) {
      case BaseObjectType.Player:
        return mp.players.atHandle(entity.handle);
      case BaseObjectType.Vehicle:
        return mp.vehicles.atHandle(entity.handle);
      case BaseObjectType.Object:
        return mp.objects.atHandle(entity.handle);
      case BaseObjectType.Ped:
        return mp.peds.atHandle(entity.handle);
      default:
        return undefined;
    }
  }
}
