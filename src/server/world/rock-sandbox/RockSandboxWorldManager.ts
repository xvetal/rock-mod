import { type IWorldManager, type IWorldTime } from "../common/IWorldManager";
import { type WeatherTypeEnum } from "../../../shared/common/world";
import { rockSandboxNotImplemented } from "../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxWorldManager implements IWorldManager {
  public get time(): IWorldTime {
    return rockSandboxNotImplemented("server", "RockSandboxWorldManager.time");
  }

  public get weather(): WeatherTypeEnum {
    return rockSandboxNotImplemented("server", "RockSandboxWorldManager.weather");
  }

  public setTimeHour(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxWorldManager.setTimeHour");
  }

  public setTimeMinute(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxWorldManager.setTimeMinute");
  }

  public setTimeSecond(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxWorldManager.setTimeSecond");
  }

  public setWeather(_value: WeatherTypeEnum): void {
    return rockSandboxNotImplemented("server", "RockSandboxWorldManager.setWeather");
  }
}
