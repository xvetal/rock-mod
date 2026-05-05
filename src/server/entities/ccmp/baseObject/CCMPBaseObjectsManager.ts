import { type IBaseObjectsManager, type IBaseObjectsManagerOptions } from "../../common/baseObject/IBaseObjectsManager";
import { type CCMPBaseObject } from "./CCMPBaseObject";
import { CCMPBaseObjectsIterator } from "./CCMPBaseObjectsIterator";
import { type BaseObjectType } from "../../../../shared";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export interface ICCMPBaseObjectsManagerOptions extends IBaseObjectsManagerOptions {}

export abstract class CCMPBaseObjectsManager<T extends CCMPBaseObject> implements IBaseObjectsManager<T> {
  private readonly _baseObjects: Map<number, T>;

  private readonly _baseObjectsType: `${BaseObjectType}`;

  protected readonly _iterator: CCMPBaseObjectsIterator<T>;

  protected get baseObjects(): ReadonlyMap<number, T> {
    return this._baseObjects;
  }

  protected get baseObjectsType(): `${BaseObjectType}` {
    return this._baseObjectsType;
  }

  public get iterator(): CCMPBaseObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: ICCMPBaseObjectsManagerOptions) {
    this._baseObjects = new Map();
    this._baseObjectsType = options.baseObjectsType;
    this._iterator = new CCMPBaseObjectsIterator(this._baseObjects);
  }

  public getByID(_id: number): T {
    return notImplemented("CCMPBaseObjectsManager.getByID");
  }

  public findByID(_id: number): T | null {
    return notImplemented("CCMPBaseObjectsManager.findByID");
  }

  protected registerBaseObject(_baseObject: T): void {
    notImplemented("CCMPBaseObjectsManager.registerBaseObject");
  }

  protected unregisterBaseObject(_baseObject: T): void {
    notImplemented("CCMPBaseObjectsManager.unregisterBaseObject");
  }
}
