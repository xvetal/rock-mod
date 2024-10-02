declare global {
  interface Math {
    clamp(value: number, min: number, max: number): number;
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

Math.clamp = clamp;
