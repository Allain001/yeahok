import { ReactNode } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MathBlock } from "@/components/math-block";
import type { TheorySection } from "@/lib/types";

interface ModuleShellProps {
  badge: string;
  title: string;
  subtitle: string;
  theory: TheorySection[];
  visualization: ReactNode;
  controls: ReactNode;
}

export function ModuleShell({
  badge,
  title,
  subtitle,
  theory,
  visualization,
  controls
}: ModuleShellProps) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
      <div className="space-y-3">
        <div className="inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-cyan">
          {badge}
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{title}</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>理论简述</CardTitle>
            <CardDescription>可折叠的概念摘要，适合边看边讲。</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue={theory[0]?.id}>
              {theory.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3 leading-7">{section.content}</p>
                    {section.formula ? (
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <MathBlock formula={section.formula} />
                      </div>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="min-h-[560px]">
          <CardHeader>
            <CardTitle>交互可视化区</CardTitle>
            <CardDescription>把公式、图形和结果放到同一个观察界面里。</CardDescription>
          </CardHeader>
          <CardContent>{visualization}</CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>参数控制</CardTitle>
            <CardDescription>拖动参数，实时观察矩阵、拟合和投影结果。</CardDescription>
          </CardHeader>
          <CardContent>{controls}</CardContent>
        </Card>
      </div>
    </section>
  );
}
