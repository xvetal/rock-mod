import { type IColshape } from "../../common/colshape/IColshape";
import { MockWorldObject, type IMockWorldObjectOptions } from "../worldObject/MockWorldObject";

export interface IMockColshapeOptions extends IMockWorldObjectOptions {}

export abstract class MockColshape extends MockWorldObject implements IColshape {
  private readonly _netData: Map<string, unknown>;

  protected constructor(options: IMockColshapeOptions) {
    super(options);

    this._netData = new Map();
  }

  public get key(): string | undefined {
    const value = this.getNetData("key");
    return typeof value === "string" ? value : undefined;
  }

  public getNetData(name: string): unknown {
    return this._netData.get(name);
  }

  public setNetData(name: string, value: unknown): void {
    this._netData.set(name, value);
  }
}
