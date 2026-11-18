export interface IWeaponManager {
  getWeaponClipSize(weapon: number): number;
  /**
   * Stops the game from starting a reload by itself; scripted reloads still work. Local player only.
   * Returns `false` when enabling is not supported (the switch stays off); disabling returns `true`.
   */
  setNoAutoReload(enabled: boolean): boolean;
  /**
   * Stops the game from putting away an empty weapon and switching to another one. Local player only.
   * Returns `false` when enabling is not supported (the switch stays off); disabling returns `true`.
   */
  setNoAutoSwap(enabled: boolean): boolean;
}
