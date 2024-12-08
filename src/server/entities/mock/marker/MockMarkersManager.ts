import { IMarkerCreateOptions, IMarkersManager } from "../../common/marker/IMarkersManager";
import { MockWorldObjectsManager } from "../worldObject/MockWorldObjectsManager";
import { MockMarker } from "./MockMarker";
import { BaseObjectType } from "../../common";

export interface IMockMarkerCreateOptions extends IMarkerCreateOptions {}

export class MockMarkersManager extends MockWorldObjectsManager<MockMarker> implements IMarkersManager {
  private _nextId: number;

  public constructor() {
    super({
      baseObjectsType: "marker",
    });
    this._nextId = 0;
  }

  public create(options: IMockMarkerCreateOptions): MockMarker {
    const { type, scale, color, position, dimension, rotation } = options;

    const marker = new MockMarker({
      id: this._nextId++,
      type: BaseObjectType.Marker,
      markerType: type,
      scale,
      color,
      position,
      dimension,
      rotation,
    });

    this.registerBaseObject(marker);

    return marker;
  }
}
