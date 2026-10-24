import { type IBaseObjectsIterator } from "../../common/baseObject/IBaseObjectsIterator";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { type RockSandboxCamera, wrapCamera } from "./RockSandboxCamera";

export class RockSandboxCamerasIterator implements IBaseObjectsIterator<RockSandboxCamera> {
  public *all(): IterableIterator<RockSandboxCamera> {
    for (const camera of getRockSandbox().cameras.all()) yield wrapCamera(camera);
  }
}
