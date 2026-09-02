import { type ICCMPColshapeOptions, CCMPColshape } from "./VIMPColshape";
import { type ICuboidColshape } from "../../common/colshape/ICuboidColshape";

export interface ICCMPCuboidColshapeOptions extends ICCMPColshapeOptions {}

export class CCMPCuboidColshape extends CCMPColshape implements ICuboidColshape {
  public constructor(options: ICCMPCuboidColshapeOptions) {
    super(options);
  }
}
