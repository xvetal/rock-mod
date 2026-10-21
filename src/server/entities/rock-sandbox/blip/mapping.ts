import { type RockSandboxBlipIcon, type RockSandboxBlipColor } from "@rock-sandbox/types/server";
import { type IBlipSprite } from "../../../../shared";
const icons: Readonly<Record<number, RockSandboxBlipIcon>> = {
  1: "point",
  40: "house",
  52: "basket",
  59: "building",
  71: "scissors",
  72: "gear",
  73: "shirt",
  75: "needle",
  93: "glass",
  225: "steeringWheel",
  326: "car",
  350: "houseSale",
  361: "fuelPump",
  437: "flag",
  446: "wrench",
  921: "pistol",
};
const colors: Readonly<Record<number, readonly [number, number, number]>> = {
  0: [255, 255, 255],
  1: [235, 75, 75],
  2: [80, 200, 80],
  3: [40, 160, 255],
  4: [255, 190, 40],
  5: [255, 220, 60],
  17: [255, 145, 40],
  27: [185, 100, 255],
  29: [170, 150, 50],
  51: [250, 128, 114],
  83: [155, 90, 220],
};
export function nativeIcon(sprite: number): RockSandboxBlipIcon {
  const icon = icons[sprite];
  if (icon === undefined)
    throw new Error(`[RockSandbox:server] RockSandboxBlip.sprite: unsupported GTA sprite ${sprite}`);
  return icon;
}
export function sdkSprite(icon: RockSandboxBlipIcon): IBlipSprite {
  const found = Object.entries(icons).find(([, value]) => value === icon);
  if (found === undefined)
    throw new Error(`[RockSandbox:server] RockSandboxBlip.sprite: unsupported native icon ${icon}`);
  return Number(found[0]);
}
export function nativeColor(color: number): RockSandboxBlipColor {
  const rgb = colors[color];
  if (rgb === undefined)
    throw new Error(`[RockSandbox:server] RockSandboxBlip.color: unsupported GTA palette index ${color}`);
  return { r: rgb[0], g: rgb[1], b: rgb[2] };
}
export function sdkColor(color: RockSandboxBlipColor): number {
  const found = Object.entries(colors).find(
    ([, rgb]) => rgb[0] === color.r && rgb[1] === color.g && rgb[2] === color.b,
  );
  if (found === undefined)
    throw new Error("[RockSandbox:server] RockSandboxBlip.color: native RGB has no SDK palette entry");
  return Number(found[0]);
}
