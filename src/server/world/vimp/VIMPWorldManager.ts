import { type IWorldManager, type IWorldTime } from "../common";
import type { WeatherTypeEnum } from "../../../shared/common/world";

export class CCMPWorldManager implements IWorldManager {
  public get time(): IWorldTime {
    return ccmp.world.time;
  }

  public get weather(): WeatherTypeEnum {
    return ccmp.world.weather as WeatherTypeEnum;
  }

  public setTimeHour(value: number): void {
    ccmp.world.hour = value;
  }

  public setTimeMinute(value: number): void {
    ccmp.world.minute = value;
  }

  public setTimeSecond(value: number): void {
    ccmp.world.second = value;
  }

  public setWeather(value: WeatherTypeEnum): void {
    ccmp.world.weather = value;
  }
}
