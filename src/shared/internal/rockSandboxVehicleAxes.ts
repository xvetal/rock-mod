type Point = { x: number; y: number; z: number };

function finite(values: number[]): void {
  if (
    values.some((value) => typeof value !== "number" || !Number.isFinite(value) || !Number.isFinite(Math.fround(value)))
  )
    throw new TypeError("[RockSandbox] Vehicle transform requires finite f32 numbers");
}

// Native cars face +Z, with +X to the driver's left and +Y up. GTA vehicle
// offsets use +X right, +Y front and +Z up. World positions use (x, -z, y).
export function nativeVehicleOffset(x: number, y: number, z: number): Point {
  finite([x, y, z]);
  return { x: -x, y: z, z: y };
}

export function nativeVehicleRotation(rotation: Point): Point {
  finite([rotation.x, rotation.y, rotation.z]);
  // GTA ZXY -> native YXZ, including the car model's reversed forward/right.
  return { x: -rotation.x, y: rotation.z + 180, z: rotation.y };
}

export function vehicleHeading(heading: number): number {
  return (((heading - 180) % 360) + 360) % 360;
}

export function gameVehicleRotation(rotation: Point): Point {
  return { x: -rotation.x, y: rotation.z, z: vehicleHeading(rotation.y) };
}
