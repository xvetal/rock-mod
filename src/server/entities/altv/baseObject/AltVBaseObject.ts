import { BaseObjectType, IBaseObject, IBaseObjectOptions } from "../../common/baseObject/IBaseObject";
import BaseObject = AltVServer.BaseObject;
import BaseObjectTypeMP = AltVShared.BaseObjectType;

export interface IAltVBaseObjectOptions<T extends BaseObject> extends IBaseObjectOptions {
  mpEntity: T;
}

export abstract class AltVBaseObject<T extends BaseObject> implements IBaseObject {
  private readonly _mpEntity: T;

  public get id(): number {
    return this._mpEntity.id;
  }

  public get type(): BaseObjectType {
    switch (this._mpEntity.type) {
      case BaseObjectTypeMP.Player: {
        return BaseObjectType.Player;
      }
      case BaseObjectTypeMP.Vehicle: {
        return BaseObjectType.Vehicle;
      }
    }

    throw new Error(`BaseObject type ${this._mpEntity.type} not supported`);
  }

  public get isExists(): boolean {
    return this.mpEntity.valid;
  }

  protected get mpEntity(): T {
    return this._mpEntity;
  }

  protected constructor(options: IAltVBaseObjectOptions<T>) {
    this._mpEntity = options.mpEntity;
  }

  public destroy(): void {
    console.log("destroy");
  }
}
