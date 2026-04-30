export type SceneSectionId =
  | "hero"
  | "about"
  | "features"
  | "mechanics"
  | "modes"
  | "tech"
  | "connect"
  | "social";

export interface VisualAsset {
  id: string;
  src: string;
  alt: string;
}

export interface SectionDefinition {
  id: SceneSectionId;
  label: string;
  title: string;
  description: string;
  assetIndexes: number[];
}
