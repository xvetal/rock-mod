import { type IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { type IVector3D } from "../../../../shared";

export interface IRageColshapeOptions extends IRageWorldObjectOptions<ColshapeMp> {
  position: IVector3D;
}

export abstract class RageColshape extends RageWorldObject<ColshapeMp> {
  protected constructor(options: IRageColshapeOptions) {
    super(options);
  }

  public getNetData(name: string): unknown {
    return this.mpEntity.getVariable(name);
  }

  public setNetData(name: string, value: unknown): void {
    this.mpEntity.setVariable(name, value);
  }
}
