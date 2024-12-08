import { IColshape } from "../../common/colshape/IColshape";
import { MockWorldObject, IMockWorldObjectOptions } from "../worldObject/MockWorldObject";

export interface IMockColshapeOptions extends IMockWorldObjectOptions {}

export abstract class MockColshape extends MockWorldObject implements IColshape {
  protected constructor(options: IMockColshapeOptions) {
    super(options);
  }
}
