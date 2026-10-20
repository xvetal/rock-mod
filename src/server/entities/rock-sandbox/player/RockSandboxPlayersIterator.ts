import { RockSandboxWorldObjectsIterator } from "../worldObject/RockSandboxWorldObjectsIterator";
import { type RockSandboxPlayer, wrapPlayer } from "./RockSandboxPlayer";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxPlayersIterator extends RockSandboxWorldObjectsIterator<RockSandboxPlayer> {
  public override all(): IterableIterator<RockSandboxPlayer> {
    // Capture membership now, rather than on the first generator.next().
    return getRockSandbox().players.all().map(wrapPlayer).values();
  }
}
