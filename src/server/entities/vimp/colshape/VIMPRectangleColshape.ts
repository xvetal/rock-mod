import { type IVIMPColshapeOptions, VIMPColshape } from "./VIMPColshape";
import { type IRectangleColshape } from "../../common/colshape/IRectangleColshape";

export interface IVIMPRectangleColshapeOptions extends IVIMPColshapeOptions {}

export class VIMPRectangleColshape extends VIMPColshape implements IRectangleColshape {
  public constructor(options: IVIMPRectangleColshapeOptions) {
    super(options);
  }
}
