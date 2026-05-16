const createNotImplementedError = (path: string): Error => new Error(`${path}: not implemented yet`);

const createProxy = (path: string): unknown => {
  function notImplementedProxyTarget(): never {
    throw createNotImplementedError(path);
  }

  return new Proxy(notImplementedProxyTarget, {
    apply(): never {
      throw createNotImplementedError(path);
    },

    construct(): never {
      throw createNotImplementedError(path);
    },

    get(_target, property): unknown {
      if (property === "then") {
        return undefined;
      }

      return createProxy(`${path}.${String(property)}`);
    },

    set(_target, property): never {
      throw createNotImplementedError(`${path}.${String(property)}`);
    },
  });
};

export const createNotImplementedProxy = <T extends object>(name: string): T => createProxy(name) as T;
