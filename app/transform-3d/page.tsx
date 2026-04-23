import { LegacyBridgeCard } from "@/components/legacy-bridge-card";
import { Transform3DLab } from "@/components/transform-3d-lab";
import { LEGACY_APP_BASE } from "@/lib/site-config";

export default function Transform3DPage() {
  return (
    <div className="pb-10">
      <Transform3DLab />
      <div className="mx-auto max-w-7xl px-6">
        <LegacyBridgeCard
          title="对照旧作品里的 3D 页面"
          description="现在这页已经有新站自己的立方体、基向量和体积解释。如果你还想对照旧作品里更完整的三维页面，也可以从这里打开。"
          legacyHref={`${LEGACY_APP_BASE}/?page=3d-transform`}
        />
      </div>
    </div>
  );
}
