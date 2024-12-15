export enum ClientRPCName {
  TestClientRPC = "rm::testClientRPC",
}

export enum ServerRPCName {
  TestServerRPC = "rm::testServerRPC",
}

export interface IClientRPCList {
  [ClientRPCName.TestClientRPC]: () => void;
}

export interface IServerRPCList {
  [ServerRPCName.TestServerRPC]: () => void;
}
