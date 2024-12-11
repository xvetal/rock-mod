declare global {
  interface EntityMp {
    isExists(): boolean;
    rotation: Vector3;
  }

  interface BlipMp {
    isExists(): boolean;
  }
}

export {};
