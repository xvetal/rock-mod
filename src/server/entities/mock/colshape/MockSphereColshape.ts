import { ISphereColshape } from "../../common";
import { IMockColshapeOptions, MockColshape } from "./MockColshape";

export interface IMockSphereColshapeCreateOptions extends IMockColshapeOptions {
  range: number;
}

export class MockSphereColshape extends MockColshape implements ISphereColshape {
  public constructor(options: IMockSphereColshapeCreateOptions) {
    super(options);
  }
}
