/** Combat mechanisms the platform applies on the client; where a flag is `false` the method returns `false`. */
export interface IClientCombatCapabilities {
  /** `game.weapon.setNoAutoReload(true)` can be applied (the game build may still refuse it). */
  readonly noAutoReload: boolean;
  /** `game.weapon.setNoAutoSwap(true)` can be applied (the game build may still refuse it). */
  readonly noAutoSwap: boolean;
  /** `rm::playerWeaponShot` fires for the local player. */
  readonly weaponShot: boolean;
  /** `rm::outgoingDamage` and `rm::incomingDamage` fire. */
  readonly damageEvents: boolean;
}

export interface IClientCapabilities {
  readonly combat: IClientCombatCapabilities;
}
