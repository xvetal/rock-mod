import { type IEntityPoolRouter } from "../../common/router/IEntityPoolRouter";
import { type IEntity } from "../..";
import { type IBaseObjectDto } from "../../../../shared/entities";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxEntityPoolRouter implements IEntityPoolRouter {
  public registerByDto(_entity: IBaseObjectDto): IEntity | null {
    return rockSandboxNotImplemented("client", "RockSandboxEntityPoolRouter.registerByDto");
  }

  public unregisterByDto(_entity: IBaseObjectDto): IEntity | null {
    return rockSandboxNotImplemented("client", "RockSandboxEntityPoolRouter.unregisterByDto");
  }

  public registerFromMp(_mpEntity: EntityMp | null | undefined): IEntity | null {
    return rockSandboxNotImplemented("client", "RockSandboxEntityPoolRouter.registerFromMp");
  }

  public resolveFromMp(_mpEntity: EntityMp | null | undefined): IEntity | null {
    return rockSandboxNotImplemented("client", "RockSandboxEntityPoolRouter.resolveFromMp");
  }
}
