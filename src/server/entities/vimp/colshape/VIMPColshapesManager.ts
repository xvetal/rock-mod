import {
  type ICircleColshapeCreateOptions,
  type IColshapesManager,
  type ICuboidColshapeCreateOptions,
  type ICylinderColshapeCreateOptions,
  type IRectangleColshapeCreateOptions,
  type ISphereColshapeCreateOptions,
} from "../../common/colshape/IColshapesManager";
import { VIMPWorldObjectsManager } from "../worldObject/VIMPWorldObjectsManager";
import { type VIMPColshape } from "./VIMPColshape";
import { VIMPCircleColshape } from "./VIMPCircleColshape";
import { VIMPCuboidColshape } from "./VIMPCuboidColshape";
import { VIMPCylinderColshape } from "./VIMPCylinderColshape";
import { type VIMPRectangleColshape } from "./VIMPRectangleColshape";
import { VIMPSphereColshape } from "./VIMPSphereColshape";
import { type VIMPPlayer } from "../player/VIMPPlayer";
import { RockMod } from "../../../RockMod";
import { ServerInternalEventName } from "../../../net/common/events/types";

export interface IVIMPCircleColshapeCreateOptions extends ICircleColshapeCreateOptions {}

export interface IVIMPCuboidColshapeCreateOptions extends ICuboidColshapeCreateOptions {}

export interface IVIMPCylinderColshapeCreateOptions extends ICylinderColshapeCreateOptions {}

export interface IVIMPRectangleColshapeCreateOptions extends IRectangleColshapeCreateOptions {}

export interface IVIMPSphereColshapeCreateOptions extends ISphereColshapeCreateOptions {}

export class VIMPColshapesManager extends VIMPWorldObjectsManager<VIMPColshape> implements IColshapesManager {
  public constructor() {
    super({
      baseObjectsType: "colshape",
    });

    vimp.on("playerEnterColshape", (vimpPlayer, vimpColshape) => {
      if (!vimpColshape) return;
      const colshape = this.findByID(vimpColshape.id);
      if (!colshape) return;
      const player = RockMod.instance.players.findByID(vimpPlayer.id) as VIMPPlayer | null;
      if (!player) return;
      RockMod.instance.net.events.emitInternal(ServerInternalEventName.PlayerEnteredColshape, player, colshape);
    });
    vimp.on("playerExitColshape", (vimpPlayer, vimpColshape) => {
      if (!vimpColshape) return;
      const colshape = this.findByID(vimpColshape.id);
      if (!colshape) return;
      const player = RockMod.instance.players.findByID(vimpPlayer.id) as VIMPPlayer | null;
      if (!player) return;
      RockMod.instance.net.events.emitInternal(ServerInternalEventName.PlayerLeftColshape, player, colshape);
    });
  }

  public createCircle(options: IVIMPCircleColshapeCreateOptions): VIMPCircleColshape {
    const { position, range, dimension, key } = options;
    const extras = key === undefined ? { dimension } : { dimension, key };

    const vimpColshape = vimp.colshapes.createCircle(position.x, position.y, position.z, range, extras);
    if (!vimpColshape) {
      throw new Error("VIMPColshapesManager.createCircle: vimp.colshapes.createCircle failed (server full?)");
    }

    const colshape = new VIMPCircleColshape({
      vimpColshape,
      onDestroy: (c): void => this.unregisterBaseObject(c),
    });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCuboid(options: IVIMPCuboidColshapeCreateOptions): VIMPCuboidColshape {
    const { position, width, depth, height, dimension, key } = options;
    const extras = key === undefined ? { dimension } : { dimension, key };

    // VIMP cube uses HALF-extents (centered at position); rock-mod options describe full sizes.
    const vimpColshape = vimp.colshapes.createCube(
      position.x,
      position.y,
      position.z,
      width / 2,
      depth / 2,
      height / 2,
      extras,
    );
    if (!vimpColshape) {
      throw new Error("VIMPColshapesManager.createCuboid: vimp.colshapes.createCube failed (server full?)");
    }

    const colshape = new VIMPCuboidColshape({
      vimpColshape,
      onDestroy: (c): void => this.unregisterBaseObject(c),
    });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCylinder(options: IVIMPCylinderColshapeCreateOptions): VIMPCylinderColshape {
    const { position, range, height, dimension, key } = options;
    const extras = key === undefined ? { dimension } : { dimension, key };

    const vimpColshape = vimp.colshapes.createCylinder(position.x, position.y, position.z, range, height, extras);
    if (!vimpColshape) {
      throw new Error("VIMPColshapesManager.createCylinder: vimp.colshapes.createCylinder failed (server full?)");
    }

    const colshape = new VIMPCylinderColshape({
      vimpColshape,
      onDestroy: (c): void => this.unregisterBaseObject(c),
    });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createRectangle(_options: IVIMPRectangleColshapeCreateOptions): VIMPRectangleColshape {
    throw new Error("VIMPColshapesManager.createRectangle: not supported by VIMP");
  }

  public createSphere(options: IVIMPSphereColshapeCreateOptions): VIMPSphereColshape {
    const { position, range, dimension, key } = options;
    const extras = key === undefined ? { dimension } : { dimension, key };

    const vimpColshape = vimp.colshapes.createSphere(position.x, position.y, position.z, range, extras);
    if (!vimpColshape) {
      throw new Error("VIMPColshapesManager.createSphere: vimp.colshapes.createSphere failed (server full?)");
    }

    const colshape = new VIMPSphereColshape({
      vimpColshape,
      onDestroy: (c): void => this.unregisterBaseObject(c),
    });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public getParticipants(colshape: VIMPColshape): Set<VIMPPlayer> {
    const participants = new Set<VIMPPlayer>();
    for (const vimpPlayer of colshape.playersInside) {
      const player = RockMod.instance.players.findByID(vimpPlayer.id) as VIMPPlayer | null;
      if (player) {
        participants.add(player);
      }
    }
    return participants;
  }
}
