"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

import { MathBlock } from "@/components/math-block";
import { ModuleShell } from "@/components/module-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { leastSquaresTheorySections } from "@/lib/site-config";
import type { LeastSquaresState } from "@/lib/types";

const INITIAL_STATE: LeastSquaresState = {
  slope: 0.9,
  intercept: 0.4,
  noise: 0.45,
  samples: 18
};

function buildSamplePoints(state: LeastSquaresState) {
  const count = Math.round(state.samples);
  return Array.from({ length: count }, (_, index) => {
    const x = -4 + (8 * index) / Math.max(1, count - 1);
    const pattern = Math.sin(index * 1.37) * state.noise + Math.cos(index * 0.73) * state.noise * 0.3;
    const y = state.slope * x + state.intercept + pattern;
    const fitted = state.slope * x + state.intercept;
    return { x, y, fitted, residual: y - fitted };
  });
}

function mapToSvg(x: number, y: number) {
  return {
    x: 270 + x * 42,
    y: 270 - y * 42
  };
}

function fitFormula(state: LeastSquaresState) {
  const sign = state.intercept >= 0 ? "+" : "-";
  return `\\hat{y} = ${state.slope.toFixed(2)}x ${sign} ${Math.abs(state.intercept).toFixed(2)}`;
}

export function LeastSquaresLab() {
  const [state, setState] = useState<LeastSquaresState>(INITIAL_STATE);

  const points = useMemo(() => buildSamplePoints(state), [state]);
  const residualEnergy = useMemo(
    () => points.reduce((sum, point) => sum + point.residual ** 2, 0),
    [points]
  );
  const meanResidual = useMemo(
    () => points.reduce((sum, point) => sum + Math.abs(point.residual), 0) / points.length,
    [points]
  );

  const lineStart = mapToSvg(-4, state.slope * -4 + state.intercept);
  const lineEnd = mapToSvg(4, state.slope * 4 + state.intercept);

  const visualization = (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-[#030712] p-4">
        <svg
          viewBox="0 0 540 540"
          className="h-[460px] w-full rounded-xl bg-[radial-gradient(circle_at_center,#071427_0%,#030712_72%)]"
        >
          {Array.from({ length: 9 }).map((_, index) => {
            const offset = 110 + index * 40;
            return (
              <g key={offset}>
                <line x1={offset} y1={40} x2={offset} y2={500} stroke="rgba(255,255,255,0.05)" />
                <line x1={40} y1={offset} x2={500} y2={offset} stroke="rgba(255,255,255,0.05)" />
              </g>
            );
          })}
          <line x1={40} y1={270} x2={500} y2={270} stroke="rgba(255,255,255,0.18)" />
          <line x1={270} y1={40} x2={270} y2={500} stroke="rgba(255,255,255,0.18)" />

          <line x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y} stroke="#00d4ff" strokeWidth="4" />

          {points.map((point, index) => {
            const raw = mapToSvg(point.x, point.y);
            const fitted = mapToSvg(point.x, point.fitted);
            return (
              <g key={`${index}-${point.x.toFixed(2)}`}>
                <line
                  x1={raw.x}
                  y1={raw.y}
                  x2={fitted.x}
                  y2={fitted.y}
                  stroke="rgba(124,58,237,0.75)"
                  strokeDasharray="5 5"
                />
                <circle cx={raw.x} cy={raw.y} r="5" fill="#fafafa" />
                <circle cx={fitted.x} cy={fitted.y} r="3.2" fill="#00d4ff" />
              </g>
            );
          })}

          <text x="360" y="72" fill="#00d4ff" fontSize="14">
            拟合直线
          </text>
          <text x="360" y="96" fill="#7c3aed" fontSize="14">
            残差线段
          </text>
        </svg>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/5">
          <CardContent className="space-y-2 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-cyan/80">当前模型</div>
            <MathBlock formula={fitFormula(state)} />
          </CardContent>
        </Card>
        <Card className="bg-white/5">
          <CardContent className="space-y-2 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-violet-soft">误差摘要</div>
            <p className="text-sm leading-7 text-muted-foreground">
              残差平方和约为 <span className="text-foreground">{residualEnergy.toFixed(2)}</span>，
              平均残差幅度约为
              <span className="text-foreground"> {meanResidual.toFixed(2)}</span>。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const controls = (
    <div className="space-y-6">
      {[
        { key: "slope", label: "斜率", min: -2, max: 2, step: 0.05 },
        { key: "intercept", label: "截距", min: -2, max: 2, step: 0.05 },
        { key: "noise", label: "噪声强度", min: 0, max: 1.2, step: 0.01 },
        { key: "samples", label: "样本数量", min: 8, max: 28, step: 1 }
      ].map(({ key, label, min, max, step }) => {
        const value = state[key as keyof LeastSquaresState] as number;
        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">{label}</label>
              <span className="text-sm text-cyan">{value.toFixed(step >= 1 ? 0 : 2)}</span>
            </div>
            <Slider
              value={[value]}
              min={min}
              max={max}
              step={step}
              onValueChange={([next]) =>
                setState((prev) => ({
                  ...prev,
                  [key]: next
                }))
              }
            />
          </div>
        );
      })}

      <Button variant="outline" className="w-full justify-center" onClick={() => setState(INITIAL_STATE)}>
        <RotateCcw className="mr-2 h-4 w-4" />
        重置样本
      </Button>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-muted-foreground">
        <p className="font-medium text-foreground">观察建议</p>
        <ul className="mt-2 space-y-2">
          <li>1. 先固定噪声，只调斜率和截距，理解模型参数如何改变拟合线。</li>
          <li>2. 再增大噪声，观察残差线段如何整体变长。</li>
          <li>3. 最后把它和投影视角联系起来，理解“误差最小”为什么对应正交投影。</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ModuleShell
      badge="Least Squares"
      title="最小二乘工作台"
      subtitle="这页把拟合直线、残差和误差量级搬进了新站。你可以直接拖动参数，观察最小二乘从公式变成图形之后的样子。"
      theory={leastSquaresTheorySections}
      visualization={visualization}
      controls={controls}
    />
  );
}
