import { type IEntity } from "../../common/entity/IEntity";
import { VIMPWorldObject } from "../worldObject/VIMPWorldObject";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";
import type { StreamSyncedMeta } from "@vimp-mp/types/server";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export abstract class VIMPEntity extends VIMPWorldObject implements IEntity {
  protected abstract get vimpMeta(): StreamSyncedMeta;

  public get model(): number {
    return notImplemented("VIMPEntity.model");
  }

  public get rotation(): IVector3D {
    return notImplemented("VIMPEntity.rotation");
  }

  public setModel(_value: string): void {
    notImplemented("VIMPEntity.setModel");
  }

  public setRotation(_value: IVector3D): void {
    notImplemented("VIMPEntity.setRotation");
  }

  public getNetData(name: string): unknown {
    return this.vimpMeta.getStreamSyncedMeta(name);
  }

  public setNetData(name: string, value: unknown): void {
    this.vimpMeta.setStreamSyncedMeta(name, value);
  }
}
