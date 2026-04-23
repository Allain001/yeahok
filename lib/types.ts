export type ModuleSlug =
  | "transform-2d"
  | "transform-3d"
  | "svd"
  | "pca"
  | "least-squares"
  | "ai-tutor";

export interface NavItem {
  title: string;
  href: `/${ModuleSlug}` | "/";
  description: string;
  accent: "cyan" | "violet";
  legacyHref?: string;
}

export interface TheorySection {
  id: string;
  title: string;
  content: string;
  formula?: string;
}

export interface ModuleSummary {
  slug: ModuleSlug;
  title: string;
  href: `/${ModuleSlug}`;
  description: string;
  status: "ready" | "beta";
  legacyHref?: string;
}

export interface SvdState {
  sigma1: number;
  sigma2: number;
  thetaDeg: number;
  shear: number;
  density: number;
}

export interface Transform2DState {
  a11: number;
  a12: number;
  a21: number;
  a22: number;
  density: number;
}

export interface PcaState {
  covariance: number;
  spreadX: number;
  spreadY: number;
  samples: number;
}

export interface LeastSquaresState {
  slope: number;
  intercept: number;
  noise: number;
  samples: number;
}

export interface Transform3DState {
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  shearXY: number;
  shearXZ: number;
  rotateXDeg: number;
  rotateYDeg: number;
}

export interface ProjectionState {
  angleDeg: number;
  flatten: number;
  depthMix: number;
  samples: number;
}

export interface SliderDefinition {
  key: keyof SvdState;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export interface Matrix2D {
  a11: number;
  a12: number;
  a21: number;
  a22: number;
}

export interface HeroStat {
  label: string;
  value: string;
}
