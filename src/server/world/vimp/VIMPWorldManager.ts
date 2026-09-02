import { type IWorldManager, type IWorldTime } from "../common";
import type { WeatherTypeEnum } from "../../../shared/common/world";

export class VIMPWorldManager implements IWorldManager {
  public get time(): IWorldTime {
    return vimp.world.time;
  }

  public get weather(): WeatherTypeEnum {
    return vimp.world.weather as WeatherTypeEnum;
  }

  public setTimeHour(value: number): void {
    vimp.world.hour = value;
  }

  public setTimeMinute(value: number): void {
    vimp.world.minute = value;
  }

  public setTimeSecond(value: number): void {
    vimp.world.second = value;
  }

  public setWeather(value: WeatherTypeEnum): void {
    vimp.world.weather = value;
  }
}
