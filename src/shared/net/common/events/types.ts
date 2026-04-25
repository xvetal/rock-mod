import { type IBaseObjectDto } from "../../../entities";

export enum ServerToClientEventName {
  TestServerToClientEvent = "rm::testServerToClientEvent",
  EntityCreated = "rm::serverEntityCreated",
  EntityDestroyed = "rm::serverEntityDestroyed",
}

export enum ClientToServerEventName {
  TestClientToServerEvent = "rm::testClientToServerEvent",
}

export interface IServerToClientEvents {
  [ServerToClientEventName.TestServerToClientEvent]: () => void;
  [ServerToClientEventName.EntityCreated]: (entity: IBaseObjectDto) => void;
  [ServerToClientEventName.EntityDestroyed]: (entity: IBaseObjectDto) => void;
}

export interface IClientToServerEvents {
  [ClientToServerEventName.TestClientToServerEvent]: () => void;
}
