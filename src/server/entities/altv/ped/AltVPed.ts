import { AltVEntity, IAltVEntityOptions } from "../entity/AltVEntity";
import Ped = AltVServer.Ped;
import { IPed } from "../../common";

export interface IAltVPedOptions extends IAltVEntityOptions<Ped> {}

export class AltVPed extends AltVEntity<Ped> implements IPed {
  public constructor(options: IAltVPedOptions) {
    super(options);
  }
}
