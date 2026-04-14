import { type IGraphicsManager, type IScreenTextOptions } from "@RockMod/client/game";
import { type IVector2D } from "@shared/index";

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
}
