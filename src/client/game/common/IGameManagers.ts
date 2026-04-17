import { type IBrowserManager } from "./browser";
import { type IStorageManager } from "./storage";
import { type IGraphicsManager } from "./graphics";
import { type INativeCallerManager } from "./native";
import { type IStreamingManager } from "./streaming";
import { type ILocalPlayerManager } from "./localPlayer";
import { type IControlsManager } from "./controls";
import { type IKeysManager } from "./keys";
import { type IGameplayManager } from "./gameplay";
import { type IGameCameraManager } from "./camera";
import { type IUiManager } from "./ui";
import { type INametagsManager } from "./nametags";
import { type IPathfindManager } from "./pathfind";
import { type IZoneManager } from "./zone";
import { type IWeaponManager } from "./weapon";
import { type IGameObjectManager } from "./object";

export interface IGameManagers {
  browser: IBrowserManager;
  storage: IStorageManager;
  graphics: IGraphicsManager;
  native: INativeCallerManager;
  streaming: IStreamingManager;
  localPlayer: ILocalPlayerManager;
  controls: IControlsManager;
  keys: IKeysManager;
  gameplay: IGameplayManager;
  camera: IGameCameraManager;
  ui: IUiManager;
  nametags: INametagsManager;
  pathfind: IPathfindManager;
  zone: IZoneManager;
  weapon: IWeaponManager;
  object: IGameObjectManager;
}
