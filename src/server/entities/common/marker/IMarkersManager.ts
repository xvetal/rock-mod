import { IEntityCreateOptions } from "../entity";
import { IMarker } from "./IMarker";
import { IWorldObjectsManager } from "../worldObject";
import { IRGBA } from "../../../common/utils";

export enum IMarkerType {
  MarkerCone = 0,
  MarkerCylinder = 1,
  MarkerArrow = 2,
  MarkerArrowFlat = 3,
  MarkerFlag = 4,
  MarkerRingFlag = 5,
  MarkerRing = 6,
  MarkerPlane = 7,
  MarkerBikeLogo1 = 8,
  MarkerBikeLogo2 = 9,
  MarkerNum0 = 10,
  MarkerNum1 = 11,
  MarkerNum2 = 12,
  MarkerNum3 = 13,
  MarkerNum4 = 14,
  MarkerNum5 = 15,
  MarkerNum6 = 16,
  MarkerNum7 = 17,
  MarkerNum8 = 18,
  MarkerNum9 = 19,
  MarkerChevron1 = 20,
  MarkerChevron2 = 21,
  MarkerChevron3 = 22,
  MarkerRingFlat = 23,
  MarkerLap = 24,
  MarkerHalo = 25,
  MarkerHaloPoint = 26,
  MarkerHaloRotate = 27,
  MarkerSphere = 28,
  MarkerMoney = 29,
  MarkerLines = 30,
  MarkerBeast = 31,
  MarkerQuestionMark = 32,
  MarkerTransformPlane = 33,
  MarkerTransformHelicopter = 34,
  MarkerTransformBoat = 35,
  MarkerTransformCar = 36,
  MarkerTransformBike = 37,
  MarkerTransformPushBike = 38,
  MarkerTransformTruck = 39,
  MarkerTransformParachute = 40,
  MarkerTransformThruster = 41,
  MarkerWarp = 42,
  MarkerBoxes = 43,
  MarkerPitLane = 44,
}

export interface IMarkerCreateOptions extends Omit<IEntityCreateOptions, "model"> {
  type: IMarkerType;
  scale: number;
  color: IRGBA;
}

export interface IMarkersManager extends IWorldObjectsManager<IMarker> {
  create(options: IMarkerCreateOptions): IMarker;
}
