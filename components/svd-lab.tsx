"use client";

import { useMemo, useState } from "react";

import { ModuleShell } from "@/components/module-shell";
import { MathBlock } from "@/components/math-block";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { svdSliders, svdTheorySections } from "@/lib/site-config";
import type { Matrix2D, SvdState } from "@/lib/types";

const INITIAL_STATE: SvdState = {
  sigma1: 2.4,
  sigma2: 1.1,
  thetaDeg: 28,
  shear: 0.3,
  density: 10
};

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

function computeMatrix(state: SvdState): Matrix2D {
  const theta = toRadians(state.thetaDeg);
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const r = [
    [cos, -sin],
    [sin, cos]
  ];
  const s = [
    [state.sigma1, state.shear],
    [0, state.sigma2]
  ];

  return {
    a11: r[0][0] * s[0][0] + r[0][1] * s[1][0],
    a12: r[0][0] * s[0][1] + r[0][1] * s[1][1],
    a21: r[1][0] * s[0][0] + r[1][1] * s[1][0],
    a22: r[1][0] * s[0][1] + r[1][1] * s[1][1]
  };
}

function transformPoint(matrix: Matrix2D, x: number, y: number) {
  return {
    x: matrix.a11 * x + matrix.a12 * y,
    y: matrix.a21 * x + matrix.a22 * y
  };
}

function formatMatrix(matrix: Matrix2D) {
  return `\\begin{bmatrix}
${matrix.a11.toFixed(2)} & ${matrix.a12.toFixed(2)} \\\\
${matrix.a21.toFixed(2)} & ${matrix.a22.toFixed(2)}
\\end{bmatrix}`;
}

function mapToSvg(x: number, y: number) {
  return {
    x: 270 + x * 80,
    y: 270 - y * 80
  };
}

export function SvdLab() {
  const [state, setState] = useState<SvdState>(INITIAL_STATE);

  const matrix = useMemo(() => computeMatrix(state), [state]);
  const transformedSquare = useMemo(() => {
    const base = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1]
    ] as const;
    return base.map(([x, y]) => transformPoint(matrix, x, y));
  }, [matrix]);

  const points = useMemo(() => {
    const cloud: { x: number; y: number }[] = [];
    const density = Math.round(state.density);
    for (let ix = 0; ix < density; ix += 1) {
      for (let iy = 0; iy < density; iy += 1) {
        const x = -1 + (2 * ix) / (density - 1);
        const y = -1 + (2 * iy) / (density - 1);
        cloud.push(transformPoint(matrix, x, y));
      }
    }
    return cloud;
  }, [matrix, state.density]);

  const transformedBasis = useMemo(
    () => ({
      e1: transformPoint(matrix, 1, 0),
      e2: transformPoint(matrix, 0, 1)
    }),
    [matrix]
  );

  const squarePath = transformedSquare
    .map((point) => {
      const mapped = mapToSvg(point.x, point.y);
      return `${mapped.x},${mapped.y}`;
    })
    .join(" ");

  const visualization = (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-[#030712] p-4">
        <svg
          viewBox="0 0 540 540"
          className="h-[460px] w-full rounded-xl bg-[radial-gradient(circle_at_center,#071427_0%,#030712_70%)]"
        >
          <defs>
            <linearGradient id="square" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.18" />
            </linearGradient>
          </defs>
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

          <polygon
            points="190,350 350,350 350,190 190,190"
            fill="rgba(250,250,250,0.04)"
            stroke="rgba(250,250,250,0.32)"
            strokeDasharray="6 8"
          />
          <polygon points={squarePath} fill="url(#square)" stroke="#00d4ff" strokeWidth="2" />

          {points.map((point, index) => {
            const mapped = mapToSvg(point.x, point.y);
            return (
              <circle
                key={`${mapped.x}-${mapped.y}-${index}`}
                cx={mapped.x}
                cy={mapped.y}
                r="2.6"
                fill="rgba(250,250,250,0.7)"
              />
            );
          })}

          <line
            x1={270}
            y1={270}
            x2={mapToSvg(transformedBasis.e1.x, transformedBasis.e1.y).x}
            y2={mapToSvg(transformedBasis.e1.x, transformedBasis.e1.y).y}
            stroke="#00d4ff"
            strokeWidth="3.5"
          />
          <line
            x1={270}
            y1={270}
            x2={mapToSvg(transformedBasis.e2.x, transformedBasis.e2.y).x}
            y2={mapToSvg(transformedBasis.e2.x, transformedBasis.e2.y).y}
            stroke="#7c3aed"
            strokeWidth="3.5"
          />
          <text x="410" y="70" fill="#fafafa" fontSize="14">
            原始正方形
          </text>
          <text x="372" y="95" fill="#00d4ff" fontSize="14">
            SVD 作用后
          </text>
        </svg>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/5">
          <CardContent className="space-y-2 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-cyan/80">当前矩阵</div>
            <MathBlock formula={formatMatrix(matrix)} />
          </CardContent>
        </Card>
        <Card className="bg-white/5">
          <CardContent className="space-y-2 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-violet-soft">分解提示</div>
            <p className="text-sm leading-7 text-muted-foreground">
              旋转角度 <span className="text-foreground">{state.thetaDeg.toFixed(0)}°</span>，
              第一奇异值 <span className="text-foreground">σ₁={state.sigma1.toFixed(1)}</span>，
              第二奇异值 <span className="text-foreground">σ₂={state.sigma2.toFixed(1)}</span>，
              剪切量 <span className="text-foreground">{state.shear.toFixed(2)}</span>。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const controls = (
    <div className="space-y-6">
      {svdSliders.map((slider) => {
        const value = state[slider.key] as number;
        return (
          <div key={slider.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">{slider.label}</label>
              <span className="text-sm text-cyan">
                {value.toFixed(slider.step >= 1 ? 0 : 2)}
                {slider.unit ?? ""}
              </span>
            </div>
            <Slider
              value={[value]}
              min={slider.min}
              max={slider.max}
              step={slider.step}
              onValueChange={([next]) => {
                setState((prev) => ({ ...prev, [slider.key]: next }));
              }}
            />
          </div>
        );
      })}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-muted-foreground">
        <p className="font-medium text-foreground">观察建议</p>
        <ul className="mt-2 space-y-2">
          <li>1. 先把剪切调为 0，只看旋转与伸缩。</li>
          <li>2. 再改 σ₁ / σ₂，观察单位正方形如何被压扁或拉长。</li>
          <li>3. 最后加入剪切，感受非正交扰动带来的结构变化。</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ModuleShell
      badge="SVD Lab"
      title="SVD 可视化实验室"
      subtitle="左侧看理论，中间看矩阵如何改变图形，右侧直接调参数。这一页的目标不是只给公式，而是把分解过程变成直觉。"
      theory={svdTheorySections}
      visualization={visualization}
      controls={controls}
    />
  );
}
