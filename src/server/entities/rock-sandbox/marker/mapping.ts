import { type RockSandboxMarkerType } from "@rock-sandbox/types/server";
import { type IMarkerType } from "../../../../shared";

export function nativeMarkerType(type: IMarkerType): RockSandboxMarkerType {
  switch (type) {
    case 0:
      return "cone";
    case 1:
      return "cylinder";
    case 27:
      return "ringArrows";
    default:
      throw new Error(`[RockSandbox:server] RockSandboxMarker.markerType: unsupported GTA marker type ${type}`);
  }
}

export function sdkMarkerType(type: RockSandboxMarkerType): IMarkerType {
  switch (type) {
    case "cone":
      return 0;
    case "cylinder":
      return 1;
    case "ringArrows":
      return 27;
    default:
      throw new Error(`[RockSandbox:server] RockSandboxMarker.markerType: unsupported native marker type ${type}`);
  }
}
