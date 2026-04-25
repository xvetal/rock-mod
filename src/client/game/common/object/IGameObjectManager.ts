export interface IGameObjectManager {
  doorControl(
    modelHash: number,
    x: number,
    y: number,
    z: number,
    locked: boolean,
    xRotMult: number,
    yRotMult: number,
    zRotMult: number,
  ): void;
}
