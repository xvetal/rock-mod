import { type IWorldManager, type IWorldTime } from "../common";
import type { WeatherTypeEnum } from "../../../shared/common/world";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPWorldManager implements IWorldManager {
  public get time(): IWorldTime {
    return notImplemented("CCMPWorldManager.time");
  }

  public get weather(): WeatherTypeEnum {
    return notImplemented("CCMPWorldManager.weather");
  }

  public setTimeHour(_value: number): void {
    notImplemented("CCMPWorldManager.setTimeHour");
  }

  public setTimeMinute(_value: number): void {
    notImplemented("CCMPWorldManager.setTimeMinute");
  }

  public setTimeSecond(_value: number): void {
    notImplemented("CCMPWorldManager.setTimeSecond");
  }

  public setWeather(_value: WeatherTypeEnum): void {
    notImplemented("CCMPWorldManager.setWeather");
  }
}
