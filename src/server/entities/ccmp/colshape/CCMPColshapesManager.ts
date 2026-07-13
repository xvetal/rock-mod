import {
  type ICircleColshapeCreateOptions,
  type IColshapesManager,
  type ICuboidColshapeCreateOptions,
  type ICylinderColshapeCreateOptions,
  type IRectangleColshapeCreateOptions,
  type ISphereColshapeCreateOptions,
} from "../../common/colshape/IColshapesManager";
import { CCMPWorldObjectsManager } from "../worldObject/CCMPWorldObjectsManager";
import { type CCMPColshape } from "./CCMPColshape";
import { CCMPCircleColshape } from "./CCMPCircleColshape";
import { CCMPCuboidColshape } from "./CCMPCuboidColshape";
import { CCMPCylinderColshape } from "./CCMPCylinderColshape";
import { type CCMPRectangleColshape } from "./CCMPRectangleColshape";
import { CCMPSphereColshape } from "./CCMPSphereColshape";
import { type CCMPPlayer } from "../player/CCMPPlayer";
import { RockMod } from "../../../RockMod";
import { ServerInternalEventName } from "../../../net/common/events/types";

export interface ICCMPCircleColshapeCreateOptions extends ICircleColshapeCreateOptions {}

export interface ICCMPCuboidColshapeCreateOptions extends ICuboidColshapeCreateOptions {}

export interface ICCMPCylinderColshapeCreateOptions extends ICylinderColshapeCreateOptions {}

export interface ICCMPRectangleColshapeCreateOptions extends IRectangleColshapeCreateOptions {}

export interface ICCMPSphereColshapeCreateOptions extends ISphereColshapeCreateOptions {}

export class CCMPColshapesManager extends CCMPWorldObjectsManager<CCMPColshape> implements IColshapesManager {
  public constructor() {
    super({
      baseObjectsType: "colshape",
    });

    ccmp.on("playerEnterColshape", (ccmpPlayer, ccmpColshape) => {
      if (!ccmpColshape) return;
      const colshape = this.findByID(ccmpColshape.id);
      if (!colshape) return;
      const player = RockMod.instance.players.findByID(ccmpPlayer.id) as CCMPPlayer | null;
      if (!player) return;
      RockMod.instance.net.events.emitInternal(ServerInternalEventName.PlayerEnteredColshape, player, colshape);
    });
    ccmp.on("playerExitColshape", (ccmpPlayer, ccmpColshape) => {
      if (!ccmpColshape) return;
      const colshape = this.findByID(ccmpColshape.id);
      if (!colshape) return;
      const player = RockMod.instance.players.findByID(ccmpPlayer.id) as CCMPPlayer | null;
      if (!player) return;
      RockMod.instance.net.events.emitInternal(ServerInternalEventName.PlayerLeftColshape, player, colshape);
    });
  }

  public createCircle(options: ICCMPCircleColshapeCreateOptions): CCMPCircleColshape {
    const { position, range, dimension, key } = options;
    const extras = key === undefined ? { dimension } : { dimension, key };

    const ccmpColshape = ccmp.colshapes.createCircle(position.x, position.y, position.z, range, extras);
    if (!ccmpColshape) {
      throw new Error("CCMPColshapesManager.createCircle: ccmp.colshapes.createCircle failed (server full?)");
    }

    const colshape = new CCMPCircleColshape({
      ccmpColshape,
      onDestroy: (c): void => this.unregisterBaseObject(c),
    });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCuboid(options: ICCMPCuboidColshapeCreateOptions): CCMPCuboidColshape {
    const { position, width, depth, height, dimension, key } = options;
    const extras = key === undefined ? { dimension } : { dimension, key };

    // CCMP cube uses HALF-extents (centered at position); rock-mod options describe full sizes.
    const ccmpColshape = ccmp.colshapes.createCube(
      position.x,
      position.y,
      position.z,
      width / 2,
      depth / 2,
      height / 2,
      extras,
    );
    if (!ccmpColshape) {
      throw new Error("CCMPColshapesManager.createCuboid: ccmp.colshapes.createCube failed (server full?)");
    }

    const colshape = new CCMPCuboidColshape({
      ccmpColshape,
      onDestroy: (c): void => this.unregisterBaseObject(c),
    });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCylinder(options: ICCMPCylinderColshapeCreateOptions): CCMPCylinderColshape {
    const { position, range, height, dimension, key } = options;
    const extras = key === undefined ? { dimension } : { dimension, key };

    const ccmpColshape = ccmp.colshapes.createCylinder(position.x, position.y, position.z, range, height, extras);
    if (!ccmpColshape) {
      throw new Error("CCMPColshapesManager.createCylinder: ccmp.colshapes.createCylinder failed (server full?)");
    }

    const colshape = new CCMPCylinderColshape({
      ccmpColshape,
      onDestroy: (c): void => this.unregisterBaseObject(c),
    });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createRectangle(_options: ICCMPRectangleColshapeCreateOptions): CCMPRectangleColshape {
    throw new Error("CCMPColshapesManager.createRectangle: not supported by CCMP");
  }

  public createSphere(options: ICCMPSphereColshapeCreateOptions): CCMPSphereColshape {
    const { position, range, dimension, key } = options;
    const extras = key === undefined ? { dimension } : { dimension, key };

    const ccmpColshape = ccmp.colshapes.createSphere(position.x, position.y, position.z, range, extras);
    if (!ccmpColshape) {
      throw new Error("CCMPColshapesManager.createSphere: ccmp.colshapes.createSphere failed (server full?)");
    }

    const colshape = new CCMPSphereColshape({
      ccmpColshape,
      onDestroy: (c): void => this.unregisterBaseObject(c),
    });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public getParticipants(colshape: CCMPColshape): Set<CCMPPlayer> {
    const participants = new Set<CCMPPlayer>();
    for (const ccmpPlayer of colshape.playersInside) {
      const player = RockMod.instance.players.findByID(ccmpPlayer.id) as CCMPPlayer | null;
      if (player) {
        participants.add(player);
      }
    }
    return participants;
  }
}
