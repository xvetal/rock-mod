import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type BaseObjectType } from "../../../../shared";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export abstract class CCMPBaseObject implements IBaseObject {
  public get id(): number {
    return notImplemented("CCMPBaseObject.id");
  }

  public get type(): BaseObjectType {
    return notImplemented("CCMPBaseObject.type");
  }

  public get isExists(): boolean {
    return notImplemented("CCMPBaseObject.isExists");
  }

  public destroy(): void {
    notImplemented("CCMPBaseObject.destroy");
  }
}
