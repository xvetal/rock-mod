import { MathClamp } from "../math/Math";

export interface IRGBA {
  get r(): number;
  get g(): number;
  get b(): number;
  get a(): number | undefined;
}

export class RGBA implements IRGBA {
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
    this._r = MathClamp(r, 0, 255);
    this._g = MathClamp(g, 0, 255);
    this._b = MathClamp(b, 0, 255);
    this._a = a !== undefined ? MathClamp(a, 0, 1) : a;
  }
}
