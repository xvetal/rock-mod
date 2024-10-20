import { IBaseObjectsManager, IBaseObjectsManagerOptions } from "../../common/baseObject/IBaseObjectsManager";
import { BaseObjectType } from "../../common/baseObject/IBaseObject";
import { AltVBaseObject } from "./AltVBaseObject";
import { AltVBaseObjectsIterator } from "./AltVBaseObjectsIterator";
import BaseObject = AltVServer.BaseObject;
import { RockMod } from "../../../RockMod";

export interface IAltVBaseObjectsManagerOptions extends IBaseObjectsManagerOptions {}

export abstract class AltVBaseObjectsManager<T extends AltVBaseObject<BaseObject>> implements IBaseObjectsManager<T> {
  private readonly _baseObjects: Map<number, T>;

  private readonly _baseObjectsType: `${BaseObjectType}`;

  protected readonly _iterator: AltVBaseObjectsIterator<T>;

  protected get baseObjects(): ReadonlyMap<number, T> {
    return this._baseObjects;
  }

  public get iterator(): AltVBaseObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: IAltVBaseObjectsManagerOptions) {
    this._baseObjects = new Map();
    this._baseObjectsType = options.baseObjectsType;
    this._iterator = new AltVBaseObjectsIterator(this._baseObjects);
  }

  public getByID(id: number): T {
    const baseObject = this.findByID(id);

    if (!baseObject) {
      throw new Error(`BaseObject [${this._baseObjectsType}] with id ${id} not found`);
    }

    return baseObject;
  }

  public findByID(id: number): T | null {
    const baseObject = this._baseObjects.get(id);

    return baseObject ?? null;
  }

  protected registerBaseObject(baseObject: T): void {
    if (this._baseObjects.has(baseObject.id)) {
      throw new Error(`BaseObject [${this._baseObjectsType}] with id ${baseObject.id} already exists`);
    }
    this._baseObjects.set(baseObject.id, baseObject);
    RockMod.instance.net.events.emit("rm::entityCreated", baseObject);
  }

  protected unregisterBaseObject(baseObject: T): void {
    if (!this._baseObjects.delete(baseObject.id)) {
      throw new Error(`BaseObject [${this._baseObjectsType}] with id ${baseObject.id} not found`);
    }
    RockMod.instance.net.events.emit("rm::entityCreated", baseObject);
  }
}
