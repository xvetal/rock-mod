import { RockSandboxWorldObjectsIterator } from "../worldObject/RockSandboxWorldObjectsIterator";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { type RockSandboxPlayer, wrapPlayer } from "./RockSandboxPlayer";

export class RockSandboxPlayersIterator extends RockSandboxWorldObjectsIterator<RockSandboxPlayer> {
  public override all(): IterableIterator<RockSandboxPlayer> {
    return getRockSandbox().players.connected().map(wrapPlayer).values();
  }
}
