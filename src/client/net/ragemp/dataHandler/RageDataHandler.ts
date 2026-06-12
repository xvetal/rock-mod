import { type IBaseObject, type IEntityPoolRouter } from "@RockMod/client/entities";
import { type IDataHandler } from "@RockMod/client/net/common/dataHandler/IDataHandler";

export class RageDataHandler implements IDataHandler {
  private readonly _entityPoolRouter: IEntityPoolRouter;

  public constructor(entityPoolRouter: IEntityPoolRouter) {
    this._entityPoolRouter = entityPoolRouter;
  }

  public addDataHandler(
    key: string,
    callback: (object: IBaseObject, value: unknown, oldValue?: unknown) => void,
  ): void {
    mp.events.addDataHandler(key, (mpEntity, value, oldValue) => {
      const entity = this._entityPoolRouter.resolveFromMp(mpEntity);
      if (!entity) {
        return;
      }

      callback(entity, value, oldValue);
    });
  }
}
