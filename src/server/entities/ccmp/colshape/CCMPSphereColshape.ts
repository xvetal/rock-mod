import { type ICCMPColshapeOptions, CCMPColshape } from "./CCMPColshape";
import { type ISphereColshape } from "../../common/colshape/ISphereColshape";

export interface ICCMPSphereColshapeOptions extends ICCMPColshapeOptions {}

export class CCMPSphereColshape extends CCMPColshape implements ISphereColshape {
  public constructor(options: ICCMPSphereColshapeOptions) {
    super(options);
  }
}
