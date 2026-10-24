import { type IRadarScreenBounds } from "../game/common/ui/IUiManager";

/** Established GTA radar layout, previously computed by the gamemod UI adapter. */
export function gtaRadarScreenBounds(safezone: number, width: number, height: number): IRadarScreenBounds {
  const radarWidth = height * (0.15 * (16 / 9));
  const radarHeight = height * 0.188;
  const xOffset = width * (1 - safezone) * 0.5;
  const yOffset = height * (1 - safezone) * 0.5;
  return { x: xOffset, y: height - yOffset - radarHeight, width: radarWidth, height: radarHeight };
}
