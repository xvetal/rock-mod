import type {} from "@classic-mp/types/client";
import { type IBaseObjectsIterator } from "../../common/baseObject/IBaseObjectsIterator";
import { type ICameraCreateOptions, type ICameraManager } from "../../common/camera/ICameraManager";
import { CCMPCamera } from "./CCMPCamera";

export class CCMPCameraManager implements ICameraManager {
  private readonly _cameras = new Map<number, CCMPCamera>();

  private readonly _iterator: IBaseObjectsIterator<CCMPCamera> = {
    all: (): IterableIterator<CCMPCamera> => this._cameras.values(),
  };

  public get iterator(): IBaseObjectsIterator<CCMPCamera> {
    return this._iterator;
  }

  public create(options: ICameraCreateOptions): CCMPCamera {
    const camera = new CCMPCamera(ccmp.cameras.create(options.name, options.position, options.rotation, options.fov));
    this._cameras.set(camera.id, camera);
    return camera;
  }

  public renderScriptCams(render: boolean, ease: boolean, easeTime: number, freezePreviousCamera: boolean): void {
    ccmp.cameras.renderScriptCams(render, ease, easeTime, freezePreviousCamera);
  }

  public getGameplayCamera(): CCMPCamera {
    return new CCMPCamera(ccmp.cameras.getGameplayCamera());
  }

  public getByID(id: number): CCMPCamera {
    const camera = this.findByID(id);
    if (!camera) {
      throw new Error(`CCMPCameraManager.getByID(${id}): camera not found.`);
    }
    return camera;
  }

  public findByID(id: number): CCMPCamera | null {
    return this._cameras.get(id) ?? null;
  }

  public getByRemoteID(remoteId: number): CCMPCamera {
    const camera = this.findByRemoteID(remoteId);
    if (!camera) {
      throw new Error(`CCMPCameraManager.getByRemoteID(${remoteId}): camera not found.`);
    }
    return camera;
  }

  public findByRemoteID(remoteId: number): CCMPCamera | null {
    void remoteId;
    return null;
  }

  public deleteById(id: number): CCMPCamera {
    const camera = this.getByID(id);
    camera.destroy();
    this._cameras.delete(id);
    return camera;
  }
}
