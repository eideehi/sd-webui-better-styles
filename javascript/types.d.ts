declare type Style = {
  name: string;
  image?: string;
  checkpoint?: string;
  prompt?: string;
  negativePrompt?: string;
  samplingMethod?: string;
  cfgScale?: number;
};

declare type StyleGroup = {
  name: string,
  styles: Style[]
};

declare type StylesAvailableTab = "txt2img" | "img2img";

declare type WebUiTab = StylesAvailableTab | "other";

declare type ValueGetter<T> = {
  get: () => T;
};

declare type ValueSetter<T> = {
  set: (value: T) => void;
};

declare type ValueAccessor<T> = ValueGetter<T> & ValueSetter<T>;