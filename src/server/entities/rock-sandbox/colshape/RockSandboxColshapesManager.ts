import {
  type IColshapesManager,
  type ICircleColshapeCreateOptions,
  type ICuboidColshapeCreateOptions,
  type ICylinderColshapeCreateOptions,
  type IRectangleColshapeCreateOptions,
  type ISphereColshapeCreateOptions,
} from "../../common/colshape/IColshapesManager";
import { type IColshape } from "../../common/colshape/IColshape";
import { type ICircleColshape } from "../../common/colshape/ICircleColshape";
import { type ICuboidColshape } from "../../common/colshape/ICuboidColshape";
import { type ICylinderColshape } from "../../common/colshape/ICylinderColshape";
import { type IRectangleColshape } from "../../common/colshape/IRectangleColshape";
import { type ISphereColshape } from "../../common/colshape/ISphereColshape";
import { type IPlayer } from "../../common/player";
import { RockSandboxWorldObjectsManager } from "../worldObject/RockSandboxWorldObjectsManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapColshape } from "./RockSandboxCylinderColshape";
import { wrapPlayer } from "../player/RockSandboxPlayer";
import { RockSandboxColshapesIterator } from "./RockSandboxColshapesIterator";

export class RockSandboxColshapesManager
  extends RockSandboxWorldObjectsManager<IColshape>
  implements IColshapesManager
{
  private readonly _colshapesIterator = new RockSandboxColshapesIterator();

  public override get iterator(): RockSandboxColshapesIterator {
    return this._colshapesIterator;
  }

  public override findByID(id: number): IColshape | null {
    const colshape = getRockSandbox().colshapes.getById(id);
    return colshape === null ? null : wrapColshape(colshape);
  }

  public override getByID(id: number): IColshape {
    const colshape = this.findByID(id);
    if (colshape === null)
      throw new Error(`[RockSandbox:server] RockSandboxColshapesManager.getByID: colshape ${id} not found`);
    return colshape;
  }

  public createCircle(_options: ICircleColshapeCreateOptions): ICircleColshape {
    return rockSandboxNotImplemented("server", "RockSandboxColshapesManager.createCircle");
  }

  public createCuboid(_options: ICuboidColshapeCreateOptions): ICuboidColshape {
    return rockSandboxNotImplemented("server", "RockSandboxColshapesManager.createCuboid");
  }

  public createCylinder(options: ICylinderColshapeCreateOptions): ICylinderColshape {
    return wrapColshape(
      getRockSandbox().colshapes.createCylinder({
        position: { x: options.position.x, y: options.position.z, z: -options.position.y },
        radius: options.range,
        height: options.height,
        dimension: options.dimension,
        key: options.key,
      }),
    );
  }

  public createRectangle(_options: IRectangleColshapeCreateOptions): IRectangleColshape {
    return rockSandboxNotImplemented("server", "RockSandboxColshapesManager.createRectangle");
  }

  public createSphere(_options: ISphereColshapeCreateOptions): ISphereColshape {
    return rockSandboxNotImplemented("server", "RockSandboxColshapesManager.createSphere");
  }

  public getParticipants(colshape: IColshape): Set<IPlayer> {
    const native = getRockSandbox().colshapes.getById(colshape.id);
    if (native === null)
      throw new Error(
        `[RockSandbox:server] RockSandboxColshapesManager.getParticipants: colshape ${colshape.id} not found`,
      );
    return new Set(native.playersInside.map(wrapPlayer));
  }
}
