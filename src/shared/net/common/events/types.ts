export enum ServerToClientEventName {
  TestServerToClientEvent = "rm::testServerToClientEvent",
}

export enum ClientToServerEventName {
  TestClientToServerEvent = "rm::testClientToServerEvent",
}

export interface IServerToClientEvents {
  [ServerToClientEventName.TestServerToClientEvent]: () => void;
}

export interface IClientToServerEvents {
  [ClientToServerEventName.TestClientToServerEvent]: () => void;
}
