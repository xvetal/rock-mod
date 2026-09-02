import { type IVIMPColshapeOptions, VIMPColshape } from "./VIMPColshape";
import { type ICircleColshape } from "../../common/colshape/ICircleColshape";

export interface IVIMPCircleColshapeOptions extends IVIMPColshapeOptions {}

export class VIMPCircleColshape extends VIMPColshape implements ICircleColshape {
  public constructor(options: IVIMPCircleColshapeOptions) {
    super(options);
  }
}
