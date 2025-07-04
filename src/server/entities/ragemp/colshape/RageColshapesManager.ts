import { RageWorldObjectsManager } from "../worldObject/RageWorldObjectsManager";
import { type RageColshape } from "./RageColshape";
import {
  type ICircleColshapeCreateOptions,
  type IColshapesManager,
  type ICuboidColshapeCreateOptions,
  type ICylinderColshapeCreateOptions,
  type IRectangleColshapeCreateOptions,
  type ISphereColshapeCreateOptions,
} from "../../common";
import { RageCircleColshape } from "./RageCircleColshape";
import { RageCuboidColshape } from "./RageCuboidColshape";
import { RageCylinderColshape } from "./RageCylinderColshape";
import { RageRectangleColshape } from "./RageRectangleColshape";
import { RageSphereColshape } from "./RageSphereColshape";
import { RockMod } from "../../../RockMod";
import { ServerInternalEventName } from "../../../net/common/events/types";
import { type RagePlayer } from "../player/RagePlayer";

export interface IRageCircleColshapeCreateOptions extends ICircleColshapeCreateOptions {}

export interface IRageCuboidColshapeCreateOptions extends ICuboidColshapeCreateOptions {}

export interface IRageCylinderColshapeCreateOptions extends ICylinderColshapeCreateOptions {}

export interface IRageRectangleColshapeCreateOptions extends IRectangleColshapeCreateOptions {}

export interface IRageSphereColshapeCreateOptions extends ISphereColshapeCreateOptions {}

export class RageColshapesManager extends RageWorldObjectsManager<RageColshape> implements IColshapesManager {
  private readonly _colshapesParticipants = new Map<RageColshape, Set<RagePlayer>>();

  public constructor() {
    super({
      baseObjectsType: "colshape",
    });

    mp.events.add("playerEnterColshape", (mpPlayer, mpColshape) => {
      const player = RockMod.instance.players.getByID(mpPlayer.id) as RagePlayer;
      const colshape = this.getByID(mpColshape.id);
      const participants = this.getParticipants(colshape);

      participants.add(player);
      RockMod.instance.net.events.emitInternal(ServerInternalEventName.PlayerEnteredColshape, player, colshape);
    });
    mp.events.add("playerExitColshape", (mpPlayer, mpColshape) => {
      const player = RockMod.instance.players.getByID(mpPlayer.id) as RagePlayer;
      const colshape = this.getByID(mpColshape.id);
      const participants = this.getParticipants(colshape);

      participants.delete(player);
      RockMod.instance.net.events.emitInternal(ServerInternalEventName.PlayerLeftColshape, player, colshape);
    });
  }

  public createCircle(options: IRageCircleColshapeCreateOptions): RageCircleColshape {
    const { range, position, dimension } = options;
    const { x, y } = position;

    const mpEntity = mp.colshapes.newCircle(x, y, range, dimension);
    mpEntity.isExists = (): boolean => mp.colshapes.exists(mpEntity);

    const colshape = new RageCircleColshape({ mpEntity, position });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCuboid(options: IRageCuboidColshapeCreateOptions): RageCuboidColshape {
    const { width, depth, height, position, dimension } = options;
    const { x, y, z } = position;

    const mpEntity = mp.colshapes.newCuboid(x, y, z, width, depth, height, dimension);
    mpEntity.isExists = (): boolean => mp.colshapes.exists(mpEntity);

    const colshape = new RageCuboidColshape({ mpEntity, position });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCylinder(options: IRageCylinderColshapeCreateOptions): RageCylinderColshape {
    const { height, range, position, dimension } = options;
    const { x, y, z } = position;

    const mpEntity = mp.colshapes.newTube(x, y, z, height, range, dimension);
    mpEntity.isExists = (): boolean => mp.colshapes.exists(mpEntity);

    const colshape = new RageCylinderColshape({ mpEntity, position });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createRectangle(options: IRageRectangleColshapeCreateOptions): RageRectangleColshape {
    const { width, height, position, dimension } = options;
    const { x, y } = position;

    const mpEntity = mp.colshapes.newRectangle(x, y, width, height, dimension);
    mpEntity.isExists = (): boolean => mp.colshapes.exists(mpEntity);

    const colshape = new RageRectangleColshape({ mpEntity, position });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createSphere(options: IRageSphereColshapeCreateOptions): RageSphereColshape {
    const { range, position, dimension } = options;
    const { x, y, z } = position;

    const mpEntity = mp.colshapes.newSphere(x, y, z, range, dimension);
    mpEntity.isExists = (): boolean => mp.colshapes.exists(mpEntity);

    const colshape = new RageSphereColshape({ mpEntity, position });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public getParticipants(colshape: RageColshape): Set<RagePlayer> {
    let participants = this._colshapesParticipants.get(colshape);
    if (!participants) {
      participants = new Set();
      this._colshapesParticipants.set(colshape, participants);
    }
    return participants;
  }
}
