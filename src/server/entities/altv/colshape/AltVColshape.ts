import { AltVWorldObject, IAltVWorldObjectOptions } from "../worldObject/AltVWorldObject";
import Colshape = AltVServer.Colshape;

export interface IAltVColshapeOptions extends IAltVWorldObjectOptions<Colshape> {}

export abstract class AltVColshape extends AltVWorldObject<Colshape> {
  protected constructor(options: IAltVColshapeOptions) {
    super(options);
  }
}
