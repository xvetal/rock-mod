import { type IEntity } from "../../common/entity/IEntity";
import { CCMPWorldObject } from "../worldObject/VIMPWorldObject";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";
import type { StreamSyncedMeta } from "@classic-mp/types/server";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export abstract class CCMPEntity extends CCMPWorldObject implements IEntity {
  protected abstract get ccmpMeta(): StreamSyncedMeta;

  public get model(): number {
    return notImplemented("CCMPEntity.model");
  }

  public get rotation(): IVector3D {
    return notImplemented("CCMPEntity.rotation");
  }

  public setModel(_value: string): void {
    notImplemented("CCMPEntity.setModel");
  }

  public setRotation(_value: IVector3D): void {
    notImplemented("CCMPEntity.setRotation");
  }

  public getNetData(name: string): unknown {
    return this.ccmpMeta.getStreamSyncedMeta(name);
  }

  public setNetData(name: string, value: unknown): void {
    this.ccmpMeta.setStreamSyncedMeta(name, value);
  }
}
