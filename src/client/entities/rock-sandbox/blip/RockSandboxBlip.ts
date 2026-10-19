import { type IBlip } from "../../common/blip/IBlip";
import { type IBlipColor, type IBlipSprite } from "../../../../shared/entities";
import { RockSandboxWorldObject } from "../worldObject/RockSandboxWorldObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxBlip extends RockSandboxWorldObject implements IBlip {
  public get name(): string {
    return rockSandboxNotImplemented("client", "RockSandboxBlip.name");
  }

  public get sprite(): IBlipSprite {
    return rockSandboxNotImplemented("client", "RockSandboxBlip.sprite");
  }

  public get color(): number {
    return rockSandboxNotImplemented("client", "RockSandboxBlip.color");
  }

  public get alpha(): number {
    return rockSandboxNotImplemented("client", "RockSandboxBlip.alpha");
  }

  public get global(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxBlip.global");
  }

  public get shortRange(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxBlip.shortRange");
  }

  public setSprite(_value: IBlipSprite): void {
    return rockSandboxNotImplemented("client", "RockSandboxBlip.setSprite");
  }

  public setColor(_value: IBlipColor): void {
    return rockSandboxNotImplemented("client", "RockSandboxBlip.setColor");
  }

  public setAlpha(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxBlip.setAlpha");
  }

  public setShowHeadingIndicator(_value: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxBlip.setShowHeadingIndicator");
  }

  public setRotation(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxBlip.setRotation");
  }
}
