import { type IEntity } from "../../common/entity/IEntity";
import { CCMPWorldObject } from "../worldObject/CCMPWorldObject";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export abstract class CCMPEntity extends CCMPWorldObject implements IEntity {
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

  public getNetData(_name: string): unknown {
    return notImplemented("CCMPEntity.getNetData");
  }

  public setNetData(_name: string, _value: unknown): void {
    notImplemented("CCMPEntity.setNetData");
  }
}
