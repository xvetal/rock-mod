import { AltVWorldObject, type IAltVWorldObjectOptions } from "../worldObject/AltVWorldObject";
import Colshape = AltVServer.Colshape;

export interface IAltVColshapeOptions extends IAltVWorldObjectOptions<Colshape> {}

export abstract class AltVColshape extends AltVWorldObject<Colshape> {
  protected constructor(options: IAltVColshapeOptions) {
    super(options);
  }

  public get key(): string | undefined {
    const value = this.getNetData("key");
    return typeof value === "string" ? value : undefined;
  }

  public getNetData(name: string): unknown {
    return this.mpEntity.getSyncedMeta(name);
  }

  public setNetData(name: string, value: unknown): void {
    this.mpEntity.setSyncedMeta({ name, value });
  }
}
