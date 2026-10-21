import { type IBlipsManager, type IBlipCreateOptions } from "../../common/blip/IBlipsManager";
import { type IBlip } from "../../common/blip/IBlip";
import { RockSandboxWorldObjectsManager } from "../worldObject/RockSandboxWorldObjectsManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapBlip } from "./RockSandboxBlip";
import { RockSandboxBlipsIterator } from "./RockSandboxBlipsIterator";
import { nativeColor, nativeIcon } from "./mapping";
export class RockSandboxBlipsManager extends RockSandboxWorldObjectsManager<IBlip> implements IBlipsManager {
  private readonly _blipsIterator = new RockSandboxBlipsIterator();

  public override get iterator(): RockSandboxBlipsIterator {
    return this._blipsIterator;
  }

  public override findByID(id: number): IBlip | null {
    const blip = getRockSandbox().blips.getById(id);
    return blip === null ? null : wrapBlip(blip);
  }

  public override getByID(id: number): IBlip {
    const blip = this.findByID(id);
    if (blip === null) throw new Error(`[RockSandbox:server] RockSandboxBlipsManager.getByID: blip ${id} not found`);
    return blip;
  }

  public create(options: IBlipCreateOptions): IBlip {
    return wrapBlip(
      getRockSandbox().blips.create({
        position: { x: options.position.x, y: options.position.z, z: -options.position.y },
        dimension: options.dimension,
        icon: nativeIcon(options.sprite),
        color: { ...nativeColor(options.color ?? 0), a: options.alpha },
        name: options.name,
        scale: options.scale,
        drawDistance: options.drawDistance,
        global: options.global,
        shortRange: options.shortRange,
        rotation: options.rotation,
      }),
    );
  }
}
