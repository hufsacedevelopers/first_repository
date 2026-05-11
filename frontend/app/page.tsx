import {
  LandingHero,
  LandingFeatures,
} from "@/components/home/landing-sections";
import { getLiveJobsTotal } from "@/lib/data";

export default async function HomePage() {
  const liveJobsTotal = await getLiveJobsTotal();

  // SiteHeader와 footer는 layout.tsx로 옮겼으므로 여기서는 삭제합니다.
  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-6 md:px-8 md:pt-10">
      {/* 핵심 검색 영역 */}
      <LandingHero liveJobsTotal={liveJobsTotal} />
      {/* 주요 기능 아이콘/버튼 영역 */}
      <LandingFeatures />
    </div>
  );
}