export interface Style {
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
}

export interface StyleGroup {
  name: string;
  styles: Style[];
}
