export interface IControlsManager {
  disableControlAction(padIndex: number, control: number, disable: boolean): void;
  isDisabledControlPressed(padIndex: number, control: number): boolean;
  isDisabledControlJustPressed(padIndex: number, control: number): boolean;
  isControlPressed(padIndex: number, control: number): boolean;
  isControlJustPressed(padIndex: number, control: number): boolean;
  isControlJustReleased(padIndex: number, control: number): boolean;
  getDisabledControlNormal(padIndex: number, control: number): number;
}
