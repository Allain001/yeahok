import { LegacyBridgeCard } from "@/components/legacy-bridge-card";
import { PcaLab } from "@/components/pca-lab";
import { LEGACY_APP_BASE } from "@/lib/site-config";

export default function PcaPage() {
  return (
    <div className="pb-10">
      <PcaLab />
      <div className="mx-auto max-w-7xl px-6">
        <LegacyBridgeCard
          title="对照旧作品里的 PCA 页面"
          description="现在这页已经有新站自己的 PCA 主轴可视化。如果你还想对照旧作品里更完整的 PCA Demo，也可以从这里直接跳过去。"
          legacyHref={`${LEGACY_APP_BASE}/?page=pca-demo`}
        />
      </div>
    </div>
  );
}
