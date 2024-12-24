import { type ICuboidColshape } from "../../common";
import { type IMockColshapeOptions, MockColshape } from "./MockColshape";

export interface IMockCuboidColshapeCreateOptions extends IMockColshapeOptions {
  width: number;
  depth: number;
  height: number;
}

export class MockCuboidColshape extends MockColshape implements ICuboidColshape {
  public constructor(options: IMockCuboidColshapeCreateOptions) {
    super(options);
  }
}
