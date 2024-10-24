import { BaseObjectType, IBaseObject, IBaseObjectOptions } from "../../common/baseObject/IBaseObject";

// RAGEMP BUG: event 'entityDestroyed' is not callable
const unsupportedRageEntityTypes: Set<`${BaseObjectType}`> = new Set(["blip", "colshape"]);

export interface IRageBaseObjectOptions<T extends EntityMp> extends IBaseObjectOptions {
  mpEntity: T;
}

export abstract class RageBaseObject<T extends EntityMp = EntityMp> implements IBaseObject {
  private readonly _mpEntity: T;

  public get id(): number {
    return this._mpEntity.id;
  }

  public get type(): BaseObjectType {
    return this._mpEntity.type as unknown as BaseObjectType;
  }

  public get isExists(): boolean {
    return this._mpEntity.isExists();
  }

  protected get mpEntity(): T {
    return this._mpEntity;
  }

  protected constructor(options: IRageBaseObjectOptions<T>) {
    this._mpEntity = options.mpEntity;
  }

  public destroy(): void {
    this._mpEntity.destroy();

    if (unsupportedRageEntityTypes.has(this.type)) {
      mp.events.call("entityDestroyed", this._mpEntity);
    }
  }
}
