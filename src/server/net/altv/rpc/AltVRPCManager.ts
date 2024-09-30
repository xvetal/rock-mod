import { IRPCManager } from "../../common/rpc/IRPCManager";
import { AltVPlayer } from "../../../entities/altv/player/AltVPlayer";
import alt = AltVServer;
import shared = AltVShared;

interface IAltVRPCName extends shared.ICustomClientServerRpc {}

export class AltVRPCManager implements IRPCManager {
  public register(rpcName: keyof IAltVRPCName, handler: (player: AltVPlayer, ...args: unknown[]) => unknown): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return alt.onRpc(rpcName, handler);
  }

  public unregister(rpcName: string): void {
    return alt.offRpc(rpcName);
  }

  public callClient(player: AltVPlayer, rpcName: string, ...args: unknown[]): Promise<unknown> {
    return player.net.callRPC(rpcName, ...args);
  }
}
