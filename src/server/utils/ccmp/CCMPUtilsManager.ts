import { type IUtilsManager } from "../common";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPUtilsManager implements IUtilsManager {
  public hash(_value: string): number {
    return notImplemented("CCMPUtilsManager.hash");
  }
}
