import { type IPlayer } from "../../../entities";
import { type IPlayerDamageRequest } from "../../common/events/types";
import { type IVIMPPlayerDamage } from "./VIMPEventsManager";

interface IDamageAnswer {
  readonly health: number;
  readonly armour: number;
  readonly lethal: boolean;
  readonly cancelled: boolean;
}

export interface IVIMPDamageRequestHandle {
  readonly request: IPlayerDamageRequest;
  /** Ends the answer: keeps the final values, later calls are logged and ignored. */
  readonly seal: () => void;
}

/** Wraps the VIMP damage argument, which is valid only while its handlers run. */
export function createVIMPDamageRequest(damage: IVIMPPlayerDamage, attacker: IPlayer | null): IVIMPDamageRequestHandle {
  let answer: IDamageAnswer | null = null;
  let warned = false;

  const ignoreLate = (method: string): void => {
    if (warned) return;
    warned = true;
    console.warn(`[rock-mod] rm::playerDamageRequest.${method}() called after the handlers returned; ignored`);
  };

  const request: IPlayerDamageRequest = Object.freeze({
    attacker,
    weapon: damage.weapon,
    cause: damage.cause,
    bone: damage.bone,
    distance: damage.distance,
    hits: damage.hits,
    estimated: damage.estimated,
    get health(): number {
      return answer ? answer.health : damage.health;
    },
    get armour(): number {
      return answer ? answer.armour : damage.armour;
    },
    get lethal(): boolean {
      return answer ? answer.lethal : damage.lethal;
    },
    get cancelled(): boolean {
      return answer ? answer.cancelled : damage.cancelled;
    },
    cancel(): void {
      if (answer) return ignoreLate("cancel");
      damage.cancel();
    },
    setDamage(health: number, armour?: number): void {
      if (answer) return ignoreLate("setDamage");
      damage.setDamage(health, armour);
    },
  });

  const seal = (): void => {
    if (answer) return;
    answer = Object.freeze({
      health: damage.health,
      armour: damage.armour,
      lethal: damage.lethal,
      cancelled: damage.cancelled,
    });
  };

  return { request, seal };
}
