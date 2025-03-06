import { type IWorldManager, type IWorldTime } from "../common";
import { WeatherTypeEnum } from "../../../shared/common/world";

export class MockWorldManager implements IWorldManager {
  private readonly _time: IWorldTime;

  private _weather: WeatherTypeEnum;

  public constructor() {
    this._time = {
      hour: 12,
      minute: 0,
      second: 0,
    };
    this._weather = WeatherTypeEnum.CLEAR;
  }

  public get time(): IWorldTime {
    return this._time;
  }

  public get weather(): WeatherTypeEnum {
    return this._weather;
  }

  public setTimeHour(value: number): void {
    this._time.hour = MockWorldManager._normalizeHours(value);
  }

  public setTimeMinute(value: number): void {
    this._time.minute = MockWorldManager._normalizeMinutes(value);
  }

  public setTimeSecond(value: number): void {
    this._time.second = MockWorldManager._normalizeSeconds(value);
  }

  public setWeather(value: WeatherTypeEnum): void {
    this._weather = value;
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
