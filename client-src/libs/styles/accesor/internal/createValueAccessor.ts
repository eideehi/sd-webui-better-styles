import type { ValueAccessor } from "..";

export function createValueAccessor<T>(obj: {
  get: () => Nullable<T>;
  set: (value: T) => void;
}): ValueAccessor<T> {
  return {
    ...obj,
    getOrDefault: (defaultValue: T) => {
      const value = obj.get();
      return value != null ? value : defaultValue;
    },
    with: (callback) => {
      const value = obj.get();
      if (value == null) return;
      callback(value);
    },
  };
}
