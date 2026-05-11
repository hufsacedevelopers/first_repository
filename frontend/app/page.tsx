// frontend/app/page.tsx

import { LandingHero } from "@/components/home/landing-sections";
import { getLiveJobsTotal } from "@/lib/data";

export default async function HomePage() {
  const liveJobsTotal = await getLiveJobsTotal();

  return (
    // 당근마켓처럼 화면 비율을 여유롭게 쓰고 중앙에 배치하기 위한 여백 설정
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center pb-20 pt-10">
      <div className="w-full mx-auto max-w-6xl px-6 md:px-8">
        <LandingHero liveJobsTotal={liveJobsTotal} />
      </div>
    </div>
  );
}