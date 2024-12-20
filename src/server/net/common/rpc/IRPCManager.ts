import { IPlayer } from "../../../entities/common/player/IPlayer";
import { IClientRPCList, IServerRPCList } from "../../../../shared/net/common/rpc/types";

export interface IRPCManager {
  register<K extends keyof IServerRPCList>(
    rpcName: K,
    handler: (player: IPlayer, ...args: Parameters<IServerRPCList[K]>) => ReturnType<IServerRPCList[K]>,
  ): void;
  unregister<K extends keyof IServerRPCList>(rpcName: K): void;
  emitClient<K extends keyof IClientRPCList>(
    player: IPlayer,
    rpcName: K,
    ...args: Parameters<IClientRPCList[K]>
  ): Promise<ReturnType<IClientRPCList[K]>>;
}
