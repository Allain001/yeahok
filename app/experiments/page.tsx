import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { moduleSummaries } from "@/lib/site-config";

const usageSteps = [
  "先在新站里讲概念和理论结构。",
  "如果需要更稳定的现成实验，就从这里跳转到旧作品对应页面。",
  "如果某个模块已经迁进新站，就优先直接用新站原生交互。"
];

const extendedLegacyFeatures = [
  {
    title: "三维到二维投影",
    description: "新站里已经有第一版原生投影页，也保留旧作品入口方便对照。",
    href: "/projection-3d-2d",
    internal: true
  },
  {
    title: "二维到三维提升",
    description: "把二维数据提升到三维空间，适合讲嵌入、升维和空间表示。",
    href: "https://martrixvis-zh.onrender.com/?page=3x2-lifting",
    internal: false
  },
  {
    title: "SVD 图像压缩",
    description: "通过保留前 k 个奇异值，观察图像压缩与重建效果。",
    href: "https://martrixvis-zh.onrender.com/?page=svd-img-compression",
    internal: false
  },
  {
    title: "PCA 图像压缩",
    description: "用主成分重建图像，观察压缩率与细节保留之间的关系。",
    href: "https://martrixvis-zh.onrender.com/?page=pca-img-compression",
    internal: false
  }
];

export default function ExperimentsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-cyan/20 bg-gradient-to-br from-cyan/10 to-violet/10">
          <CardHeader>
            <div className="inline-flex w-fit rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-cyan">
              Legacy Bridge
            </div>
            <CardTitle className="text-4xl md:text-5xl">旧作品实验站入口</CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              这页专门解决“新站做门面，旧站做现成交互”的衔接问题。你可以先在新站里讲概念，再从这里一键进入已经跑通的旧作品实验页。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {usageSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-cyan">Step 0{index + 1}</div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>当前状态</CardTitle>
            <CardDescription>这页会告诉你哪些模块已经迁移，哪些仍适合从旧站进入。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-cyan">已迁移</div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                2D 变换、3D 变换、SVD、PCA、最小二乘和 AI 助教都已经可以直接在新站里展示。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-violet-soft">仍建议桥接</div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                目前更适合桥接的是旧作品里那些更完整的扩展实验，例如提升和图像压缩一类的页面。
              </p>
            </div>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/">
                返回首页继续浏览
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {moduleSummaries.map((module) => (
          <Card key={module.slug} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{module.title}</CardTitle>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {module.status}
                </span>
              </div>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-between">
                <Link href={module.href}>
                  查看新站页面
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              {module.legacyHref ? (
                <Button asChild className="w-full justify-between">
                  <Link href={module.legacyHref} target="_blank" rel="noreferrer">
                    打开旧作品交互版
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                  这个模块目前没有旧作品对照页，先以新站内容为主。
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <div className="mb-5">
          <div className="text-sm uppercase tracking-[0.28em] text-cyan">Extended Labs</div>
          <h2 className="mt-2 text-3xl font-semibold text-foreground">扩展实验入口</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
            这些模块暂时还没有完全迁入新站，但它们已经是原作品里比较成熟的交互内容。现在先通过这页统一接进来，方便你展示完整能力。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {extendedLegacyFeatures.map((feature) => (
            <Card key={feature.title} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full justify-between">
                  <Link
                    href={feature.href}
                    target={feature.internal ? undefined : "_blank"}
                    rel={feature.internal ? undefined : "noreferrer"}
                  >
                    {feature.internal ? "查看新站实验" : "打开旧作品实验"}
                    {feature.internal ? <ArrowUpRight className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
