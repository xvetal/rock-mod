/// <reference types="@classic-mp/types/client" />

/**
 * Имя приватного rock-mod события для зеркалирования клиентских `console.*`
 * вызовов в серверный stdout.
 *
 * Серверная сторона (`src/server/net/ccmp/CCMPNetManager.ts`) ловит это
 * событие и печатает payload через свой `console.log`/`error`/`warn`. Это
 * критически важно для отладки CCMP: на клиенте `console.log` идёт в игровую
 * консоль (F8), и разработчик в серверном терминале не видит ничего.
 */
const CLIENT_LOG_EVENT = "rm::clientLog";

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

const FORWARDED_LEVELS: readonly LogLevel[] = ["log", "info", "warn", "error", "debug"];

interface ClientLogPayload {
  level: LogLevel;
  args: unknown[];
}

type ConsoleMethod = (...args: unknown[]) => void;

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value, Object.getOwnPropertyNames(value as object));
  } catch {
    return "[unjsonable]";
  }
}

function safeToString(value: unknown): string {
  try {
    const s = String(value);
    return s === "[object Object]" ? safeJsonStringify(value) : s;
  } catch {
    return "[unstringifiable]";
  }
}

function safeReadString(value: unknown, key: string): string | undefined {
  try {
    const v = (value as Record<string, unknown>)[key];
    return typeof v === "string" ? v : undefined;
  } catch {
    return undefined;
  }
}

function looksLikeError(value: unknown): boolean {
  if (value instanceof Error) {
    return true;
  }
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  // Структурные признаки. Хотя бы один из: stack (V8 ставит на ошибки),
  // или name+message (классический duck-type).
  return typeof v["stack"] === "string" || (typeof v["name"] === "string" && typeof v["message"] === "string");
}

/**
 * Превращает аргумент в JSON-сериализуемое значение.
 *
 * Проблема: `JSON.stringify(new Error("..."))` возвращает `"{}"` — у Error
 * свойства `message`/`stack` не enumerable. Плюс под deno_core встречаются
 * "ошибки" не наследующие `Error.prototype` (cross-realm, ops_throw,
 * NotImplementedProxy через Proxy traps), для которых `instanceof Error`
 * возвращает false, но визуально они ошибки.
 *
 * Стратегия:
 *  1. Скаляры — как есть.
 *  2. Если есть `.message`/`.stack` / похожее на Error — пакуем в
 *     `__error`-обёртку с явно перечисленными полями.
 *  3. Объекты — пробуем `JSON.stringify`. Если пусто (`{}`/`[]`) или падает
 *     — добавляем `__toString` с `String(value)`.
 *  4. Худший случай — голая строка `String(value)`.
 */
function serializeArg(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  const type = typeof value;
  if (type === "string" || type === "number" || type === "boolean") {
    return value;
  }

  if (looksLikeError(value)) {
    return {
      __error: true,
      name: safeReadString(value, "name") ?? "Error",
      message: safeReadString(value, "message") ?? safeToString(value),
      stack: safeReadString(value, "stack"),
      toString: safeToString(value),
    };
  }

  try {
    const json = JSON.stringify(value);
    if (json && json !== "{}" && json !== "[]") {
      return value;
    }
    // Пустой JSON для непустого объекта — non-enumerable props. Дублируем
    // через String(...) чтобы на сервере хоть что-то прочиталось.
    return {
      __toString: safeToString(value),
      __raw: value,
    };
  } catch {
    return {
      __toString: safeToString(value),
    };
  }
}

/**
 * Создаёт обёртку для конкретного level. Извлечено в именованную функцию,
 * чтобы избежать `no-loop-func` (захват `ccmp` в замыкании внутри `for`).
 */
function createForwardingMethod(level: LogLevel, original: ConsoleMethod): ConsoleMethod {
  return (...args: unknown[]): void => {
    try {
      original(...args);
    } catch {
      // Локальный консоль-вывод не должен ломать форвард.
    }

    try {
      const payload: ClientLogPayload = {
        level,
        args: args.map(serializeArg),
      };
      ccmp.emitServer(CLIENT_LOG_EVENT, payload);
    } catch {
      // Если сервер недоступен (раннее в boot до handshake) — молча.
    }
  };
}

/**
 * Оборачивает `globalThis.console` так, чтобы каждый вызов
 * `console.log/info/warn/error/debug` дополнительно отправлялся на сервер.
 * Оригинальное поведение (вывод в локальный игровой лог) сохраняется.
 *
 * Идемпотентно: повторный `install()` ничего не делает.
 */
export class CCMPConsoleForwarder {
  private _installed = false;

  public install(): void {
    if (this._installed) {
      return;
    }
    this._installed = true;

    for (const level of FORWARDED_LEVELS) {
      const original = console[level]?.bind(console) as ConsoleMethod | undefined;
      if (!original) {
        continue;
      }

      console[level] = createForwardingMethod(level, original);
    }
  }
}
