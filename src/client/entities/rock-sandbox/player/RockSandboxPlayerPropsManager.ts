import { type IVector3D } from "../../../../shared/common/utils/math";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export interface IRockSandboxPlayerProp {
  id: number;
  model: string;
  boneId: number;
  offset: Pick<IVector3D, "x" | "y" | "z">;
  rotation: Pick<IVector3D, "x" | "y" | "z">;
}

/** Sandbox extension: visual props use bone IDs, without inventing GTA bone indices. */
export class RockSandboxPlayerPropsManager {
  public replace(playerId: number, props: readonly IRockSandboxPlayerProp[]): void {
    getRockSandbox().playerProps.replace(playerId, props.map(prop => ({
      id: prop.id, model: prop.model, bone: prop.boneId,
      offset: { x: prop.offset.x, y: prop.offset.z, z: -prop.offset.y },
      rotation: { x: prop.rotation.x, y: prop.rotation.z, z: -prop.rotation.y },
    })));
  }

  public clear(playerId: number): void {
    getRockSandbox().playerProps.clear(playerId);
  }
}
