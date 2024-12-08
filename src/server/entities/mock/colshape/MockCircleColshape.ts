import { ICircleColshape } from "../../common";
import { IMockColshapeOptions, MockColshape } from "./MockColshape";

export interface IMockCircleColshapeCreateOptions extends IMockColshapeOptions {
  range: number;
}

export class MockCircleColshape extends MockColshape implements ICircleColshape {
  public constructor(options: IMockCircleColshapeCreateOptions) {
    super(options);
  }
}
