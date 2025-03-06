import { type WeatherTypeEnum } from "../../../shared/common/world";

export interface IWorldTime {
  hour: number;
  minute: number;
  second: number;
}

export interface IWorldManager {
  get time(): IWorldTime;
  get weather(): WeatherTypeEnum;
  setTimeHour(value: number): void;
  setTimeMinute(value: number): void;
  setTimeSecond(value: number): void;
  setWeather(value: WeatherTypeEnum): void;
}
