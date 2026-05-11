import { type ICCMPColshapeOptions, CCMPColshape } from "./CCMPColshape";
import { type IRectangleColshape } from "../../common/colshape/IRectangleColshape";

export interface ICCMPRectangleColshapeOptions extends ICCMPColshapeOptions {}

export class CCMPRectangleColshape extends CCMPColshape implements IRectangleColshape {
  public constructor(options: ICCMPRectangleColshapeOptions) {
    super(options);
  }
}
