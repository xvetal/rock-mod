/**
 * Combat mechanisms the platform applies on the server. Where a flag is `false` the weapon and
 * health-recharge methods return `false` or `null`. `invincible` and `autoRespawn` throw on
 * RAGE, alt:V and Mock and do nothing on VIMP without the combat API: call them only when
 * their flag is `true`.
 */
export interface IServerCombatCapabilities {
  /** `IPlayer.getWeaponAmmo` reports the owned weapon's total. */
  readonly weaponAmmo: boolean;
  /** `IPlayer.setCurrentWeapon` puts an owned weapon in hand. */
  readonly currentWeapon: boolean;
  /** `IPlayer.giveWeaponComponent` / `removeWeaponComponent`. */
  readonly weaponComponents: boolean;
  /** `IPlayer.healthRecharge` / `setHealthRecharge`. */
  readonly healthRecharge: boolean;
  /** `IPlayer.invincible` / `setInvincible`. */
  readonly invincible: boolean;
  /** `IPlayer.autoRespawn` / `setAutoRespawn`. */
  readonly autoRespawn: boolean;
  /** `rm::playerDamageRequest` fires; without it the event never fires. */
  readonly damageRequest: boolean;
  /** `rm::playerWeaponShot` fires; without it the event never fires. */
  readonly weaponShot: boolean;
}

export interface IServerCapabilities {
  /**
   * `null` while not yet known: on VIMP the combat API is read from a player object, so it is
   * known from the first `rm::playerConnected` on. Other platforms never return `null`.
   * Subscribing to combat events needs no flag: where an event does not exist it never fires.
   */
  readonly combat: IServerCombatCapabilities | null;
}
