import { type ICameraManager, type ICameraCreateOptions } from "../../common/camera/ICameraManager";
import { type ICamera } from "../../common/camera/ICamera";
import { RockSandboxBaseObjectsManager } from "../baseObject/RockSandboxBaseObjectsManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { type RockSandboxCamera, wrapCamera } from "./RockSandboxCamera";
import { RockSandboxCamerasIterator } from "./RockSandboxCamerasIterator";

export class RockSandboxCameraManager extends RockSandboxBaseObjectsManager<ICamera> implements ICameraManager {
  private readonly _camerasIterator = new RockSandboxCamerasIterator();

  public override get iterator(): RockSandboxCamerasIterator {
    return this._camerasIterator;
  }

  public create(options: ICameraCreateOptions): RockSandboxCamera {
    return wrapCamera(
      getRockSandbox().cameras.create({
        name: options.name,
        position: { x: options.position.x, y: options.position.z, z: -options.position.y },
        rotation: { x: options.rotation.x, y: options.rotation.z, z: -options.rotation.y },
        fov: options.fov,
      }),
    );
  }

  public renderScriptCams(render: boolean, ease: boolean, easeTime: number, freezePreviousCamera: boolean): void {
    getRockSandbox().cameras.renderScriptCams(render, ease, easeTime, freezePreviousCamera);
  }

  public getGameplayCamera(): RockSandboxCamera {
    return wrapCamera(getRockSandbox().cameras.getGameplayCamera());
  }

  public override findByID(id: number): RockSandboxCamera | null {
    const camera = getRockSandbox().cameras.getById(id);
    return camera === null ? null : wrapCamera(camera);
  }

  public override getByID(id: number): RockSandboxCamera {
    const camera = this.findByID(id);
    if (camera === null)
      throw new Error(`[RockSandbox:client] RockSandboxCameraManager.getByID: camera ${id} not found`);
    return camera;
  }

  public override findByRemoteID(_id: number): null {
    return null;
  }

  public override getByRemoteID(id: number): never {
    throw new Error(`[RockSandbox:client] RockSandboxCameraManager.getByRemoteID: camera ${id} not found`);
  }

  public override deleteById(id: number): RockSandboxCamera {
    const camera = this.getByID(id);
    camera.destroy();
    return camera;
  }
}
