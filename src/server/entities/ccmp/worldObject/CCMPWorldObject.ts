import { type IWorldObject } from "../../common/worldObject/IWorldObject";
import { CCMPBaseObject } from "../baseObject/CCMPBaseObject";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export abstract class CCMPWorldObject extends CCMPBaseObject implements IWorldObject {
  public get position(): IVector3D {
    return notImplemented("CCMPWorldObject.position");
  }

  public get dimension(): number {
    return notImplemented("CCMPWorldObject.dimension");
  }

  public setPosition(_value: IVector3D): void {
    notImplemented("CCMPWorldObject.setPosition");
  }

  public setDimension(_value: number): void {
    notImplemented("CCMPWorldObject.setDimension");
  }
}
