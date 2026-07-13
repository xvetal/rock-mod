import {
  type ICircleColshapeCreateOptions,
  type IColshapesManager,
  type ICuboidColshapeCreateOptions,
  type ICylinderColshapeCreateOptions,
  type IRectangleColshapeCreateOptions,
  type ISphereColshapeCreateOptions,
} from "../../common";
import { AltVWorldObjectsManager } from "../worldObject/AltVWorldObjectsManager";
import { type AltVColshape } from "./AltVColshape";
import { AltVCircleColshape } from "./AltVCircleColshape";
import { AltVCuboidColshape } from "./AltVCuboidColshape";
import { AltVCylinderColshape } from "./AltVCylinderColshape";
import { AltVRectangleColshape } from "./AltVRectangleColshape";
import { AltVSphereColshape } from "./AltVSphereColshape";
import { RockMod } from "../../../RockMod";
import { ServerInternalEventName } from "../../../net/common/events/types";
import { type AltVPlayer } from "../player/AltVPlayer";
import ColshapeCircle = AltVServer.ColshapeCircle;
import ColshapeCuboid = AltVServer.ColshapeCuboid;
import ColshapeCylinder = AltVServer.ColshapeCylinder;
import ColshapeRectangle = AltVServer.ColshapeRectangle;
import ColshapeSphere = AltVServer.ColshapeSphere;
import BaseObjectType = AltVShared.BaseObjectType;

export interface IAltVCircleColshapeCreateOptions extends ICircleColshapeCreateOptions {}

export interface IAltVCuboidColshapeCreateOptions extends ICuboidColshapeCreateOptions {}

export interface IAltVCylinderColshapeCreateOptions extends ICylinderColshapeCreateOptions {}

export interface IAltVRectangleColshapeCreateOptions extends IRectangleColshapeCreateOptions {}

export interface IAltVSphereColshapeCreateOptions extends ISphereColshapeCreateOptions {}

export class AltVColshapesManager extends AltVWorldObjectsManager<AltVColshape> implements IColshapesManager {
  private readonly _colshapesParticipants = new Map<AltVColshape, Set<AltVPlayer>>();

  public constructor() {
    super({
      baseObjectsType: "colshape",
    });

    AltVServer.on("entityEnterColshape", (mpColshape, mpEntity) => {
      if (mpEntity.type === BaseObjectType.Player) {
        const player = RockMod.instance.players.getByID(mpEntity.id) as AltVPlayer;
        const colshape = this.getByID(mpColshape.id);
        const participants = this.getParticipants(colshape);

        participants.add(player);
        RockMod.instance.net.events.emitInternal(ServerInternalEventName.PlayerEnteredColshape, player, colshape);
      }
    });
    AltVServer.on("entityLeaveColshape", (mpColshape, mpEntity) => {
      if (mpEntity.type === BaseObjectType.Player) {
        const player = RockMod.instance.players.getByID(mpEntity.id) as AltVPlayer;
        const colshape = this.getByID(mpColshape.id);
        const participants = this.getParticipants(colshape);

        participants.delete(player);
        RockMod.instance.net.events.emitInternal(ServerInternalEventName.PlayerLeftColshape, player, colshape);
      }
    });
  }

  public createCircle(options: IAltVCircleColshapeCreateOptions): AltVCircleColshape {
    const { range, position, dimension, key } = options;
    const { x, y } = position;

    const mpEntity = new ColshapeCircle(x, y, range);
    mpEntity.dimension = dimension;

    const colshape = new AltVCircleColshape({ mpEntity });
    if (key !== undefined) colshape.setNetData("key", key);
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCuboid(options: IAltVCuboidColshapeCreateOptions): AltVCuboidColshape {
    const { width, depth, height, position, dimension, key } = options;
    const { x, y, z } = position;

    const mpEntity = new ColshapeCuboid(x, y, z, x + width, y + depth, z + height);
    mpEntity.dimension = dimension;

    const colshape = new AltVCuboidColshape({ mpEntity });
    if (key !== undefined) colshape.setNetData("key", key);
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCylinder(options: IAltVCylinderColshapeCreateOptions): AltVCylinderColshape {
    const { height, range, position, dimension, key } = options;
    const { x, y, z } = position;

    const mpEntity = new ColshapeCylinder(x, y, z, range, height);
    mpEntity.dimension = dimension;

    const colshape = new AltVCylinderColshape({ mpEntity });
    if (key !== undefined) colshape.setNetData("key", key);
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createRectangle(options: IAltVRectangleColshapeCreateOptions): AltVRectangleColshape {
    const { width, height, position, dimension, key } = options;
    const { x, y } = position;

    const mpEntity = new ColshapeRectangle(x, y, x + width, y + height);
    mpEntity.dimension = dimension;

    const colshape = new AltVRectangleColshape({ mpEntity });
    if (key !== undefined) colshape.setNetData("key", key);
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createSphere(options: IAltVSphereColshapeCreateOptions): AltVSphereColshape {
    const { range, position, dimension, key } = options;
    const { x, y, z } = position;

    const mpEntity = new ColshapeSphere(x, y, z, range);
    mpEntity.dimension = dimension;

    const colshape = new AltVSphereColshape({ mpEntity });
    if (key !== undefined) colshape.setNetData("key", key);
    this.registerBaseObject(colshape);

    return colshape;
  }

  public getParticipants(colshape: AltVColshape): Set<AltVPlayer> {
    let participants = this._colshapesParticipants.get(colshape);
    if (!participants) {
      participants = new Set();
      this._colshapesParticipants.set(colshape, participants);
    }
    return participants;
  }
}
