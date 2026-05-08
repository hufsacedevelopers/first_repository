import {
  LandingDemoScenario,
  LandingFeatures,
  LandingHero,
  LandingWhy,
} from "@/components/home/landing-sections";
import SiteHeader from "@/components/SiteHeader";
import { getLiveJobsTotal } from "@/lib/data";

export default async function HomePage() {
  const liveJobsTotal = await getLiveJobsTotal();

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main>
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-6 md:px-8 md:pt-10">
          <LandingHero liveJobsTotal={liveJobsTotal} />
        </div>

        <LandingFeatures />
        <LandingWhy />
        <LandingDemoScenario />

        <footer className="border-t border-slate-200/80 pb-12 pt-10">
          <p className="text-center text-sm text-slate-500">
            ChoiceWork · 공공데이터포털·한국장애인고용공단 정보 연계 · 장애인 취업 의사결정 MVP
          </p>
        </footer>
      </main>
    </div>
  );
}
