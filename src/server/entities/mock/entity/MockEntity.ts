import { IEntity } from "../../common/entity/IEntity";
import { MockWorldObject, IMockWorldObjectOptions } from "../worldObject/MockWorldObject";
import { IVector3D, Vector3D } from "../../../common/utils";
import { RockMod } from "../../../RockMod";

export interface IMockEntityOptions extends IMockWorldObjectOptions {
  model: number;
  rotation: IVector3D;
}

export abstract class MockEntity extends MockWorldObject implements IEntity {
  private _model: number;

  private _rotation: IVector3D;

  public get model(): number {
    return this._model;
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._rotation;
    return new Vector3D(x, y, z);
  }

  protected constructor(options: IMockEntityOptions) {
    super(options);

    this._model = options.model;
    this._rotation = options.rotation;
  }

  public setModel(value: string): void {
    this._model = RockMod.instance.utils.hash(value);
  }

  public setRotation(value: Vector3D): void {
    this._rotation = value;
  }
}
