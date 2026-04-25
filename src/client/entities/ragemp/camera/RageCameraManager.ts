import { RageCamera } from "@RockMod/client/entities/ragemp/camera/RageCamera";
import { type ICameraCreateOptions, type ICameraManager } from "@RockMod/client/entities";
import { RageBaseObjectsManager } from "@RockMod/client/entities/ragemp/baseObject/RageBaseObjectsManager";

export class RageCameraManager extends RageBaseObjectsManager<RageCamera> implements ICameraManager {
  public constructor() {
    super({
      baseObjectsType: "camera",
    });
  }

  public create(options: ICameraCreateOptions): RageCamera {
    const mpEntity = mp.cameras.new(
      options.name,
      new mp.Vector3(options.position),
      new mp.Vector3(options.rotation),
      options.fov,
    );

    const camera = new RageCamera({
      mpEntity: mpEntity as unknown as EntityMp,
    });

    this.registerBaseObject(camera);
    return camera;
  }

  public renderScriptCams(render: boolean, ease: boolean, easeTime: number, freezePreviousCamera: boolean): void {
    mp.game.cam.renderScriptCams(render, ease, easeTime, freezePreviousCamera, false, 0);
  }

  public getGameplayCamera(): RageCamera {
    const mpCamera = mp.cameras.gameplay;

    return new RageCamera({
      mpEntity: mpCamera as unknown as EntityMp,
    });
  }
}
