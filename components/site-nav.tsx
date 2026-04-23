import Link from "next/link";

import { navItems } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan/40 bg-cyan/10 text-cyan shadow-glow">
            M
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-cyan/80">martrixvis</div>
            <div className="text-base font-semibold text-foreground">看见线性代数</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const href = item.legacyHref ?? item.href;
            return (
              <Link
                key={item.title}
                href={href}
                target={item.legacyHref ? "_blank" : undefined}
                rel={item.legacyHref ? "noreferrer" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground",
                  item.accent === "cyan" ? "hover:shadow-glow" : "hover:shadow-violet"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <Button asChild variant="outline" size="sm">
          <Link href={navItems[0].legacyHref ?? "/" } target={navItems[0].legacyHref ? "_blank" : undefined} rel={navItems[0].legacyHref ? "noreferrer" : undefined}>
            进入演示
          </Link>
        </Button>
      </div>
    </header>
  );
}
