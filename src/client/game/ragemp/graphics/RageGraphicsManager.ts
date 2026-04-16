import { type IGraphicsManager, type IScreenTextOptions } from "@RockMod/client/game";
import { type IVector3D, type IVector2D, Vector2D } from "@shared/index";

export class RageGraphicsManager implements IGraphicsManager {
  public drawText(text: string, position: IVector2D, options?: IScreenTextOptions): void {
    const arrayColor: RGBA = options?.color
      ? [options.color.r, options.color.g, options.color.b, options.color.a ?? 255]
      : [255, 255, 255, 255];

    mp.game.graphics.drawText(text, [position.x, position.y], {
      font: options?.font ?? 0,
      color: arrayColor,
      scale: options?.scale ?? [0.3, 0.3],
      outline: options?.outline ?? true,
      centre: options?.centre ?? false,
    });
  }

  public world3dToScreen2d(position: IVector3D): IVector2D | null {
    const { x, y, z } = position;
    const result = mp.game.graphics.world3dToScreen2d(new mp.Vector3(x, y, z));

    if (!result) {
      return null;
    }

    return new Vector2D(result.x, result.y);
  }

  public startScreenEffect(effectName: string, duration: number, looped: boolean): void {
    mp.game.graphics.startScreenEffect(effectName, duration, looped);
  }

  public stopScreenEffect(effectName: string): void {
    mp.game.graphics.stopScreenEffect(effectName);
  }
}
