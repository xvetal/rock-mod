import { type IRectangleColshape } from "../../common";
import { type IMockColshapeOptions, MockColshape } from "./MockColshape";

export interface IMockRectangleColshapeCreateOptions extends IMockColshapeOptions {
  width: number;
  height: number;
}

export class MockRectangleColshape extends MockColshape implements IRectangleColshape {
  public constructor(options: IMockRectangleColshapeCreateOptions) {
    super(options);
  }
}
