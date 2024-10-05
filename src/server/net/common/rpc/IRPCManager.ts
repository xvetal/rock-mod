import { IPlayer } from "../../../entities/common/player/IPlayer";

export interface INetServerRPC {}

export interface INetClientRPC {}

export interface IRPCManager {
  register<K extends keyof INetServerRPC>(
    rpcName: K,
    handler: (player: IPlayer, ...args: Parameters<INetServerRPC[K]>) => ReturnType<INetServerRPC[K]>,
  ): void;
  unregister<K extends keyof INetServerRPC>(rpcName: K): void;
  emitClient<K extends keyof INetClientRPC>(
    player: IPlayer,
    rpcName: K,
    ...args: Parameters<INetClientRPC[K]>
  ): Promise<ReturnType<INetClientRPC[K]>>;
}
