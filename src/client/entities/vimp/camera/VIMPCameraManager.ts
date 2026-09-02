import type {} from "@vimp-mp/types/client";
import { type IBaseObjectsIterator } from "../../common/baseObject/IBaseObjectsIterator";
import { type ICameraCreateOptions, type ICameraManager } from "../../common/camera/ICameraManager";
import { VIMPCamera } from "./VIMPCamera";

export class VIMPCameraManager implements ICameraManager {
  private readonly _cameras = new Map<number, VIMPCamera>();

  private readonly _iterator: IBaseObjectsIterator<VIMPCamera> = {
    all: (): IterableIterator<VIMPCamera> => this._cameras.values(),
  };

  public get iterator(): IBaseObjectsIterator<VIMPCamera> {
    return this._iterator;
  }

  public create(options: ICameraCreateOptions): VIMPCamera {
    const camera = new VIMPCamera(vimp.cameras.create(options.name, options.position, options.rotation, options.fov));
    this._cameras.set(camera.id, camera);
    return camera;
  }

  public renderScriptCams(render: boolean, ease: boolean, easeTime: number, freezePreviousCamera: boolean): void {
    vimp.cameras.renderScriptCams(render, ease, easeTime, freezePreviousCamera);
  }

  public getGameplayCamera(): VIMPCamera {
    return new VIMPCamera(vimp.cameras.getGameplayCamera());
  }

  public getByID(id: number): VIMPCamera {
    const camera = this.findByID(id);
    if (!camera) {
      throw new Error(`VIMPCameraManager.getByID(${id}): camera not found.`);
    }
    return camera;
  }

  public findByID(id: number): VIMPCamera | null {
    return this._cameras.get(id) ?? null;
  }

  public getByRemoteID(remoteId: number): VIMPCamera {
    const camera = this.findByRemoteID(remoteId);
    if (!camera) {
      throw new Error(`VIMPCameraManager.getByRemoteID(${remoteId}): camera not found.`);
    }
    return camera;
  }

  public findByRemoteID(remoteId: number): VIMPCamera | null {
    void remoteId;
    return null;
  }

  public deleteById(id: number): VIMPCamera {
    const camera = this.getByID(id);
    camera.destroy();
    this._cameras.delete(id);
    return camera;
  }
}
