import { type IEntity } from "../../common/entity/IEntity";
import { type IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils";

export interface IRageEntityOptions<T extends EntityMp> extends IRageWorldObjectOptions<T> {
  rotation?: IVector3D;
}

export abstract class RageEntity<T extends EntityMp> extends RageWorldObject<T> implements IEntity {
  private _rotation: IVector3D | undefined;

  public get model(): number {
    return this.mpEntity.model;
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._getEntityRotationProperty() ?? this._rotation ?? new Vector3D(0, 0, 0);
    return new Vector3D(x, y, z);
  }

  protected constructor(options: IRageEntityOptions<T>) {
    super(options);
    this._rotation = options.rotation;
  }

  public setModel(value: string): void {
    this.mpEntity.model = mp.joaat(value);
  }

  public setRotation(value: Vector3D): void {
    this._rotation = value;
    this.mpEntity.rotation = new mp.Vector3(value);
  }

  public getNetData(name: string): unknown {
    return this.mpEntity.getVariable(name);
  }

  public setNetData(name: string, value: unknown): void {
    this.mpEntity.setVariable(name, value);
  }

  private _getEntityRotationProperty(): IVector3D | null {
    const rotation = (this.mpEntity as { rotation?: unknown }).rotation;
    if (!this._isVectorLike(rotation)) return null;
    return rotation;
  }

  private _isVectorLike(value: unknown): value is IVector3D {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof (value as IVector3D).x === "number" &&
      typeof (value as IVector3D).y === "number" &&
      typeof (value as IVector3D).z === "number"
    );
  }
}
