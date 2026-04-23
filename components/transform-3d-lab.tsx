"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Matrix4, Vector3 } from "three";
import { RotateCcw } from "lucide-react";

import { MathBlock } from "@/components/math-block";
import { ModuleShell } from "@/components/module-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { transform3DTheorySections } from "@/lib/site-config";
import type { Transform3DState } from "@/lib/types";

const INITIAL_STATE: Transform3DState = {
  scaleX: 1.4,
  scaleY: 0.95,
  scaleZ: 1.2,
  shearXY: 0.35,
  shearXZ: -0.2,
  rotateXDeg: 18,
  rotateYDeg: 26
};

const CUBE_VERTICES = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1]
] as const;

const CUBE_EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7]
] as const;

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

function buildTransformMatrix(state: Transform3DState) {
  const scaleShear = new Matrix4().set(
    state.scaleX,
    state.shearXY,
    state.shearXZ,
    0,
    0,
    state.scaleY,
    0,
    0,
    0,
    0,
    state.scaleZ,
    0,
    0,
    0,
    0,
    1
  );
  const rotationX = new Matrix4().makeRotationX(toRadians(state.rotateXDeg));
  const rotationY = new Matrix4().makeRotationY(toRadians(state.rotateYDeg));
  return rotationY.multiply(rotationX).multiply(scaleShear);
}

function formatMatrix3(matrix: Matrix4) {
  const e = matrix.elements;
  return `\\begin{bmatrix}
${e[0].toFixed(2)} & ${e[4].toFixed(2)} & ${e[8].toFixed(2)} \\\\
${e[1].toFixed(2)} & ${e[5].toFixed(2)} & ${e[9].toFixed(2)} \\\\
${e[2].toFixed(2)} & ${e[6].toFixed(2)} & ${e[10].toFixed(2)}
\\end{bmatrix}`;
}

function CubePreview({ matrix }: { matrix: Matrix4 }) {
  const originalVertices = useMemo(
    () => CUBE_VERTICES.map(([x, y, z]) => new Vector3(x, y, z)),
    []
  );
  const transformedVertices = useMemo(
    () => CUBE_VERTICES.map(([x, y, z]) => new Vector3(x, y, z).applyMatrix4(matrix)),
    [matrix]
  );
  const transformedBasis = useMemo(
    () => ({
      e1: new Vector3(1, 0, 0).applyMatrix4(matrix),
      e2: new Vector3(0, 1, 0).applyMatrix4(matrix),
      e3: new Vector3(0, 0, 1).applyMatrix4(matrix)
    }),
    [matrix]
  );

  return (
    <div className="h-[460px] overflow-hidden rounded-2xl border border-white/10 bg-[#030712]">
      <Canvas camera={{ position: [4.5, 3.4, 5.2], fov: 45 }}>
        <color attach="background" args={["#030712"]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[6, 6, 5]} intensity={2.2} color="#00d4ff" />
        <directionalLight position={[-5, 2, -4]} intensity={1.5} color="#7c3aed" />
        <gridHelper args={[8, 8, "#12324a", "#0a1828"]} position={[0, -2.2, 0]} />
        <axesHelper args={[2.8]} />

        {CUBE_EDGES.map(([start, end], index) => (
          <Line
            key={`orig-${index}`}
            points={[originalVertices[start], originalVertices[end]]}
            color="#6b7280"
            transparent
            opacity={0.45}
            lineWidth={1}
          />
        ))}

        {CUBE_EDGES.map(([start, end], index) => (
          <Line
            key={`trans-${index}`}
            points={[transformedVertices[start], transformedVertices[end]]}
            color="#00d4ff"
            transparent
            opacity={0.95}
            lineWidth={2.2}
          />
        ))}

        <Line points={[new Vector3(0, 0, 0), transformedBasis.e1]} color="#00d4ff" lineWidth={2.6} />
        <Line points={[new Vector3(0, 0, 0), transformedBasis.e2]} color="#7c3aed" lineWidth={2.6} />
        <Line points={[new Vector3(0, 0, 0), transformedBasis.e3]} color="#fafafa" lineWidth={2.6} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

export function Transform3DLab() {
  const [state, setState] = useState<Transform3DState>(INITIAL_STATE);

  const matrix = useMemo(() => buildTransformMatrix(state), [state]);
  const determinant = useMemo(() => matrix.determinant(), [matrix]);

  const visualization = (
    <div className="space-y-5">
      <CubePreview matrix={matrix} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/5">
          <CardContent className="space-y-2 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-cyan/80">当前矩阵</div>
            <MathBlock formula={formatMatrix3(matrix)} />
          </CardContent>
        </Card>
        <Card className="bg-white/5">
          <CardContent className="space-y-2 pt-6">
            <div className="text-sm uppercase tracking-[0.24em] text-violet-soft">几何解释</div>
            <p className="text-sm leading-7 text-muted-foreground">
              行列式约为 <span className="text-foreground">{determinant.toFixed(2)}</span>，
              对应体积缩放约为
              <span className="text-foreground"> {Math.abs(determinant).toFixed(2)} 倍</span>；
              {determinant < 0 ? "空间朝向发生了翻转。" : "空间朝向保持不变。"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const controls = (
    <div className="space-y-6">
      {[
        { key: "scaleX", label: "X 方向伸缩", min: 0.4, max: 2.4, step: 0.05 },
        { key: "scaleY", label: "Y 方向伸缩", min: 0.4, max: 2.4, step: 0.05 },
        { key: "scaleZ", label: "Z 方向伸缩", min: 0.4, max: 2.4, step: 0.05 },
        { key: "shearXY", label: "XY 剪切", min: -1, max: 1, step: 0.05 },
        { key: "shearXZ", label: "XZ 剪切", min: -1, max: 1, step: 0.05 },
        { key: "rotateXDeg", label: "绕 X 旋转", min: -90, max: 90, step: 1 },
        { key: "rotateYDeg", label: "绕 Y 旋转", min: -180, max: 180, step: 1 }
      ].map(({ key, label, min, max, step }) => {
        const value = state[key as keyof Transform3DState] as number;
        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">{label}</label>
              <span className="text-sm text-cyan">
                {value.toFixed(step >= 1 ? 0 : 2)}
                {key.includes("Deg") ? "°" : ""}
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
        重置空间变换
      </Button>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-muted-foreground">
        <p className="font-medium text-foreground">观察建议</p>
        <ul className="mt-2 space-y-2">
          <li>1. 先只调 X / Y / Z 方向伸缩，观察立方体如何变成平行六面体。</li>
          <li>2. 再加入 XY、XZ 剪切，感受顶部和侧面的倾斜变化。</li>
          <li>3. 最后拖动旋转，从多个角度看清三根新基向量的去向。</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ModuleShell
      badge="3D Transform"
      title="3D 变换观察台"
      subtitle="这页先把空间变换最关键的立方体、基向量和体积缩放搬进新站。它不是最终版，但已经足够承担三维线性变换的讲解任务。"
      theory={transform3DTheorySections}
      visualization={visualization}
      controls={controls}
    />
  );
}
