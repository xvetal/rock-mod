import { type IUtilsManager } from "../common";

export class MockUtilsManager implements IUtilsManager {
  public hash(value: string): number {
    // Simple hash function for mock mode
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}
