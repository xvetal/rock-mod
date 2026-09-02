import { type ICCMPColshapeOptions, CCMPColshape } from "./VIMPColshape";
import { type ICircleColshape } from "../../common/colshape/ICircleColshape";

export interface ICCMPCircleColshapeOptions extends ICCMPColshapeOptions {}

export class CCMPCircleColshape extends CCMPColshape implements ICircleColshape {
  public constructor(options: ICCMPCircleColshapeOptions) {
    super(options);
  }
}
