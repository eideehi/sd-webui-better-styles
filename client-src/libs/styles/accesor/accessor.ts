export interface ValueGetter<T> {
  get(): Nullable<T>;
  getOrDefault(defaultValue: T): T;
  with(callback: Callback1<T>): void;
}

export interface ValueSetter<T> {
  set(value: T): void;
}

export type ValueAccessor<T> = ValueGetter<T> & ValueSetter<T>;
