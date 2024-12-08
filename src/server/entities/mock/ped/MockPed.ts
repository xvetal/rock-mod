import { IPed } from "../../common/ped/IPed";
import { MockEntity, IMockEntityOptions } from "../entity/MockEntity";

export interface IMockPedOptions extends IMockEntityOptions {}

export class MockPed extends MockEntity implements IPed {
  public constructor(options: IMockPedOptions) {
    super(options);
  }
}
