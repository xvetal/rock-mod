import { type IVoiceChatManager } from "@RockMod/client/game";

/**
 * CCMP owns microphone activation (PTT/VAD) in the native voice engine.
 * Rock-Mod still tracks the gameplay-requested mute state so callers using
 * the RageMP-compatible facade do not fail while CCMP handles the real key.
 */
export class CCMPVoiceChatManager implements IVoiceChatManager {
  private _muted = true;

  public getMuted(): boolean {
    return this._muted || !ccmp.voice.enabled || ccmp.voice.state.serverMuted;
  }

  public setMuted(value: boolean): void {
    this._muted = value;
  }
}
