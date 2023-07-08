type Nullable<T> = T | null | undefined;

type Callback = () => unknown;
type Callback1<T> = (arg: T) => unknown;

type StylesAvailableTab = "txt2img" | "img2img";

type WebUiTab = StylesAvailableTab | "other";
