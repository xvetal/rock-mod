import { type IWorldManager, type IWorldTime } from "../common/IWorldManager";
import { type WeatherTypeEnum } from "../../../shared/common/world";
import { rockSandboxNotImplemented } from "../../../shared/internal/rockSandboxNotImplemented";
import { getRockSandbox } from "../../internal/getRockSandbox";

export class RockSandboxWorldManager implements IWorldManager {
  public get time(): IWorldTime {
    return getRockSandbox().world.time;
  }

  public get weather(): WeatherTypeEnum {
    return rockSandboxNotImplemented("server", "RockSandboxWorldManager.weather");
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

  public setWeather(_value: WeatherTypeEnum): void {
    return rockSandboxNotImplemented("server", "RockSandboxWorldManager.setWeather");
  }
}
