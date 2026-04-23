"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

import { ModuleShell } from "@/components/module-shell";
import { MathBlock } from "@/components/math-block";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { transform2DTheorySections } from "@/lib/site-config";
import type { Transform2DState } from "@/lib/types";

const INITIAL_STATE: Transform2DState = {
  a11: 1.2,
  a12: 0.45,
  a21: -0.2,
  a22: 1.1,
  density: 9
};

function transformPoint(state: Transform2DState, x: number, y: number) {
  return {
    x: state.a11 * x + state.a12 * y,
    y: state.a21 * x + state.a22 * y
  };
}

function mapToSvg(x: number, y: number) {
  return {
    x: 270 + x * 80,
    y: 270 - y * 80
  };
}

function formatMatrix(state: Transform2DState) {
  return `\\begin{bmatrix}
${state.a11.toFixed(2)} & ${state.a12.toFixed(2)} \\\\
${state.a21.toFixed(2)} & ${state.a22.toFixed(2)}
\\end{bmatrix}`;
}

export function Transform2DLab() {
  const [state, setState] = useState<Transform2DState>(INITIAL_STATE);

  const determinant = useMemo(
    () => state.a11 * state.a22 - state.a12 * state.a21,
    [state.a11, state.a12, state.a21, state.a22]
  );

  const transformedBasis = useMemo(
    () => ({
      e1: transformPoint(state, 1, 0),
      e2: transformPoint(state, 0, 1)
    }),
    [state]
  );

  const transformedSquare = useMemo(() => {
    const base = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1]
    ] as const;
    return base.map(([x, y]) => transformPoint(state, x, y));
  }, [state]);

  const points = useMemo(() => {
    const density = Math.max(2, Math.round(state.density));
    const result: { x: number; y: number }[] = [];
    for (let ix = 0; ix < density; ix += 1) {
      for (let iy = 0; iy < density; iy += 1) {
        const x = -1 + (2 * ix) / (density - 1);
        const y = -1 + (2 * iy) / (density - 1);
        result.push(transformPoint(state, x, y));
      }
    }
    return result;
  }, [state]);

  const polygonPath = transformedSquare
    .map((point) => {
      const mapped = mapToSvg(point.x, point.y);
      return `${mapped.x},${mapped.y}`;
    })
    .join(" ");

  const controls = (
    <div className="space-y-6">
      {[
        { key: "a11", label: "a11" },
        { key: "a12", label: "a12" },
        { key: "a21", label: "a21" },
        { key: "a22", label: "a22" }
      ].map(({ key, label }) => {
        const value = state[key as keyof Transform2DState] as number;
        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">{label}</label>
              <span className="text-sm text-cyan">{value.toFixed(2)}</span>
            </div>
            <Slider
              value={[value]}
              min={-2.5}
              max={2.5}
              step={0.05}
              onValueChange={([next]) => {
                setState((prev) => ({
                  ...prev,
                  [key]: next
                }));
              }}
            />
          </div>
        );
      })}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">采样密度</label>
          <span className="text-sm text-cyan">{state.density.toFixed(0)}</span>
        </div>
        <Slider
          value={[state.density]}
          min={5}
          max={16}
          step={1}
          onValueChange={([next]) => {
            setState((prev) => ({ ...prev, density: next }));
          }}
        />
      </div>

      <Button variant="outline" className="w-full justify-center" onClick={() => setState(INITIAL_STATE)}>
        <RotateCcw className="mr-2 h-4 w-4" />
        重置矩阵
      </Button>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-muted-foreground">
        <p className="font-medium text-foreground">观察建议</p>
        <ul className="mt-2 space-y-2">
          <li>1. 先看两根基向量，理解矩阵两列各自的几何含义。</li>
          <li>2. 再看单位正方形，它会把面积和朝向变化直接显示出来。</li>
          <li>3. 最后关注行列式，判断它是在伸缩、翻转还是接近压扁。</li>
        </ul>
      </div>
    </div>
  );

  const visualization = (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-[#030712] p-4">
        <svg
          viewBox="0 0 540 540"
          className="h-[460px] w-full rounded-xl bg-[radial-gradient(circle_at_center,#071427_0%,#030712_70%)]"
        >
          <defs>
            <linearGradient id="transform-fill" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
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
          <polygon points={polygonPath} fill="url(#transform-fill)" stroke="#00d4ff" strokeWidth="2" />

          {points.map((point, index) => {
            const mapped = mapToSvg(point.x, point.y);
            return (
              <circle
                key={`${index}-${mapped.x}-${mapped.y}`}
                cx={mapped.x}
                cy={mapped.y}
                r="2.5"
                fill="rgba(250,250,250,0.72)"
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
          <text x="392" y="70" fill="#fafafa" fontSize="14">
            原始单位正方形
          </text>
          <text x="365" y="95" fill="#00d4ff" fontSize="14">
            变换后的图形
          </text>
        </svg>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/5">
          <CardContent className="space-y-2 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-cyan/80">当前矩阵</div>
            <MathBlock formula={formatMatrix(state)} />
          </CardContent>
        </Card>
        <Card className="bg-white/5">
          <CardContent className="space-y-3 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-violet-soft">几何解释</div>
            <p className="text-sm leading-7 text-muted-foreground">
              行列式为 <span className="text-foreground">{determinant.toFixed(2)}</span>，
              对应面积缩放约为
              <span className="text-foreground"> {Math.abs(determinant).toFixed(2)} 倍</span>；
              {determinant < 0 ? "同时发生了朝向翻转。" : "整体朝向保持不变。"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <ModuleShell
      badge="2D Transform"
      title="二维变换实验室"
      subtitle="这页已经是新站自己的二维矩阵交互页。你可以一边拖动矩阵参数，一边观察网格、基向量和单位正方形如何同步变化。"
      theory={transform2DTheorySections}
      visualization={visualization}
      controls={controls}
    />
  );
}
