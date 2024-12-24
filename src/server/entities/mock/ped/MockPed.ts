import { type IPed } from "../../common/ped/IPed";
import { MockEntity, type IMockEntityOptions } from "../entity/MockEntity";

export interface IMockPedOptions extends IMockEntityOptions {}

export class MockPed extends MockEntity implements IPed {
  public constructor(options: IMockPedOptions) {
    super(options);
  }
}
