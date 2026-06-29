import { type IBlipCreateOptions, type IBlipsManager } from "../../common/blip/IBlipsManager";
import { MockWorldObjectsManager } from "../worldObject/MockWorldObjectsManager";
import { MockBlip } from "./MockBlip";
import { BaseObjectType } from "../../../../shared";

export interface IMockBlipCreateOptions extends IBlipCreateOptions {}

export class MockBlipsManager extends MockWorldObjectsManager<MockBlip> implements IBlipsManager {
  public constructor() {
    super({
      baseObjectsType: "blip",
    });
  }

  public create(options: IMockBlipCreateOptions): MockBlip {
    const {
      alpha = 255,
      drawDistance = 30,
      global = false,
      shortRange = false,
      sprite,
      scale = 1,
      color = 1,
      name = "Blip",
      position,
      dimension,
      rotation = 0,
    } = options;

    const blip = new MockBlip({
      id: 0,
      type: BaseObjectType.Blip,
      alpha,
      drawDistance,
      global,
      shortRange,
      sprite,
      scale,
      color,
      name,
      position,
      dimension,
      rotation,
    });

    this.registerBaseObject(blip);

    return blip;
  }
}
