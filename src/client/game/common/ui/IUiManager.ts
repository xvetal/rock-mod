import { type IVector3D } from "@shared/common/utils";

export interface IRadarScreenBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface IUiManager {
  getRadarScreenBounds(): IRadarScreenBounds | null;
  getStreetNameFromHashKey(hash: number): string;
  getLabelText(labelName: string): string;
  hideHudComponentThisFrame(componentIndex: number): void;
  displayRadar(display: boolean): void;
  setPauseMenuActive(toggle: boolean): void;
  setWaypoint(x: number, y: number): void;
  deleteWaypoint(): void;
  getWaypointCoords(): IVector3D | null;
  getBlipInfoIdCoord(blip: number): IVector3D;
}
