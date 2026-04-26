import CompanyListSection from "@/components/CompanyListSection";
import JobCard from "@/components/JobCard";
import { companies, jobs } from "@/lib/mockData";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-primary-700">공공서비스 MVP</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          장애인 · 청년 맞춤형 취업 의사결정 플랫폼
        </h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          기업의 장애 친화도 데이터를 기반으로 더 적합한 일자리를 추천하고, 고용주에게는
          활용 가능한 지원금 정보를 연결하기 위한 초기 개발 환경입니다.
        </p>
      </section>

      <div className="mt-10">
        <CompanyListSection companies={companies} />
      </div>

      <section className="mt-12 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">추천 일자리</h2>
          <p className="mt-1 text-sm text-slate-600">
            추후 AI 추천 로직이 들어갈 영역을 mock 데이터로 구성했습니다.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={`${job.companyName}-${job.title}`} job={job} />
          ))}
        </div>
      </section>
    </main>
  );
}
