import { type IVector3D } from "@shared/common/utils";

export interface IUiManager {
  getStreetNameFromHashKey(hash: number): string;
  getLabelText(labelName: string): string;
  hideHudComponentThisFrame(componentIndex: number): void;
  displayRadar(display: boolean): void;
  setPauseMenuActive(toggle: boolean): void;
  setWaypoint(x: number, y: number): void;
  deleteWaypoint(): void;
  getBlipInfoIdCoord(blip: number): IVector3D;
}
