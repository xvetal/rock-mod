import { IWorldObject, IWorldObjectOptions } from "../worldObject";

export interface IMarkerOptions extends IWorldObjectOptions {}

export interface IMarker extends IWorldObject {
  get visible(): boolean;
  get scale(): number;
  setVisible(value: boolean): void;
  setScale(value: number): void;
}
