import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type BaseObjectType } from "../../../../shared";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export abstract class VIMPBaseObject implements IBaseObject {
  public get id(): number {
    return notImplemented("VIMPBaseObject.id");
  }

  public get type(): BaseObjectType {
    return notImplemented("VIMPBaseObject.type");
  }

  public get isExists(): boolean {
    return notImplemented("VIMPBaseObject.isExists");
  }

  public destroy(): void {
    notImplemented("VIMPBaseObject.destroy");
  }
}
