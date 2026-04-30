import CompanyListSection from "@/components/CompanyListSection";
import HeroSection from "@/components/HeroSection";
import JobsSection from "@/components/JobsSection";
import SiteHeader from "@/components/SiteHeader";
import StatsStrip from "@/components/StatsStrip";
import SupportSection from "@/components/SupportSection";
import { getCompanies, getJobs, getLiveJobsTotal } from "@/lib/data";

export default async function HomePage() {
  const [companies, jobs, liveJobsTotal] = await Promise.all([
    getCompanies(),
    getJobs(6),
    getLiveJobsTotal(),
  ]);

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <HeroSection />

        <div className="mt-10">
          <StatsStrip liveJobsTotal={liveJobsTotal} />
        </div>

        <div className="mt-16">
          <CompanyListSection companies={companies} />
        </div>

        <div className="mt-20">
          <JobsSection jobs={jobs} />
        </div>

        <div className="mt-20">
          <SupportSection />
        </div>

        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          <p>
            장애인 고용 의사결정 플랫폼 · 공공데이터포털 실시간 연동
          </p>
        </footer>
      </main>
    </div>
  );
}
