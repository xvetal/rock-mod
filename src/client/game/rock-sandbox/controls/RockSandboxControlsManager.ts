import { type IControlsManager } from "../../common/controls/IControlsManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxControlsManager implements IControlsManager {
  public disableControlAction(padIndex: number, control: number, disable: boolean): void {
    getRockSandbox().controls.disableControlAction(padIndex, control, disable);
  }

  public isDisabledControlPressed(padIndex: number, control: number): boolean {
    return getRockSandbox().controls.isDisabledControlPressed(padIndex, control);
  }

  public isDisabledControlJustPressed(padIndex: number, control: number): boolean {
    return getRockSandbox().controls.isDisabledControlJustPressed(padIndex, control);
  }

  public isControlPressed(padIndex: number, control: number): boolean {
    return getRockSandbox().controls.isControlPressed(padIndex, control);
  }

  public isControlJustPressed(padIndex: number, control: number): boolean {
    return getRockSandbox().controls.isControlJustPressed(padIndex, control);
  }

  public isControlJustReleased(padIndex: number, control: number): boolean {
    return getRockSandbox().controls.isControlJustReleased(padIndex, control);
  }

  public getDisabledControlNormal(padIndex: number, control: number): number {
    return getRockSandbox().controls.getDisabledControlNormal(padIndex, control);
  }
}
