import { CCMPEntity } from "../entity/CCMPEntity";
import { type IObject } from "../../common/object/IObject";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPObject extends CCMPEntity implements IObject {
  public get alpha(): number {
    return notImplemented("CCMPObject.alpha");
  }

  public setAlpha(_value: number): void {
    notImplemented("CCMPObject.setAlpha");
  }
}
