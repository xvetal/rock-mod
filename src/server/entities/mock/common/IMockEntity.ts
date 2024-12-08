import { Vector3D } from "../../../common/utils/math/Vectors";

export interface IMockEntity {
  id: number;
  model: number;
  position: Vector3D;
  rotation: Vector3D;
  dimension: number;
  exists: boolean;
  type: string;
  name?: string;
  socialClub?: string;
  health?: number;
  armour?: number;
  weapon?: number;
  weaponAmmo?: number;
  ip?: string;
  serial?: string;
}
