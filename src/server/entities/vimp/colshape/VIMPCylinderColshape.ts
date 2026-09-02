import { type IVIMPColshapeOptions, VIMPColshape } from "./VIMPColshape";
import { type ICylinderColshape } from "../../common/colshape/ICylinderColshape";

export interface IVIMPCylinderColshapeOptions extends IVIMPColshapeOptions {}

export class VIMPCylinderColshape extends VIMPColshape implements ICylinderColshape {
  public constructor(options: IVIMPCylinderColshapeOptions) {
    super(options);
  }
}
