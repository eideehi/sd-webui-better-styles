type Nullable<T> = T | null | undefined;

type Callback = () => unknown;
type Callback1<T> = (arg: T) => unknown;

type ExtensionAvailableTab = "txt2img" | "img2img";

type WebUiTab = ExtensionAvailableTab | "other";
