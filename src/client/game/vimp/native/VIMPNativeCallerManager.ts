/// <reference types="@vimp-mp/types/client" />

import { type INativeCallerManager } from "../../common/native/INativeCallerManager";
import { NATIVE_DISPATCH, type NativeDispatchEntry } from "./_generated/nativeDispatch";

/** Бинд `(thisArg, fn)` — нужна привязка namespace-объекта как `this` при вызове метода. */
type ResolvedNative = readonly [object, (...args: unknown[]) => unknown];

/**
 * Реализация `INativeCallerManager` под VIMP — полноценный generic dispatch
 * GTA V-нативов по hex-хэшу.
 *
 * ### Архитектура
 *
 * **Таблица hash→method** генерируется на build-time скриптом
 * `scripts/generate-native-dispatch.mjs` из alloc8or-format nativedb
 * (`scripts/data/natives.json`, ~6649 натов). Output:
 * `_generated/nativeDispatch.ts`. Каждая запись — `{ns: "<vimp-namespace>",
 * methods: ["<camelMethod1>", "<camelMethod2-fallback>"]}`, где `methods[]`
 * содержит канонический имя натива + все `old_names` алиасы (нужно потому
 * что VIMP-биндинги могут использовать либо новое каноническое, либо
 * легаси-имя в зависимости от момента генерации `@vimp-mp/types`).
 *
 * **Runtime resolve**: при первом вызове `callNative(hash, ...args)`:
 *  1. Lookup в `NATIVE_DISPATCH[hash.toLowerCase()]` → `{ns, methods[]}`.
 *  2. `vimp.natives[ns]` — берём namespace-объект.
 *  3. Перебираем `methods[]` в порядке: для первой существующей функции —
 *     биндим `[nsObj, fn]` в `_resolved` кэш.
 *  4. Зовём с args через `fn.apply(nsObj, args)`.
 *  5. Адаптируем return-shape (см. ниже).
 *
 * Lookup-кэш `_resolved` — Map с hash-ключом, чтобы не дёргать
 * `NATIVE_DISPATCH[]` + `_resolve()` на каждый вызов (multiple natives
 * вызываются на каждый render-tick).
 *
 * ### Адаптация return-shape (VIMP → RageMP-конвенция)
 *
 * VIMP-нативы для multi-return значений возвращают **объект** с именованными
 * полями (например, `getGameplayCamCoord()` → `{x, y, z}`). Геймод (написанный
 * под RageMP-конвенцию) ожидает **массив-кортеж** (`[x, y, z]`).
 *
 * Generic `_adaptResult`:
 *  - `boolean` (top-level) → `0` или `1` (RageMP'шный native-bool протокол:
 *    `mp.game.invoke(boolNative)` возвращает число).
 *  - Object с string-keys → `Object.values(obj)` (порядок гарантирован ES2015
 *    insertion-order для non-integer keys; VIMP-типы декларируют поля в
 *    каноническом порядке).
 *  - Nested object внутри tuple → рекурсивно тоже `Object.values()`
 *    (для нативов вроде `getShapeTestResult` с nested `endcoords: {x,y,z}`).
 *  - Bool **внутри** объекта/tuple → не конвертим (нужен для tuple-полей
 *    типа `[bool, x, y]` где геймод-тип честно ожидает boolean).
 *  - Primitives / arrays / null → passthrough.
 *
 * ### Hot path
 *
 * `callNative` вызывается из render-tick consumer'ов: `HudController`
 * (drawBlip), `CameraIdleController.onInterval`, `VehicleIndicatorService`,
 * `PolygonZoneRenderer`, `ScriptedMarker`, `ConeDebugRenderer`. После прогрева
 * `_resolved`-кэша — один Map.get + `fn.apply` + adapt-проход. Адапт — линейный
 * по числу полей возврата (обычно ≤ 5), стоимость незначительная.
 *
 * ### Ошибки
 *
 * - **Hash не в DB**: натив отсутствует в nativedb. Throws с подсказкой
 *   "обновите scripts/data/natives.json" — обычно случается для свежих
 *   build-specific натов, не вошедших в last-snapshot базы.
 * - **Namespace не в `vimp.natives`**: VIMP-runtime версия не имеет такого
 *   namespace'а. Throws с указанием ns.
 * - **Все method-кандидаты отсутствуют в namespace'е**: VIMP-биндинг не
 *   экспонирует ни одного из known-имён. Throws с перечислением кандидатов.
 */
export class VIMPNativeCallerManager implements INativeCallerManager {
  private readonly _resolved = new Map<string, ResolvedNative>();

  public callNative(hash: string, ...args: unknown[]): unknown {
    const key = hash.toLowerCase();
    let resolved = this._resolved.get(key);
    if (!resolved) {
      resolved = this._resolve(key, hash);
      this._resolved.set(key, resolved);
    }
    const [nsObj, fn] = resolved;
    const result = fn.apply(nsObj, args);
    return VIMPNativeCallerManager._adaptResult(result);
  }

  private _resolve(key: string, originalHash: string): ResolvedNative {
    const entry: NativeDispatchEntry | undefined = NATIVE_DISPATCH[key];
    if (!entry) {
      throw new Error(
        `VIMPNativeCallerManager.callNative: native hash "${originalHash}" не найден ` +
          "в nativedb (scripts/data/natives.json). Если натив был добавлен недавно " +
          "— обновите snapshot из VIMP-проекта и перезапустите " +
          "`node scripts/generate-native-dispatch.mjs`.",
      );
    }

    const natives = vimp.natives as unknown as Record<string, Record<string, unknown>>;
    const nsObj = natives[entry.ns] as Record<string, unknown> | undefined;
    if (!nsObj) {
      throw new Error(
        `VIMPNativeCallerManager.callNative: native hash "${originalHash}" — namespace ` +
          `"vimp.natives.${entry.ns}" отсутствует в runtime. Возможно, версия VIMP ` +
          "не соответствует версии nativedb.",
      );
    }

    for (const method of entry.methods) {
      const fn = nsObj[method];
      if (typeof fn === "function") {
        return [nsObj, fn as (...args: unknown[]) => unknown];
      }
    }

    throw new Error(
      `VIMPNativeCallerManager.callNative: native hash "${originalHash}" — ни один ` +
        `из method-кандидатов [${entry.methods.join(", ")}] не существует в ` +
        `vimp.natives.${entry.ns}. VIMP-биндинг не экспонирует этот натив; ` +
        "при необходимости — пропатчить @vimp-mp/types или маппинг в nativedb.",
    );
  }

  /**
   * Конвертация VIMP object-return → RageMP tuple-return.
   * См. block-комментарий класса (Адаптация return-shape).
   */
  private static _adaptResult(r: unknown): unknown {
    if (typeof r === "boolean") {
      // Top-level boolean → RageMP-конвенция 0/1.
      return r ? 1 : 0;
    }
    if (r === null || typeof r !== "object" || Array.isArray(r)) {
      return r;
    }
    // Object: flatten в tuple через Object.values, recursively для nested objects.
    // Booleans внутри объекта НЕ конвертим — геймод-типы могут честно ожидать bool
    // в multi-return tuple-полях.
    return Object.values(r as Record<string, unknown>).map((v) => {
      if (v !== null && typeof v === "object" && !Array.isArray(v)) {
        return Object.values(v as Record<string, unknown>);
      }
      return v;
    });
  }
}
