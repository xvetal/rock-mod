import { type IEntity } from "../../common/entity/IEntity";
import { MockWorldObject, type IMockWorldObjectOptions } from "../worldObject/MockWorldObject";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils";
import { RockMod } from "../../../RockMod";

export interface IMockEntityOptions extends IMockWorldObjectOptions {
  model: number;
  rotation: IVector3D;
}

export abstract class MockEntity extends MockWorldObject implements IEntity {
  private _model: number;

  private _rotation: IVector3D;

  private _netData: Map<string, unknown>;

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
    this._netData = new Map();
  }

  public setModel(value: string): void {
    this._model = RockMod.instance.utils.hash(value);
  }

  public setRotation(value: Vector3D): void {
    this._rotation = value;
  }

  public getNetData(name: string): unknown {
    return this._netData.get(name);
  }

  public setNetData(name: string, value: unknown): void {
    this._netData.set(name, value);
  }
}
