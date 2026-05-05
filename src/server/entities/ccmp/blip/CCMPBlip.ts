import { CCMPWorldObject } from "../worldObject/CCMPWorldObject";
import { type IBlip } from "../../common/blip/IBlip";
import { type IBlipColor, type IBlipSprite } from "../../../../shared";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPBlip extends CCMPWorldObject implements IBlip {
  public get name(): string {
    return notImplemented("CCMPBlip.name");
  }

  public get sprite(): IBlipSprite {
    return notImplemented("CCMPBlip.sprite");
  }

  public get color(): number {
    return notImplemented("CCMPBlip.color");
  }

  public get alpha(): number {
    return notImplemented("CCMPBlip.alpha");
  }

  public get scale(): number {
    return notImplemented("CCMPBlip.scale");
  }

  public get drawDistance(): number {
    return notImplemented("CCMPBlip.drawDistance");
  }

  public get shortRange(): boolean {
    return notImplemented("CCMPBlip.shortRange");
  }

  public get rotation(): number {
    return notImplemented("CCMPBlip.rotation");
  }

  public setName(_value: string): void {
    notImplemented("CCMPBlip.setName");
  }

  public setSprite(_value: IBlipSprite): void {
    notImplemented("CCMPBlip.setSprite");
  }

  public setColor(_value: IBlipColor): void {
    notImplemented("CCMPBlip.setColor");
  }

  public setAlpha(_value: number): void {
    notImplemented("CCMPBlip.setAlpha");
  }
}
