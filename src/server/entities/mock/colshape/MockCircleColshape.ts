import { type ICircleColshape } from "../../common";
import { type IMockColshapeOptions, MockColshape } from "./MockColshape";

export interface IMockCircleColshapeCreateOptions extends IMockColshapeOptions {
  range: number;
}

export class MockCircleColshape extends MockColshape implements ICircleColshape {
  public constructor(options: IMockCircleColshapeCreateOptions) {
    super(options);
  }
}
