import { IEntity, IEntityOptions } from "../../common/entity/IEntity";
import { AltVWorldObject } from "../worldObject/AltVWorldObject";

export abstract class AltVEntity extends AltVWorldObject implements IEntity {
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
