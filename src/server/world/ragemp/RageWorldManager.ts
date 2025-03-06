import { type IWorldManager, type IWorldTime } from "../common";
import type { WeatherTypeEnum } from "../../../shared/common/world";

export class RageWorldManager implements IWorldManager {
  public get time(): IWorldTime {
    return mp.world.time;
  }

  public get weather(): WeatherTypeEnum {
    return mp.world.weather as WeatherTypeEnum;
  }

  public setTimeHour(value: number): void {
    mp.world.time.hour = RageWorldManager._normalizeHours(value);
  }

  public setTimeMinute(value: number): void {
    mp.world.time.minute = RageWorldManager._normalizeMinutes(value);
  }

  public setTimeSecond(value: number): void {
    mp.world.time.second = RageWorldManager._normalizeSeconds(value);
  }

  public setWeather(value: WeatherTypeEnum): void {
    mp.world.weather = value;
  }

  private static _normalizeHours(hours: number): number {
    return ((hours % 24) + 24) % 24;
  }

  private static _normalizeMinutes(minutes: number): number {
    return ((minutes % 60) + 60) % 60;
  }

  private static _normalizeSeconds(seconds: number): number {
    return ((seconds % 60) + 60) % 60;
  }
}
