import { IPlayer } from "../../../entities/common/player/IPlayer";

export interface IRPCManager {
  register(rpcName: string, handler: (player: IPlayer, ...args: unknown[]) => unknown): void;
  unregister(rpcName: string): void;
  callClient(player: IPlayer, rpcName: string, ...args: unknown[]): Promise<unknown>;
}
