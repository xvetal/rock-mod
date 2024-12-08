import { ICylinderColshape } from "../../common";
import { IMockColshapeOptions, MockColshape } from "./MockColshape";

export interface IMockCylinderColshapeCreateOptions extends IMockColshapeOptions {
  height: number;
  range: number;
}

export class MockCylinderColshape extends MockColshape implements ICylinderColshape {
  public constructor(options: IMockCylinderColshapeCreateOptions) {
    super(options);
  }
}
