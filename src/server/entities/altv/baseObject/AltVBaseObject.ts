import { BaseObjectType, IBaseObject, IBaseObjectOptions } from "../../common/baseObject/IBaseObject";

export abstract class AltVBaseObject implements IBaseObject {
  private readonly _id: number;

  private readonly _type: BaseObjectType;

  public get id(): number {
    return this._id;
  }

  public get type(): BaseObjectType {
    return this._type;
  }

  protected constructor(options: IBaseObjectOptions) {
    this._id = options.id;
    this._type = options.type;
  }

  public destroy(): void {
    console.log("destroy");
  }
}
