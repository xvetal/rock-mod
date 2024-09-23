export class Vector2D {
  private readonly _x: number;

  private readonly _y: number;

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
}

export class Vector3D extends Vector2D {
  private readonly _z: number;

  public get z(): number {
    return this._z;
  }

  public constructor(x: number, y: number, z: number) {
    super(x, y);
    this._z = z;
  }
}
