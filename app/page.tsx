import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { MatrixParticleScene } from "@/components/matrix-particle-scene";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LEGACY_APP_BASE, legacyRoute } from "@/lib/site-config";

const coreEntries = [
  {
    title: "二维变换",
    description: "从单位正方形、网格和基向量理解矩阵怎样改变图形。",
    href: legacyRoute("2d-transform"),
    accent: "cyan"
  },
  {
    title: "最小二乘",
    description: "从残差、拟合和平面关系理解什么叫最佳近似。",
    href: legacyRoute("lse"),
    accent: "violet"
  },
  {
    title: "投影与 PCA",
    description: "从降维、主方向与信息保留继续展开数据视角。",
    href: legacyRoute("pca-demo"),
    accent: "cyan"
  }
];

export default function HomePage() {
  return (
    <div className="pb-16">
      <section className="relative mx-auto mt-8 max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface px-8 py-14 shadow-[0_40px_120px_rgba(0,0,0,0.45)] md:px-14 md:py-20">
          <MatrixParticleScene />
          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1.5 text-xs uppercase tracking-[0.32em] text-cyan">
              martrixvis
            </div>
            <h1 className="text-5xl font-semibold tracking-tight text-foreground md:text-7xl">看见线性代数</h1>
            <p className="mt-4 text-2xl text-violet-soft md:text-3xl">从公式到直觉</p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              用图形、动画和参数交互，把矩阵变换、投影、主成分分析和最小二乘这些概念，变成可以直接观察和讲解的网页体验。
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href={legacyRoute("2d-transform")} target="_blank" rel="noreferrer">
                  进入二维变换
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={legacyRoute("lse")} target="_blank" rel="noreferrer">
                  打开最小二乘
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href={LEGACY_APP_BASE} target="_blank" rel="noreferrer">
                  进入完整实验站
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {coreEntries.map((entry) => (
            <Card key={entry.title} className="overflow-hidden">
              <CardHeader>
                <div
                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${
                    entry.accent === "cyan"
                      ? "border-cyan/30 bg-cyan/10 text-cyan"
                      : "border-violet/30 bg-violet/10 text-violet-soft"
                  }`}
                >
                  Module
                </div>
                <CardTitle className="mt-3">{entry.title}</CardTitle>
                <CardDescription>{entry.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link href={entry.href} target="_blank" rel="noreferrer">
                    进入模块
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
