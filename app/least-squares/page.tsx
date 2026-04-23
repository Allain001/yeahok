import { LegacyBridgeCard } from "@/components/legacy-bridge-card";
import { LeastSquaresLab } from "@/components/least-squares-lab";
import { LEGACY_APP_BASE } from "@/lib/site-config";

export default function LeastSquaresPage() {
  return (
    <div className="pb-10">
      <LeastSquaresLab />
      <div className="mx-auto max-w-7xl px-6">
        <LegacyBridgeCard
          title="对照旧作品里的最小二乘页"
          description="现在这页已经有新站自己的拟合直线和残差展示。如果你还想对照旧作品里更完整的 LSE 页面，也可以从这里直接打开。"
          legacyHref={`${LEGACY_APP_BASE}/?page=lse`}
        />
      </div>
    </div>
  );
}
