import { type IVIMPColshapeOptions, VIMPColshape } from "./VIMPColshape";
import { type ISphereColshape } from "../../common/colshape/ISphereColshape";

export interface IVIMPSphereColshapeOptions extends IVIMPColshapeOptions {}

export class VIMPSphereColshape extends VIMPColshape implements ISphereColshape {
  public constructor(options: IVIMPSphereColshapeOptions) {
    super(options);
  }
}
