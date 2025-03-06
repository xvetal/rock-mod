import { type IWorldManager, type IWorldTime } from "../common";
import { type WeatherTypeEnum } from "../../../shared/common/world";

export class AltVWorldManager implements IWorldManager {
  public get time(): IWorldTime {
    throw new Error("World time was not implemented");
  }

  public get weather(): WeatherTypeEnum {
    throw new Error("World weather was not implemented");
  }

  public setTimeHour(): void {
    throw new Error("World time was not implemented");
  }

  public setTimeMinute(): void {
    throw new Error("World time was not implemented");
  }

  public setTimeSecond(): void {
    throw new Error("World time was not implemented");
  }

  public setWeather(): void {
    throw new Error("World weather was not implemented");
  }
}
