type Nullable<T> = T | null | undefined;

type Callback = () => unknown;
type Callback1<T> = (arg: T) => unknown;

type Style = {
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

type StyleGroup = {
  name: string;
  styles: Style[];
};

type StylesAvailableTab = "txt2img" | "img2img";

type WebUiTab = StylesAvailableTab | "other";

type ValueGetter<T> = {
  get(): Nullable<T>;
  getOrDefault(defaultValue: T): T;
  with(callback: Callback1<T>): void;
};

type ValueSetter<T> = {
  set(value: T): boolean;
};

type ValueAccessor<T> = ValueGetter<T> & ValueSetter<T>;
