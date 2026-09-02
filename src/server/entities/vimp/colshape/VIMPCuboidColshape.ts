import { type IVIMPColshapeOptions, VIMPColshape } from "./VIMPColshape";
import { type ICuboidColshape } from "../../common/colshape/ICuboidColshape";

export interface IVIMPCuboidColshapeOptions extends IVIMPColshapeOptions {}

export class VIMPCuboidColshape extends VIMPColshape implements ICuboidColshape {
  public constructor(options: IVIMPCuboidColshapeOptions) {
    super(options);
  }
}
