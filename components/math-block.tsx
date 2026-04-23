import { BlockMath, InlineMath } from "react-katex";

export function MathBlock({ formula }: { formula: string }) {
  return <BlockMath math={formula} />;
}

export function MathInline({ formula }: { formula: string }) {
  return <InlineMath math={formula} />;
}
