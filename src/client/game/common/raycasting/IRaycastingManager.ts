import { type IVector3D } from "@shared/common/utils";
import { type BaseObjectType } from "@shared/entities";

export interface IRaycastResult {
  entityHandle: number;
  position: IVector3D;
  surfaceNormal: IVector3D;
}

export interface IRaycastIgnoreEntity {
  handle: number;
  type: BaseObjectType;
}

export type TIgnoreEntityType = IRaycastIgnoreEntity | IRaycastIgnoreEntity[] | null;

export interface IRaycastingManager {
  testPointToPoint(
    startPos: IVector3D,
    endPos: IVector3D,
    ignoreEntity?: TIgnoreEntityType,
    flags?: number | number[],
  ): IRaycastResult | null;
}
