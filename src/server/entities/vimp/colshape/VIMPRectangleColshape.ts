import { type ICCMPColshapeOptions, CCMPColshape } from "./VIMPColshape";
import { type IRectangleColshape } from "../../common/colshape/IRectangleColshape";

export interface ICCMPRectangleColshapeOptions extends ICCMPColshapeOptions {}

export class CCMPRectangleColshape extends CCMPColshape implements IRectangleColshape {
  public constructor(options: ICCMPRectangleColshapeOptions) {
    super(options);
  }
}
