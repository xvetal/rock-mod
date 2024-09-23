import { IEntity, IEntityOptions } from "../../common/entity/IEntity";
import { RageWorldObject } from "../worldObject/RageWorldObject";

export abstract class RageEntity extends RageWorldObject implements IEntity {
  private _model: string;

  public get model(): string {
    return this._model;
  }

  protected constructor(options: IEntityOptions) {
    super(options);
    this._model = options.model;
  }

  public setModel(value: string): void {
    this._model = value;
  }
}
