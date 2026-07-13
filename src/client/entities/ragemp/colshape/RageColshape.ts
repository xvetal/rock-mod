import { type IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";

export interface IRageColshapeOptions extends IRageWorldObjectOptions<ColshapeMp> {}

export abstract class RageColshape extends RageWorldObject<ColshapeMp> {
  protected constructor(options: IRageColshapeOptions) {
    super(options);
  }

  public get key(): string | undefined {
    const value = this.mpEntity.getVariable("key");
    return typeof value === "string" ? value : undefined;
  }
}
