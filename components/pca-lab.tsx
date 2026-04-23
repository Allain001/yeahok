"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

import { MathBlock } from "@/components/math-block";
import { ModuleShell } from "@/components/module-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { pcaTheorySections } from "@/lib/site-config";
import type { PcaState } from "@/lib/types";

const INITIAL_STATE: PcaState = {
  covariance: 0.72,
  spreadX: 2.2,
  spreadY: 0.95,
  samples: 42
};

function multiplyMatrixVector(
  matrix: [[number, number], [number, number]],
  vector: [number, number]
) {
  return {
    x: matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
    y: matrix[1][0] * vector[0] + matrix[1][1] * vector[1]
  };
}

function mapToSvg(x: number, y: number) {
  return {
    x: 270 + x * 52,
    y: 270 - y * 52
  };
}

function createBaseCloud(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const angle = index * 0.61;
    const radiusA = 0.55 + ((index * 37) % 17) / 18;
    const radiusB = 0.25 + ((index * 19) % 13) / 22;
    return {
      x: Math.cos(angle) * radiusA,
      y: Math.sin(angle * 1.6) * radiusB
    };
  });
}

function formatCovarianceMatrix(state: PcaState) {
  const xx = state.spreadX ** 2;
  const yy = state.spreadY ** 2;
  const xy = state.covariance * state.spreadX * state.spreadY;

  return `\\begin{bmatrix}
${xx.toFixed(2)} & ${xy.toFixed(2)} \\\\
${xy.toFixed(2)} & ${yy.toFixed(2)}
\\end{bmatrix}`;
}

function principalAxis(state: PcaState) {
  const a = state.spreadX ** 2;
  const d = state.spreadY ** 2;
  const b = state.covariance * state.spreadX * state.spreadY;
  const angle = 0.5 * Math.atan2(2 * b, a - d);
  return {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };
}

export function PcaLab() {
  const [state, setState] = useState<PcaState>(INITIAL_STATE);

  const cloud = useMemo(() => {
    const base = createBaseCloud(Math.round(state.samples));
    const matrix: [[number, number], [number, number]] = [
      [state.spreadX, state.covariance * state.spreadY],
      [0, state.spreadY]
    ];
    return base.map((point) => multiplyMatrixVector(matrix, [point.x, point.y]));
  }, [state]);

  const centroid = useMemo(() => {
    const sum = cloud.reduce(
      (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
      { x: 0, y: 0 }
    );
    return { x: sum.x / cloud.length, y: sum.y / cloud.length };
  }, [cloud]);

  const axis = useMemo(() => principalAxis(state), [state]);
  const projLength = 3.4;
  const axisStart = mapToSvg(centroid.x - axis.x * projLength, centroid.y - axis.y * projLength);
  const axisEnd = mapToSvg(centroid.x + axis.x * projLength, centroid.y + axis.y * projLength);
  const varianceRatio = (state.spreadX ** 2) / (state.spreadX ** 2 + state.spreadY ** 2);

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

          {cloud.map((point, index) => {
            const mapped = mapToSvg(point.x, point.y);
            return (
              <circle
                key={`${mapped.x}-${mapped.y}-${index}`}
                cx={mapped.x}
                cy={mapped.y}
                r="4.4"
                fill="rgba(0,212,255,0.78)"
              />
            );
          })}

          <line x1={axisStart.x} y1={axisStart.y} x2={axisEnd.x} y2={axisEnd.y} stroke="#7c3aed" strokeWidth="4" />
          <circle cx={mapToSvg(centroid.x, centroid.y).x} cy={mapToSvg(centroid.x, centroid.y).y} r="6" fill="#fafafa" />

          <text x="360" y="72" fill="#fafafa" fontSize="14">
            数据云
          </text>
          <text x="336" y="96" fill="#7c3aed" fontSize="14">
            第一主成分方向
          </text>
        </svg>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/5">
          <CardContent className="space-y-2 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-cyan/80">协方差矩阵</div>
            <MathBlock formula={formatCovarianceMatrix(state)} />
          </CardContent>
        </Card>
        <Card className="bg-white/5">
          <CardContent className="space-y-2 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-violet-soft">解释提示</div>
            <p className="text-sm leading-7 text-muted-foreground">
              第一主成分大约保留了
              <span className="text-foreground"> {(varianceRatio * 100).toFixed(1)}%</span>
              的伸展信息，当前相关性系数为
              <span className="text-foreground"> {state.covariance.toFixed(2)}</span>。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const controls = (
    <div className="space-y-6">
      {[
        { key: "spreadX", label: "主方向伸展", min: 0.8, max: 3.2, step: 0.05 },
        { key: "spreadY", label: "次方向伸展", min: 0.4, max: 2.2, step: 0.05 },
        { key: "covariance", label: "相关性", min: -0.95, max: 0.95, step: 0.01 },
        { key: "samples", label: "样本数量", min: 20, max: 60, step: 1 }
      ].map(({ key, label, min, max, step }) => {
        const value = state[key as keyof PcaState] as number;
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

      <Button variant="outline" className="w-full justify-center" onClick={() => setState(INITIAL_STATE)}>
        <RotateCcw className="mr-2 h-4 w-4" />
        重置数据云
      </Button>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-muted-foreground">
        <p className="font-medium text-foreground">观察建议</p>
        <ul className="mt-2 space-y-2">
          <li>1. 先放大主方向伸展，观察点云如何出现明显长轴。</li>
          <li>2. 再调相关性，看主轴如何在平面里旋转。</li>
          <li>3. 最后缩小次方向伸展，体会降维时信息如何集中到主轴附近。</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ModuleShell
      badge="PCA Lab"
      title="PCA 主成分实验室"
      subtitle="这页把 PCA 的核心直觉搬进了新站：看数据云、看主轴、看降维保留的信息比例，而不是只看协方差公式。"
      theory={pcaTheorySections}
      visualization={visualization}
      controls={controls}
    />
  );
}
