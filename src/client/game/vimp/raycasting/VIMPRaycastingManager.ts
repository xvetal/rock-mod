import {
  type IRaycastIgnoreEntity,
  type IRaycastResult,
  type IRaycastingManager,
  type TIgnoreEntityType,
} from "../../common/raycasting/IRaycastingManager";
import { CCMPNativeCallerManager } from "../native/VIMPNativeCallerManager";
import { Vector3D, type IVector3D } from "../../../../shared/common/utils";

const START_SHAPE_TEST_LOS_PROBE = "0x7EE9F5D83DD4F90E";
const GET_SHAPE_TEST_RESULT = "0x3D87450E15D98694";
const DEFAULT_TRACE_FLAG = 7;

type ShapeTestResultTuple = [
  number,
  boolean | number,
  IVector3D | [number, number, number],
  IVector3D | [number, number, number],
  number,
];

export class CCMPRaycastingManager implements IRaycastingManager {
  private readonly _native = new CCMPNativeCallerManager();

  public testPointToPoint(
    startPos: IVector3D,
    endPos: IVector3D,
    ignoreEntity?: TIgnoreEntityType,
    flags?: number | number[],
  ): IRaycastResult | null {
    const shapeTestHandle = this._native.callNative(
      START_SHAPE_TEST_LOS_PROBE,
      startPos.x,
      startPos.y,
      startPos.z,
      endPos.x,
      endPos.y,
      endPos.z,
      this._resolveFlags(flags),
      this._resolveIgnoreHandle(ignoreEntity),
      DEFAULT_TRACE_FLAG,
    ) as number;

    const result = this._native.callNative(GET_SHAPE_TEST_RESULT, shapeTestHandle) as ShapeTestResultTuple;

    const [, hit, position, surfaceNormal, entityHandle] = result;
    if (!hit) {
      return null;
    }

    return {
      entityHandle,
      position: this._toVector3D(position),
      surfaceNormal: this._toVector3D(surfaceNormal),
    };
  }

  private _resolveFlags(flags?: number | number[]): number {
    if (Array.isArray(flags)) {
      return flags.reduce((acc, flag) => acc | flag, 0);
    }

    return flags ?? 0;
  }

  private _resolveIgnoreHandle(ignoreEntity?: TIgnoreEntityType): number {
    if (!ignoreEntity) {
      return 0;
    }

    const entity = Array.isArray(ignoreEntity) ? ignoreEntity[0] : ignoreEntity;
    return this._isIgnoreEntity(entity) ? entity.handle : 0;
  }

  private _isIgnoreEntity(entity: IRaycastIgnoreEntity | undefined): entity is IRaycastIgnoreEntity {
    return typeof entity?.handle === "number";
  }

  private _toVector3D(value: IVector3D | [number, number, number]): Vector3D {
    if (Array.isArray(value)) {
      return new Vector3D(value[0] ?? 0, value[1] ?? 0, value[2] ?? 0);
    }

    return new Vector3D(value.x, value.y, value.z);
  }
}
