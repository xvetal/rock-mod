import { IRPCManager } from "../../common/rpc/IRPCManager";
import { RagePlayer } from "../../../entities/ragemp/player/RagePlayer";

export class RageRPCManager implements IRPCManager {
  public register(rpcName: string, handler: (player: RagePlayer, ...args: unknown[]) => unknown): void {
    return mp.events.addProc(rpcName, handler);
  }

  public unregister(rpcName: string): void {
    return mp.events.remove(rpcName);
  }

  public callClient(player: RagePlayer, rpcName: string, ...args: unknown[]): Promise<unknown> {
    return player.net.callRPC(rpcName, ...args);
  }
}
