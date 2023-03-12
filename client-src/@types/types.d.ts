declare type Style = {
  name: string;
  image?: string;
  checkpoint?: string;
  prompt?: string;
  negativePrompt?: string;
  samplingMethod?: string;
  samplingSteps?: number;
  cfgScale?: number;
  seed?: number;
  restoreFaces?: boolean;
  tiling?: boolean;
  hiresFix?: boolean;
  upscaler?: string;
  hiresSteps?: number;
  denoisingStrength?: number;
  upscaleBy?: number;
  clipSkip?: number;
  etaNoiseSeedDelta?: number;
};

declare type StyleGroup = {
  name: string,
  styles: Style[]
};

declare type StylesAvailableTab = "txt2img" | "img2img";

declare type WebUiTab = StylesAvailableTab | "other";

declare type ValueGetter<T> = {
  get(): T | null;
  getOrDefault(defaultValue: T): T;
  with(callback: (value: T) => void): void;
};

declare type ValueSetter<T> = {
  set(value: T): boolean;
};

declare type ValueAccessor<T> = ValueGetter<T> & ValueSetter<T>;