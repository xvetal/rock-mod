import { MathClamp } from "../math/Math";

export interface IRGBA {
  get r(): number;
  get g(): number;
  get b(): number;
  get a(): number | undefined;
}

export class RGBA implements IRGBA {
  private static readonly MIN_COLOR_VALUE = 0;

  private static readonly MAX_COLOR_VALUE = 255;

  private readonly _r: number;

  private readonly _g: number;

  private readonly _b: number;

  private readonly _a: number | undefined;

  public get r(): number {
    return this._r;
  }

  public get g(): number {
    return this._g;
  }

  public get b(): number {
    return this._b;
  }

  public get a(): number | undefined {
    return this._a;
  }

  public constructor(r: number, g: number, b: number, a?: number | undefined) {
    this._r = RGBA.clampColor(r);
    this._g = RGBA.clampColor(g);
    this._b = RGBA.clampColor(b);
    this._a = a !== undefined ? RGBA.clampColor(a) : undefined;
  }

  private static clampColor(value: number): number {
    return MathClamp(value, RGBA.MIN_COLOR_VALUE, RGBA.MAX_COLOR_VALUE);
  }
}
