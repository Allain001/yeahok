import { LegacyBridgeCard } from "@/components/legacy-bridge-card";
import { ProjectionLab } from "@/components/projection-lab";
import { LEGACY_APP_BASE } from "@/lib/site-config";

export default function Projection3DTo2DPage() {
  return (
    <div className="pb-10">
      <ProjectionLab />
      <div className="mx-auto max-w-7xl px-6">
        <LegacyBridgeCard
          title="对照旧作品里的 2×3 投影页"
          description="这页已经有新站自己的投影 demo。如果你还想和旧作品里更完整的 2×3 Projection 页面对照，可以从这里直接打开。"
          legacyHref={`${LEGACY_APP_BASE}/?page=2x3-projection`}
        />
      </div>
    </div>
  );
}
