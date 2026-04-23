import { LegacyBridgeCard } from "@/components/legacy-bridge-card";
import { SvdLab } from "@/components/svd-lab";
import { LEGACY_APP_BASE } from "@/lib/site-config";

export default function SvdPage() {
  return (
    <div className="pb-10">
      <SvdLab />
      <div className="mx-auto max-w-7xl px-6">
        <LegacyBridgeCard
          title="对照旧作品里的矩阵变换页"
          description="当前 SVD 页面已经是新站自己的交互页。如果你还想对照旧作品里已经跑通的矩阵演示，也可以继续打开旧作品里的 2D Transform 页面。"
          legacyHref={`${LEGACY_APP_BASE}/?page=2d-transform`}
        />
      </div>
    </div>
  );
}
