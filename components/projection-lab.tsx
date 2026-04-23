"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

import { MathBlock } from "@/components/math-block";
import { ModuleShell } from "@/components/module-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { projectionTheorySections } from "@/lib/site-config";
import type { ProjectionState } from "@/lib/types";

const INITIAL_STATE: ProjectionState = {
  angleDeg: 34,
  flatten: 0.72,
  depthMix: 0.42,
  samples: 28
};

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

function generateCloud(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const t = index / Math.max(1, count - 1);
    const theta = t * Math.PI * 4.5;
    const radius = 0.8 + Math.sin(index * 0.73) * 0.18;
    return {
      x: Math.cos(theta) * radius,
      y: -1.1 + 2.2 * t + Math.sin(index * 0.31) * 0.12,
      z: Math.sin(theta) * radius
    };
  });
}

function map3DToSvg(x: number, y: number, z: number) {
  return {
    x: 170 + (x + z * 0.65) * 68,
    y: 230 - (y + z * 0.32) * 68
  };
}

function map2DToSvg(x: number, y: number) {
  return {
    x: 170 + x * 78,
    y: 230 - y * 78
  };
}

function formatProjectionMatrix(state: ProjectionState) {
  const angle = toRadians(state.angleDeg);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const p11 = c;
  const p12 = 0;
  const p13 = state.depthMix;
  const p21 = s * 0.35;
  const p22 = state.flatten;
  const p23 = 1 - state.depthMix * 0.4;

  return {
    values: [p11, p12, p13, p21, p22, p23],
    latex: `\\begin{bmatrix}
${p11.toFixed(2)} & ${p12.toFixed(2)} & ${p13.toFixed(2)} \\\\
${p21.toFixed(2)} & ${p22.toFixed(2)} & ${p23.toFixed(2)}
\\end{bmatrix}`
  };
}

export function ProjectionLab() {
  const [state, setState] = useState<ProjectionState>(INITIAL_STATE);

  const cloud = useMemo(() => generateCloud(Math.round(state.samples)), [state.samples]);
  const projectionMatrix = useMemo(() => formatProjectionMatrix(state), [state]);

  const projectedCloud = useMemo(() => {
    const [p11, p12, p13, p21, p22, p23] = projectionMatrix.values;
    return cloud.map((point) => ({
      x: p11 * point.x + p12 * point.y + p13 * point.z,
      y: p21 * point.x + p22 * point.y + p23 * point.z
    }));
  }, [cloud, projectionMatrix.values]);

  const visualization = (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#030712] p-4">
          <div className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan/80">三维点云</div>
          <svg
            viewBox="0 0 340 260"
            className="h-[320px] w-full rounded-xl bg-[radial-gradient(circle_at_center,#071427_0%,#030712_72%)]"
          >
            {Array.from({ length: 6 }).map((_, index) => {
              const offset = 50 + index * 40;
              return (
                <g key={offset}>
                  <line x1={offset} y1={20} x2={offset} y2={240} stroke="rgba(255,255,255,0.05)" />
                  <line x1={20} y1={offset} x2={320} y2={offset} stroke="rgba(255,255,255,0.05)" />
                </g>
              );
            })}
            {cloud.map((point, index) => {
              const mapped = map3DToSvg(point.x, point.y, point.z);
              return <circle key={`${index}-${mapped.x}`} cx={mapped.x} cy={mapped.y} r="4.2" fill="rgba(250,250,250,0.78)" />;
            })}
            <text x="202" y="28" fill="#fafafa" fontSize="13">空间中的原始数据</text>
          </svg>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#030712] p-4">
          <div className="mb-3 text-sm uppercase tracking-[0.24em] text-violet-soft">二维投影</div>
          <svg
            viewBox="0 0 340 260"
            className="h-[320px] w-full rounded-xl bg-[radial-gradient(circle_at_center,#071427_0%,#030712_72%)]"
          >
            {Array.from({ length: 6 }).map((_, index) => {
              const offset = 50 + index * 40;
              return (
                <g key={offset}>
                  <line x1={offset} y1={20} x2={offset} y2={240} stroke="rgba(255,255,255,0.05)" />
                  <line x1={20} y1={offset} x2={320} y2={offset} stroke="rgba(255,255,255,0.05)" />
                </g>
              );
            })}
            {projectedCloud.map((point, index) => {
              const mapped = map2DToSvg(point.x, point.y);
              return <circle key={`${index}-${mapped.x}`} cx={mapped.x} cy={mapped.y} r="4.2" fill="rgba(0,212,255,0.88)" />;
            })}
            <text x="210" y="28" fill="#00d4ff" fontSize="13">平面中的投影结果</text>
          </svg>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/5">
          <CardContent className="space-y-2 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-cyan/80">当前投影矩阵</div>
            <MathBlock formula={projectionMatrix.latex} />
          </CardContent>
        </Card>
        <Card className="bg-white/5">
          <CardContent className="space-y-2 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-violet-soft">观察重点</div>
            <p className="text-sm leading-7 text-muted-foreground">
              调整角度会改变三维结构在平面中的朝向，增加深度混合会让 z 方向更多地影响二维结果，而压扁系数则决定 y 方向在输出里的保留程度。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const controls = (
    <div className="space-y-6">
      {[
        { key: "angleDeg", label: "观察角度", min: -80, max: 80, step: 1, unit: "°" },
        { key: "flatten", label: "纵向压缩", min: 0.3, max: 1.4, step: 0.01 },
        { key: "depthMix", label: "深度混合", min: -0.8, max: 0.8, step: 0.01 },
        { key: "samples", label: "样本数量", min: 12, max: 48, step: 1 }
      ].map(({ key, label, min, max, step, unit }) => {
        const value = state[key as keyof ProjectionState] as number;
        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">{label}</label>
              <span className="text-sm text-cyan">
                {value.toFixed(step >= 1 ? 0 : 2)}
                {unit ?? ""}
              </span>
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
        重置投影参数
      </Button>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-muted-foreground">
        <p className="font-medium text-foreground">讲解建议</p>
        <ul className="mt-2 space-y-2">
          <li>1. 先看左侧三维点云，建立原始空间结构的直觉。</li>
          <li>2. 再看右侧二维平面，理解投影后哪些方向被保住了。</li>
          <li>3. 最后拖动参数，对比不同投影矩阵会得到不同二维表达。</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ModuleShell
      badge="3D → 2D Projection"
      title="三维到二维投影"
      subtitle="这页把原作品里的 2×3 投影逻辑先迁进来一版。重点不是做复杂渲染，而是把投影矩阵如何压缩空间信息讲清楚。"
      theory={projectionTheorySections}
      visualization={visualization}
      controls={controls}
    />
  );
}
