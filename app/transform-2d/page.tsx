import { LegacyBridgeCard } from "@/components/legacy-bridge-card";
import { Transform2DLab } from "@/components/transform-2d-lab";
import { LEGACY_APP_BASE } from "@/lib/site-config";

export default function Transform2DPage() {
  return (
    <div className="pb-10">
      <Transform2DLab />
      <div className="mx-auto max-w-7xl px-6">
        <LegacyBridgeCard
          title="对照旧作品里的二维变换页"
          description="这一页已经是新站自己的二维矩阵实验室了。如果你想和旧作品里更成熟的 2D Transform 页面做对照，也可以从这里直接打开。"
          legacyHref={`${LEGACY_APP_BASE}/?page=2d-transform`}
        />
      </div>
    </div>
  );
}
