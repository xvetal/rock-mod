import { IRPCManager } from "../../common/rpc/IRPCManager";
import { AltVPlayer } from "../../../entities/altv/player/AltVPlayer";

export class AltVRPCManager implements IRPCManager {
  public register(rpcName: string, handler: (player: AltVPlayer, dto: unknown) => unknown): void {
    return alt.onRpc(rpcName, handler);
  }

  public unregister(rpcName: string): void {
    return alt.offRpc(rpcName);
  }

  public callClient(player: AltVPlayer, rpcName: string, dto: unknown): Promise<unknown> {
    return player.net.callRPC(rpcName, dto);
  }
}
