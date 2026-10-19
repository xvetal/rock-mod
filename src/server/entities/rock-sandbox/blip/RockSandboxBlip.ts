import { type IBlip } from "../../common/blip/IBlip";
import { type IBlipColor, type IBlipSprite } from "../../../../shared";
import { RockSandboxWorldObject } from "../worldObject/RockSandboxWorldObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxBlip extends RockSandboxWorldObject implements IBlip {
  public get name(): string {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.name");
  }

  public get sprite(): IBlipSprite {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.sprite");
  }

  public get color(): number {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.color");
  }

  public get alpha(): number {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.alpha");
  }

  public get scale(): number {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.scale");
  }

  public get drawDistance(): number {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.drawDistance");
  }

  public get global(): boolean {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.global");
  }

  public get shortRange(): boolean {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.shortRange");
  }

  public get rotation(): number {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.rotation");
  }

  public override get dimension(): number {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.dimension");
  }

  public setName(_value: string): void {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.setName");
  }

  public setSprite(_value: IBlipSprite): void {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.setSprite");
  }

  public setColor(_value: IBlipColor): void {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.setColor");
  }

  public setAlpha(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxBlip.setAlpha");
  }
}
