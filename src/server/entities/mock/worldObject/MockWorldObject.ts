import { IWorldObject } from "../../common/worldObject/IWorldObject";
import { MockBaseObject, IMockBaseObjectOptions } from "../baseObject/MockBaseObject";
import { IVector3D } from "../../../common/utils/math/Vectors";

export interface IMockWorldObjectOptions extends IMockBaseObjectOptions {
  position: IVector3D;
  dimension: number;
}

export abstract class MockWorldObject extends MockBaseObject implements IWorldObject {
  protected constructor(options: IMockWorldObjectOptions) {
    super(options);
  }

  public setPosition(value: IVector3D): void {
    (this.position as IVector3D) = value;
  }

  public setDimension(value: number): void {
    (this.dimension as number) = value;
  }
}
