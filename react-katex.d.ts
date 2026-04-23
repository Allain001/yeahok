declare module "react-katex" {
  import type { ComponentType, ReactNode } from "react";

  export interface MathComponentProps {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => ReactNode;
  }

  export const BlockMath: ComponentType<MathComponentProps>;
  export const InlineMath: ComponentType<MathComponentProps>;
}
