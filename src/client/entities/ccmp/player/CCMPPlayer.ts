/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseObjectType } from "@shared/entities";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type IPlayer } from "../../common/player/IPlayer";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IVector3D, Vector3D } from "@shared/common/utils";

const ZERO_VECTOR: IVector3D = new Vector3D(0, 0, 0);

export interface ICCMPPlayerOptions {
  /** Network id of the player (same as remoteId — CCMP exposes only one id). */
  readonly id: number;
  /** Human-readable name from the handshake. May be empty if not yet known. */
  readonly name: string;
  /** `true` if this Player represents the local user, `false` for remotes. */
  readonly isLocal: boolean;
}

/**
 * Минимальная реализация `IPlayer` под CCMP.
 *
 * Что покрывает реально:
 *  - `id` / `remoteId` / `type` / `name` / `isLocalPlayer` / `isExists` —
 *    используются `rock-mod-multiplayer-events-adapter` для регистрации
 *    Player в репозитории и `PlayerService.findLocalPlayer` в геймоде.
 *
 * Что застублено no-op'ом + одноразовым warn:
 *  - Всё остальное — позиция/здоровье/броня/transform/animations/tasks/
 *    decorations/voice/etc. У CCMP нет соответствующего JS API. Геймод-
 *    консьюмер обращается к ним через `RockModStateAdapter` (rock-mod-state.adapter.ts).
 *    Без stub'ов адаптер падал бы на `this.rockModPlayer.<X> is not a function`
 *    при каждом render-frame'е, что было бы хуже текущей "тихой деградации".
 *
 * `handle` возвращает `0` — у CCMP-клиента нет per-player game handle на
 * JS-стороне. RAGEMP-side native-вызовы с нулевым handle обычно no-op, что
 * нам и нужно (например, `setNoCollisionWith(0, ...)`).
 *
 * Когда CCMP добавит соответствующие API — заменяем no-op методы реальными
 * вызовами. До тех пор геймод видит "Player существует, но методы не делают
 * ничего" — лучшая возможная деградация без падения.
 */
export class CCMPPlayer implements IPlayer {
  /** Глобальный set для one-time warnings, чтобы не флудить лог. */
  private static readonly _warnedMethods = new Set<string>();

  private readonly _id: number;

  private _name: string;

  private readonly _isLocal: boolean;

  private _isExists: boolean;

  public constructor(options: ICCMPPlayerOptions) {
    this._id = options.id;
    this._name = options.name;
    this._isLocal = options.isLocal;
    this._isExists = true;
  }

  /** Помечает игрока как удалённого — вызывается из `CCMPPlayersManager`. */
  public markRemoved(): void {
    this._isExists = false;
  }

  /** Обновляет name (полезно если name приехал позже первого создания). */
  public setNameInternal(name: string): void {
    if (name) {
      this._name = name;
    }
  }

  // -- IBaseObject ----------------------------------------------------------

  public get id(): number {
    return this._id;
  }

  public get remoteId(): number {
    return this._id;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Player;
  }

  public get isExists(): boolean {
    return this._isExists;
  }

  public get handle(): number {
    // См. блок-комментарий класса: per-player handle под CCMP не доступен.
    return 0;
  }

  public destroy(): void {
    this._warnOnce("destroy");
  }

  // -- IWorldObject ---------------------------------------------------------

  public get position(): IVector3D {
    return ZERO_VECTOR;
  }

  public get dimension(): number {
    return 0;
  }

  public setPosition(_value: IVector3D): void {
    this._warnOnce("setPosition");
  }

  public setDimension(_value: number): void {
    this._warnOnce("setDimension");
  }

  public setCoords(
    _xPos: number,
    _yPos: number,
    _zPos: number,
    _xAxis: boolean,
    _yAxis: boolean,
    _zAxis: boolean,
    _clearArea: boolean,
  ): void {
    this._warnOnce("setCoords");
  }

  // -- IEntity --------------------------------------------------------------

  public get model(): number {
    return 0;
  }

  public get heading(): number {
    return 0;
  }

  public setHeading(_heading: number): void {
    this._warnOnce("setHeading");
  }

  public setModel(_value: string): void {
    this._warnOnce("setModel");
  }

  public get rotation(): IVector3D {
    return ZERO_VECTOR;
  }

  public setRotation(_value: IVector3D): void {
    this._warnOnce("setRotation");
  }

  public get forwardVector(): IVector3D {
    return ZERO_VECTOR;
  }

  public freezePosition(_freeze: boolean): void {
    this._warnOnce("freezePosition");
  }

  public setCollision(_collision: boolean, _keepPhysics: boolean): void {
    this._warnOnce("setCollision");
  }

  public setInvincible(_invincible: boolean): void {
    this._warnOnce("setInvincible");
  }

  public setVisible(_visible: boolean): void {
    this._warnOnce("setVisible");
  }

  public setAlpha(_alpha: number): void {
    this._warnOnce("setAlpha");
  }

  public get alpha(): number {
    return 255;
  }

  public resetAlpha(): void {
    this._warnOnce("resetAlpha");
  }

  public getOffsetFromInWorldCoords(_offsetX: number, _offsetY: number, _offsetZ: number): IVector3D {
    return ZERO_VECTOR;
  }

  public getBoneIndexByName(_boneName: string): number {
    return -1;
  }

  public getWorldPositionOfBone(_boneIndex: number): IVector3D {
    return ZERO_VECTOR;
  }

  public getVariable(_name: string): unknown | null {
    return null;
  }

