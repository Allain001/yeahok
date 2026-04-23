import Link from "next/link";
import { ExternalLink, Orbit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LegacyBridgeCardProps {
  title: string;
  description: string;
  legacyHref?: string;
}

export function LegacyBridgeCard({ title, description, legacyHref }: LegacyBridgeCardProps) {
  return (
    <Card className="border-cyan/20 bg-gradient-to-br from-cyan/10 to-violet/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan/30 bg-cyan/10 text-cyan">
            <Orbit className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>和旧作品联动使用</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        {legacyHref ? (
          <Button
            asChild
            variant="outline"
            className="w-full justify-between border-cyan/30 bg-cyan/10 text-cyan hover:bg-cyan/20"
          >
            <Link href={legacyHref} target="_blank" rel="noreferrer">
              打开旧作品交互版
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
            这个模块目前只有新站版本，旧作品里还没有对应入口。
          </div>
        )}
      </CardContent>
    </Card>
  );
}
