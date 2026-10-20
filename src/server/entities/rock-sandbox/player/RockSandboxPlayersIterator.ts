import { RockSandboxWorldObjectsIterator } from "../worldObject/RockSandboxWorldObjectsIterator";
import { type RockSandboxPlayer, wrapPlayer } from "./RockSandboxPlayer";
import { nativePlayers } from "./nativePlayers";

export class RockSandboxPlayersIterator extends RockSandboxWorldObjectsIterator<RockSandboxPlayer> {
  public override all(): IterableIterator<RockSandboxPlayer> {
    // Capture membership now, rather than on the first generator.next().
    return nativePlayers("iterator.all").all().map(wrapPlayer).values();
  }
}
