import { type IWorldManager, type IWorldTime } from "../common/IWorldManager";
import { WeatherTypeEnum } from "../../../shared/common/world";
import { type RockSandboxWeatherPreset } from "@rock-sandbox/types/server";
import { getRockSandbox } from "../../internal/getRockSandbox";

const fromNative: Record<RockSandboxWeatherPreset, WeatherTypeEnum> = {
  clear: WeatherTypeEnum.CLEAR,
  cloudy: WeatherTypeEnum.CLOUDS,
  overcast: WeatherTypeEnum.OVERCAST,
};
const toNative = new Map<WeatherTypeEnum, RockSandboxWeatherPreset>([
  [WeatherTypeEnum.CLEAR, "clear"],
  [WeatherTypeEnum.CLOUDS, "cloudy"],
  [WeatherTypeEnum.OVERCAST, "overcast"],
]);

export class RockSandboxWorldManager implements IWorldManager {
  public get time(): IWorldTime {
    return getRockSandbox().world.time;
  }

  public get weather(): WeatherTypeEnum {
    return fromNative[getRockSandbox().world.weather];
  }

  public setTimeHour(value: number): void {
    getRockSandbox().world.setTimeHour(value);
  }

  public setTimeMinute(value: number): void {
    getRockSandbox().world.setTimeMinute(value);
  }

  public setTimeSecond(value: number): void {
    getRockSandbox().world.setTimeSecond(value);
  }

  public setWeather(value: WeatherTypeEnum): void {
    getRockSandbox().world.setWeather(toNative.get(value) ?? (value as unknown as RockSandboxWeatherPreset));
  }
}
