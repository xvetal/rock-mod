import { type IPlayer } from "../../../entities";
import { type IPlayerDamageRequest } from "../../common/events/types";
import { type IVIMPPlayerDamage } from "./VIMPEventsManager";

/** Final answer of the handlers. */
interface IVIMPDamageAnswer {
  readonly health: number;
  readonly armour: number;
  readonly lethal: boolean | null;
  readonly cancelled: boolean;
}

export interface IVIMPDamageRequestHandle {
  readonly request: IPlayerDamageRequest;
  /** Ends the answer: keeps the final values, later calls are logged and ignored. */
  readonly seal: () => IVIMPDamageAnswer;
}

/**
 * Wraps the VIMP damage argument, which is valid only while its handlers run. `cancel()` is final
 * here (VIMP itself lets a later `setDamage` undo it), and `lethal` follows the replaced amounts.
 */
export function createVIMPDamageRequest(damage: IVIMPPlayerDamage, attacker: IPlayer | null): IVIMPDamageRequestHandle {
  let answer: IVIMPDamageAnswer | null = null;
  let replaced = false;
  let warnedLate = false;
  let warnedCancelled = false;

  const readLethal = (): boolean | null => {
    if (damage.cancelled) return false;
    if (!replaced) return damage.lethal;
    return damage.replacementLethal ?? null;
  };

  const ignoreLate = (method: string): void => {
    if (warnedLate) return;
    warnedLate = true;
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
    get lethal(): boolean | null {
      return answer ? answer.lethal : readLethal();
    },
    get cancelled(): boolean {
      return answer ? answer.cancelled : damage.cancelled;
    },
    cancel(): void {
      if (answer) {
        ignoreLate("cancel");
        return;
      }
      damage.cancel();
    },
    setDamage(health: number, armour?: number): void {
      if (answer) {
        ignoreLate("setDamage");
        return;
      }
      if (damage.cancelled) {
        if (!warnedCancelled) {
          warnedCancelled = true;
          console.warn("[rock-mod] rm::playerDamageRequest.setDamage() called after cancel(); ignored");
        }
        return;
      }
      damage.setDamage(health, armour);
      replaced = true;
    },
  });

  const seal = (): IVIMPDamageAnswer => {
    if (!answer) {
      answer = Object.freeze({
        health: damage.health,
        armour: damage.armour,
        lethal: readLethal(),
        cancelled: damage.cancelled,
      });
    }
    return answer;
  };

  return { request, seal };
}
