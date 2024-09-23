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

  public distanceTo(position: Vector2D): number {
    return Math.sqrt(this.squaredDistanceTo(position));
  }

  public squaredDistanceTo(position: Vector2D): number {
    const { x, y } = position;

    return (this.x - x) * (this.x - x) + (this.y - y) * (this.y - y);
  }

  public isInRange(position: Vector2D, range: number): boolean {
    const squaredDistance = this.squaredDistanceTo(position);

    return squaredDistance <= range * range;
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

  public override distanceTo(position: Vector3D): number {
    return Math.sqrt(this.squaredDistanceTo(position));
  }

  public override squaredDistanceTo(position: Vector3D): number {
    const { x, y, z } = position;

    return (this.x - x) * (this.x - x) + (this.y - y) * (this.y - y) + (this.z - z) * (this.z - z);
  }

  public override isInRange(position: Vector3D, range: number): boolean {
    const squaredDistance = this.squaredDistanceTo(position);

    return squaredDistance <= range * range;
  }
}
