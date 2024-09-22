import { EntityType, IEntity, IEntityOptions } from "../../common/entity/IEntity";

export abstract class RageEntity implements IEntity {
  private readonly _id: number;

  private readonly _type: EntityType;

  get id(): number {
    return this._id;
  }

  get type(): EntityType {
    return this._type;
  }

  protected constructor(options: IEntityOptions) {
    this._id = options.id;
    this._type = options.type;
  }
}