  public attachToEntity(
    _target: IBaseObject,
    _boneIndex: number,
    _offset: IVector3D,
    _rotation: IVector3D,
    _p9: boolean,
    _useSoftPinning: boolean,
    _collision: boolean,
    _isPed: boolean,
    _vertexIndex: number,
    _fixedRot: boolean,
  ): void {
    this._warnOnce("attachToEntity");
  }

  public detach(_useDetachVelocity: boolean, _collision: boolean): void {
    this._warnOnce("detach");
  }

  public getSpeed(): number {
    return 0;
  }

  public isPlayingAnim(_dictionary: string, _name: string, _taskFlag: number): boolean {
    return false;
  }

  // -- IPlayer --------------------------------------------------------------

  public get name(): string {
    return this._name;
  }

  public get health(): number {
    return 100;
  }

  public get armour(): number {
    return 0;
  }

  public get isDead(): boolean {
    return false;
  }

  public get vehicle(): IVehicle | null {
    return null;
  }

  public get isVoice3DEnabled(): boolean {
    return false;
  }

  public get voiceVolume(): number {
    return 0;
  }

  public get isVoiceActive(): boolean {
    return false;
  }

  public setVoice3D(_enable: boolean): void {
    this._warnOnce("setVoice3D");
  }

  public setVoiceVolume(_volume: number): void {
    this._warnOnce("setVoiceVolume");
  }

  public get isReloading(): boolean {
    return false;
  }

  public get weapon(): number {
    return 0;
  }

  public getAmmoInClip(_weapon: number): number {
    return 0;
  }

  public getWeaponAmmo(_weapon: number): number {
    return 0;
  }

  public getBoneIndex(_boneId: number): number {
    return -1;
  }

  public setDecoration(_collection: string, _overlay: string): void {
    this._warnOnce("setDecoration");
  }

  public removeDecoration(_collection: string, _overlay: string): void {
    this._warnOnce("removeDecoration");
  }

  public clearDecorations(): void {
    this._warnOnce("clearDecorations");
  }

  public setHeadBlendData(
    _shapeFirstId: number,
    _shapeSecondId: number,
    _shapeThirdId: number,
    _skinFirstId: number,
    _skinSecondId: number,
    _skinThirdId: number,
    _shapeMix: number,
    _skinMix: number,
    _thirdMix: number,
    _isParent: boolean,
  ): void {
    this._warnOnce("setHeadBlendData");
  }

  public setFaceFeature(_index: number, _value: number): void {
    this._warnOnce("setFaceFeature");
  }

  public setHeadOverlay(
    _overlayId: number,
    _index: number,
    _opacity: number,
    _firstColor: number,
    _secondColor: number,
  ): void {
    this._warnOnce("setHeadOverlay");
  }

  public setHeadOverlayColor(
    _overlayId: number,
    _colorTypeId: number,
    _firstColor: number,
    _secondColor: number,
  ): void {
    this._warnOnce("setHeadOverlayColor");
  }

  public setEyeColor(_eyeColor: number): void {
    this._warnOnce("setEyeColor");
  }

  public setHairColor(_colorId: number, _highlightColorId: number): void {
    this._warnOnce("setHairColor");
  }

  public setComponentVariation(
    _componentId: number,
    _drawableId: number,
    _textureId: number,
    _paletteId: number,
  ): void {
    this._warnOnce("setComponentVariation");
  }

  public setPropertyVariation(_componentId: number, _drawableId: number, _textureId: number, _attach: boolean): void {
    this._warnOnce("setPropertyVariation");
  }

  public clearProp(_componentId: number): void {
    this._warnOnce("clearProp");
  }

  public get isLocalPlayer(): boolean {
    return this._isLocal;
  }

  public taskSwapWeapon(): void {
    this._warnOnce("taskSwapWeapon");
  }

  public taskEnterVehicle(
    _vehicleHandle: number,
    _timeout: number,
    _seat: number,
    _speed: number,
    _flag: number,
    _p6: number,
  ): void {
    this._warnOnce("taskEnterVehicle");
  }

  public clearTasks(): void {
    this._warnOnce("clearTasks");
  }

  public clearTasksImmediately(): void {
    this._warnOnce("clearTasksImmediately");
  }

  public taskPlayAnim(
    _dictionary: string,
    _name: string,
    _blendInSpeed: number,
    _blendOutSpeed: number,
    _duration: number,
    _flag: number,
    _playbackRate: number,
    _lockX: boolean,
    _lockY: boolean,
    _lockZ: boolean,
  ): void {
    this._warnOnce("taskPlayAnim");
  }

  public stopAnim(_dictionary: string, _name: string, _blendOutSpeed: number): void {
    this._warnOnce("stopAnim");
  }

  public setMovementClipset(_clipset: string, _speed: number): void {
    this._warnOnce("setMovementClipset");
  }

  public resetMovementClipset(_blendDuration: number): void {
    this._warnOnce("resetMovementClipset");
  }

  public getBoneCoords(_boneId: number, _offsetX: number, _offsetY: number, _offsetZ: number): IVector3D {
    return ZERO_VECTOR;
  }

  public setNoCollision(_otherHandle: number, _thisFrameOnly: boolean): void {
    this._warnOnce("setNoCollision");
  }

  private _warnOnce(method: string): void {
    if (CCMPPlayer._warnedMethods.has(method)) {
      return;
    }
    CCMPPlayer._warnedMethods.add(method);
    console.warn(
      `[CCMPPlayer] ${method}() пока не реализован для CCMP — вызов проигнорирован ` +
        `(следующие вызовы этого метода будут проигнорированы молча).`,
    );
  }
}
