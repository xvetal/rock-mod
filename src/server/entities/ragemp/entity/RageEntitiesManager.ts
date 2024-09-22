import { IEntitiesManager, IEntitiesManagerOptions } from "../../common/entity/IEntitiesManager";
import { RageEntity } from "./RageEntity";
import { EntityType } from "../../common/entity/IEntity";

export abstract class RageEntitiesManager<T extends RageEntity> implements IEntitiesManager {
  protected readonly _entities: Map<number, T>;

  private readonly _entitiesType: `${EntityType}`;

  protected constructor(options: IEntitiesManagerOptions) {
    this._entities = new Map();
    this._entitiesType = options.entitiesType;
  }

  getByID(id: number): T {
    const entity = this._entities.get(id);

    if (!entity) {
      throw new Error(`Entity ${this._entitiesType} #${id} not found`);
    }

    return entity;
  }
}
