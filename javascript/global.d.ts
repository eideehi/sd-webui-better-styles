// injected-script
declare let localization: Record<string, string>;

// script.js
declare function gradioApp(): Document | ShadowRoot;
declare function get_uiCurrentTab(): Element | null;
declare function onUiLoaded(callback: () => void): void;
declare function onUiTabChange(callback: () => void): void;

// javascript/localization.js
declare function getTranslation(text: string): string | undefined;

// javascript/ui.js
declare let opts: Record<string, string | number | boolean>;
declare function updateInput(target: HTMLElement): void;
