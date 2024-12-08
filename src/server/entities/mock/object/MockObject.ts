import { IObject } from "../../common/object/IObject";
import { MockEntity, IMockEntityOptions } from "../entity/MockEntity";

export interface IMockObjectOptions extends IMockEntityOptions {
  alpha?: number;
}

export class MockObject extends MockEntity implements IObject {
  private _alpha: number;

  public get alpha(): number {
    return this._alpha;
  }

  public constructor(options: IMockObjectOptions) {
    super(options);

    const { alpha = 255 } = options;

    this._alpha = alpha;
  }

  public setAlpha(alpha: number): void {
    this._alpha = alpha;
  }
}
