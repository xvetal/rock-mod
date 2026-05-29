import { type IControlsManager } from "@RockMod/client/game";

export class RageControlsManager implements IControlsManager {
  public disableControlAction(padIndex: number, control: number, disable: boolean): void {
    mp.game.controls.disableControlAction(padIndex, control, disable);
  }

  public isDisabledControlPressed(padIndex: number, control: number): boolean {
    return mp.game.controls.isDisabledControlPressed(padIndex, control);
  }

  public isDisabledControlJustPressed(padIndex: number, control: number): boolean {
    return mp.game.controls.isDisabledControlJustPressed(padIndex, control);
  }

  public isControlPressed(padIndex: number, control: number): boolean {
    return mp.game.controls.isControlPressed(padIndex, control);
  }

  public isControlJustPressed(padIndex: number, control: number): boolean {
    return mp.game.controls.isControlJustPressed(padIndex, control);
  }

  public isControlJustReleased(padIndex: number, control: number): boolean {
    return mp.game.controls.isControlJustReleased(padIndex, control);
  }

  public getDisabledControlNormal(padIndex: number, control: number): number {
    return mp.game.controls.getDisabledControlNormal(padIndex, control);
  }
}
