import { IMarker } from "../../common/marker/IMarker";
import { MockWorldObject, IMockWorldObjectOptions } from "../worldObject/MockWorldObject";
import { IRGBA, IVector3D, RGBA, Vector3D } from "../../../../shared/common/utils";
import { IMarkerType } from "../../../../shared";

export interface IMockMarkerOptions extends IMockWorldObjectOptions {
  markerType?: IMarkerType;
  scale?: number;
  color?: IRGBA;
  rotation?: IVector3D;
}

export class MockMarker extends MockWorldObject implements IMarker {
  private _markerType: number;

  private _visible: boolean;

  private _scale: number;

  private _color: IRGBA;

  private _rotation: IVector3D;

  public get markerType(): IMarkerType {
    return this._markerType;
  }

  public get visible(): boolean {
    return this._visible;
  }

  public get scale(): number {
    return this._scale;
  }

  public get color(): IRGBA {
    return this._color;
  }

  public get rotation(): IVector3D {
    return this._rotation;
  }

  public constructor(options: IMockMarkerOptions) {
    super(options);

    const {
      markerType = IMarkerType.MarkerArrow,
      scale = 1,
      color = new RGBA(255, 255, 255),
      rotation = new Vector3D(0, 0, 0),
    } = options;

    this._markerType = markerType;
    this._visible = true;
    this._scale = scale;
    this._color = color;
    this._rotation = rotation;
  }

  public setVisible(value: boolean): void {
    this._visible = value;
  }

  public setScale(scale: number): void {
    this._scale = scale;
  }

  public setColor(color: IRGBA): void {
    this._color = color;
  }

  public setRotation(value: IVector3D): void {
    this._rotation = value;
  }
}
