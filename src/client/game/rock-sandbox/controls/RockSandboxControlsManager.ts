import { type IControlsManager } from "../../common/controls/IControlsManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxControlsManager implements IControlsManager {
  public disableControlAction(_padIndex: number, _control: number, _disable: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxControlsManager.disableControlAction");
  }

  public isDisabledControlPressed(_padIndex: number, _control: number): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxControlsManager.isDisabledControlPressed");
  }

  public isDisabledControlJustPressed(_padIndex: number, _control: number): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxControlsManager.isDisabledControlJustPressed");
  }

  public isControlPressed(_padIndex: number, _control: number): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxControlsManager.isControlPressed");
  }

  public isControlJustPressed(_padIndex: number, _control: number): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxControlsManager.isControlJustPressed");
  }

  public isControlJustReleased(_padIndex: number, _control: number): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxControlsManager.isControlJustReleased");
  }

  public getDisabledControlNormal(_padIndex: number, _control: number): number {
    return rockSandboxNotImplemented("client", "RockSandboxControlsManager.getDisabledControlNormal");
  }
}
