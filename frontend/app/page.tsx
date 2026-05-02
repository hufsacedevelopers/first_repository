import CompanyListSection from "@/components/CompanyListSection";
import HeroSection from "@/components/HeroSection";
import JobsSection from "@/components/JobsSection";
import SiteHeader from "@/components/SiteHeader";
import StatsStrip from "@/components/StatsStrip";
import StepSection from "@/components/StepSection";
import SupportSection from "@/components/SupportSection";
import { getCompanies, getJobs, getLiveJobsTotal } from "@/lib/data";

export default async function HomePage() {
  const [companies, jobsPreview, liveJobsTotal] = await Promise.all([
    getCompanies(),
    getJobs(2),
    getLiveJobsTotal(),
  ]);

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <HeroSection />

        <div className="mt-8">
          <StatsStrip liveJobsTotal={liveJobsTotal} />
        </div>

        <StepSection
          step={1}
          title="내 장애 유형에 맞는 일자리 추천"
          description="추천 페이지에서 장애 유형·지역·고용형태를 고르면, 한국장애인고용공단 근무환경 데이터와 맞는 공고를 모아 확인할 수 있습니다. 아래는 실시간 연동되는 공고 미리보기입니다."
        >
          <JobsSection jobs={jobsPreview} variant="preview" previewLimit={2} />
        </StepSection>

        <StepSection
          step={2}
          title="기업별 장애 친화도와 근무환경 확인"
          description="고용률·접근성·표준사업장 여부 등 공공데이터를 바탕으로 기업 카드 점수를 비교합니다. 카드를 선택하면 상세 화면에서 지표 근거를 확인할 수 있습니다."
        >
          <CompanyListSection companies={companies} variant="preview" previewLimit={2} />
        </StepSection>

        <StepSection
          step={3}
          title="지원금 계산기와 공단 상담으로 행동 연결"
          description="대표 프로그램을 살펴본 뒤 계산기로 예상금을 참고하고, 한국장애인고용공단 페이지에서 신청·상담으로 이어갈 수 있습니다."
        >
          <SupportSection embedded />
        </StepSection>

        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          <p>
            장애인 고용 의사결정 플랫폼 · 공공데이터포털 실시간 연동
          </p>
        </footer>
      </main>
    </div>
  );
}
