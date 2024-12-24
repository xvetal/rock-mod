import { type IWorldObject } from "../../common/worldObject/IWorldObject";
import { MockBaseObject, type IMockBaseObjectOptions } from "../baseObject/MockBaseObject";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";

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
