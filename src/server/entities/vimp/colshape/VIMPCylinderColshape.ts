import { type ICCMPColshapeOptions, CCMPColshape } from "./VIMPColshape";
import { type ICylinderColshape } from "../../common/colshape/ICylinderColshape";

export interface ICCMPCylinderColshapeOptions extends ICCMPColshapeOptions {}

export class CCMPCylinderColshape extends CCMPColshape implements ICylinderColshape {
  public constructor(options: ICCMPCylinderColshapeOptions) {
    super(options);
  }
}
