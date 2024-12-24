import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";
import { type BaseObjectType } from "../../../../shared";

export interface IMockBaseObjectOptions {
  id: number;
  type: BaseObjectType;
  position: IVector3D;
  dimension?: number;
}

export abstract class MockBaseObject implements IBaseObject {
  public readonly id: number;

  public readonly type: BaseObjectType;

  public readonly position: IVector3D;

  public readonly dimension: number;

  protected _exists: boolean;

  protected constructor(options: IMockBaseObjectOptions) {
    this.id = options.id;
    this.type = options.type;
    this.position = options.position;
    this.dimension = options.dimension ?? 0;
    this._exists = true;
  }

  public get isExists(): boolean {
    return this._exists;
  }

  public destroy(): void {
    this._exists = false;
  }
}
