import { type IWorldObject } from "../../common/worldObject/IWorldObject";
import { CCMPBaseObject } from "../baseObject/CCMPBaseObject";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";

export abstract class CCMPWorldObject extends CCMPBaseObject implements IWorldObject {
  public abstract get position(): IVector3D;

  public abstract get dimension(): number;

  public abstract setPosition(value: IVector3D): void;

  public abstract setDimension(value: number): void;
}
