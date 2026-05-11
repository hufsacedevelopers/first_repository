import { getKeadSubsidyRows, getSupportedKeadYears } from "@/lib/kead-subsidy";
import { getStandardWorkplaces } from "@/lib/kead-standard-workplace";

const CONSULTING_STEPS = [
  {
    title: "1) 제도 확인",
    description: "사업장/구직자 기준으로 어떤 지원사업이 적용되는지 먼저 확인합니다.",
    actionLabel: "공단 서비스 안내",
    href: "https://www.kead.or.kr/view/service/service01.jsp",
  },
  {
    title: "2) 신청 준비",
    description: "고용장려금·근로지원인·보조공학기기 등 유형별 신청 요건과 준비 서류를 확인합니다.",
    actionLabel: "고용장려금 신청 안내",
    href: "https://www.kead.or.kr/view/service/service02_04_01.jsp",
  },
  {
    title: "3) 상담 연결",
    description: "지역 지사/담당 채널을 통해 실제 신청 전에 적합 유형을 상담받는 흐름을 권장합니다.",
    actionLabel: "대표 서비스 포털",
    href: "https://www.kead.or.kr/",
  },
] as const;

type SupportConsultingPageProps = {
  searchParams: Promise<{ year?: string; region?: string; industry?: string; standardName?: string; standardRegion?: string }>;
};

function summarizeByIndustry(rows: Awaited<ReturnType<typeof getKeadSubsidyRows>>) {
  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(row.industry, (map.get(row.industry) ?? 0) + row.companyCount);
  }
  return [...map.entries()]
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function buildGyeonggiPriorityRegions(regions: string[]) {
  const gyeonggiKeywords = ["경기", "경기도", "수원", "성남", "용인", "고양", "화성", "부천", "안산", "안양"];
  const isGyeonggi = (region: string) => gyeonggiKeywords.some((keyword) => region.includes(keyword));
  const gyeonggi = regions.filter(isGyeonggi);
  const others = regions.filter((region) => !isGyeonggi(region));
  return { gyeonggi, others };
}

function buildYearComparison(
  rows2023: Awaited<ReturnType<typeof getKeadSubsidyRows>>,
  rows2024: Awaited<ReturnType<typeof getKeadSubsidyRows>>,
  selectedRegion: string
) {
  const byIndustry = (rows: Awaited<ReturnType<typeof getKeadSubsidyRows>>) => {
    const map = new Map<string, number>();
    for (const row of rows) {
      if (selectedRegion && row.region !== selectedRegion) continue;
      map.set(row.industry, (map.get(row.industry) ?? 0) + row.companyCount);
    }
    return map;
  };

  const m2023 = byIndustry(rows2023);
  const m2024 = byIndustry(rows2024);
  const keys = new Set([...m2023.keys(), ...m2024.keys()]);

  return [...keys]
    .map((industry) => {
      const y2023 = m2023.get(industry) ?? 0;
      const y2024 = m2024.get(industry) ?? 0;
      return {
        industry,
        y2023,
        y2024,
        diff: y2024 - y2023,
      };
    })
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
    .slice(0, 8);
}

export default async function SupportConsultingPage({ searchParams }: SupportConsultingPageProps) {
  const params = await searchParams;
  const years = getSupportedKeadYears();
  const selectedYear = years.includes(params.year ?? "") ? (params.year as string) : years[0];

  const [rows, rows2023, rows2024] = await Promise.all([
    getKeadSubsidyRows(selectedYear),
    getKeadSubsidyRows("2023"),
    getKeadSubsidyRows("2024"),
  ]);
  const regions = [...new Set(rows.map((row) => row.region))].sort();
  const { gyeonggi, others } = buildGyeonggiPriorityRegions(regions);
  const selectedRegion = regions.includes(params.region ?? "") ? (params.region as string) : "";
  const topIndustriesByRegion = summarizeByIndustry(selectedRegion ? rows.filter((row) => row.region === selectedRegion) : rows);
  const selectedIndustry = topIndustriesByRegion.some((item) => item.industry === (params.industry ?? ""))
    ? (params.industry as string)
    : "";
  const filteredRows = rows.filter((row) => {
    if (selectedRegion && row.region !== selectedRegion) return false;
    if (selectedIndustry && row.industry !== selectedIndustry) return false;
    return true;
  });
  const topIndustries = summarizeByIndustry(filteredRows);
  const yearComparison = buildYearComparison(rows2023, rows2024, selectedRegion);
  const standardName = params.standardName?.trim() ?? "";
  const standardRegion = params.standardRegion?.trim() ?? "";
  const standardWorkplaceResponse = await getStandardWorkplaces({ pageNo: 1, numOfRows: 30 });
  const standardRegions = [...new Set(standardWorkplaceResponse.items.map((item) => item.address.split(" ")[0] || "기타"))].sort();
  const filteredStandardItems = standardWorkplaceResponse.items
    .filter((item) => (standardName ? item.compName?.includes(standardName) : true))
    .filter((item) => {
      if (!standardRegion) return true;
      const prefix = item.address.split(" ")[0] || "";
      return prefix === standardRegion;
    })
    .sort((a, b) => {
      const ad = Date.parse(a.authDate || "");
      const bd = Date.parse(b.authDate || "");
      return (Number.isFinite(bd) ? bd : 0) - (Number.isFinite(ad) ? ad : 0);
    });

  return (
    <div className="min-h-screen bg-page">
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">KEAD Support</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">공단 상담/신청 바로가기</h1>
          <p className="mt-3 text-sm text-slate-600">
            유형별 지원사업은 한국장애인고용공단 공식 페이지에서 최신 기준으로 확인할 수 있습니다.
          </p>

          <form action="/support/consulting" method="get" className="mt-6 grid gap-3 md:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>연도</span>
              <select
                name="year"
                defaultValue={selectedYear}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>지역</span>
              <select
                name="region"
                defaultValue={selectedRegion}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">전체</option>
                {gyeonggi.length > 0 ? (
                  <optgroup label="경기도 우선">
                    {gyeonggi.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
                {others.length > 0 ? (
                  <optgroup label="기타 지역">
                    {others.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
              </select>
            </label>

            <div className="flex items-end gap-2">
              <input type="hidden" name="industry" value={selectedIndustry} />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
              >
                조회
              </button>
            </div>
          </form>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">업종별 지원 사업체수 (상위 8)</h2>
            <p className="mt-1 text-sm text-slate-500">
              {selectedYear}년 {selectedRegion || "전체 지역"} 기준
            </p>
            <ul className="mt-4 space-y-2">
              {topIndustries.map((item) => (
                <li key={item.industry}>
                  <a
                    href={`/support/consulting?year=${selectedYear}&region=${encodeURIComponent(selectedRegion)}&industry=${encodeURIComponent(item.industry)}`}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      selectedIndustry === item.industry
                        ? "bg-primary-50 text-primary-900 ring-1 ring-primary-200"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="line-clamp-1">{item.industry}</span>
                    <span className="font-semibold">{item.count.toLocaleString()}</span>
                  </a>
                </li>
              ))}
            </ul>
            {selectedIndustry ? (
              <a
                href={`/support/consulting?year=${selectedYear}&region=${encodeURIComponent(selectedRegion)}`}
                className="mt-4 inline-flex text-xs font-semibold text-primary-700 underline-offset-4 hover:underline"
              >
                업종 필터 해제
              </a>
            ) : null}
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">원본 데이터 목록</h2>
            <p className="mt-1 text-sm text-slate-500">
              필터 결과 {filteredRows.length.toLocaleString()}건
            </p>
            <div className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-slate-200">
              <table className="min-w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-slate-50">
                  <tr className="text-left text-slate-600">
                    <th className="px-3 py-2 font-semibold">지역</th>
                    <th className="px-3 py-2 font-semibold">업종</th>
                    <th className="px-3 py-2 text-right font-semibold">사업체수</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.slice(0, 300).map((row, index) => (
                    <tr key={`${row.region}-${row.industry}-${index}`} className="border-t border-slate-100">
                      <td className="px-3 py-2 text-slate-700">{row.region}</td>
                      <td className="px-3 py-2 text-slate-700">{row.industry}</td>
                      <td className="px-3 py-2 text-right font-medium text-slate-900">
                        {row.companyCount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              공공데이터 API 응답 형식(지역/업종 표기 키)이 연도별로 달라 정규화해 표시합니다.
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">연도별 비교 (2023 vs 2024)</h2>
          <p className="mt-1 text-sm text-slate-500">
            {selectedRegion || "전체 지역"} 기준 업종별 사업체수 증감
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {yearComparison.map((item) => (
              <div key={item.industry} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <p className="font-medium text-slate-800">{item.industry}</p>
                <p className="mt-1 text-slate-600">
                  2023: <span className="font-semibold text-slate-900">{item.y2023.toLocaleString()}</span> · 2024:{" "}
                  <span className="font-semibold text-slate-900">{item.y2024.toLocaleString()}</span>
                </p>
                <p className={`mt-1 font-semibold ${item.diff >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {item.diff >= 0 ? "+" : ""}
                  {item.diff.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">장애인 표준사업장 실시간 조회</h2>
              <p className="mt-1 text-sm text-slate-500">
                API 응답코드 {standardWorkplaceResponse.resultCode} · {standardWorkplaceResponse.resultMsg} · 전체{" "}
                {standardWorkplaceResponse.totalCount.toLocaleString()}건
              </p>
            </div>
            <form action="/support/consulting" method="get" className="flex gap-2">
              <input type="hidden" name="year" value={selectedYear} />
              <input type="hidden" name="region" value={selectedRegion} />
              <input type="hidden" name="industry" value={selectedIndustry} />
              <label htmlFor="standardRegion" className="sr-only">
                표준사업장 지역
              </label>
              <select
                id="standardRegion"
                name="standardRegion"
                defaultValue={standardRegion}
                className="w-36 rounded-xl border border-slate-300 px-2 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">전체 지역</option>
                {standardRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <label htmlFor="standardName" className="sr-only">
                사업체명 검색
              </label>
              <input
                id="standardName"
                name="standardName"
                defaultValue={standardName}
                placeholder="사업체명 검색"
                className="w-52 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                조회
              </button>
            </form>
          </div>

          {filteredStandardItems.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {filteredStandardItems.slice(0, 12).map((item) => (
                <article key={`${item.compAuthId}-${item.compBizNo}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">{item.compName}</p>
                  <p className="mt-1 text-xs text-slate-600">{item.address}</p>
                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <p>
                      인증일자: <span className="font-medium text-slate-800">{item.authDate || "-"}</span>
                    </p>
                    <p>
                      연락처: <span className="font-medium text-slate-800">{item.compTel || "-"}</span>
                    </p>
                    <p>
                      사업자번호: <span className="font-medium text-slate-800">{item.compBizNo || "-"}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">검색 조건에 맞는 표준사업장이 없습니다.</p>
          )}
        </section>

        <section className="mt-8 space-y-4">
          {CONSULTING_STEPS.map((step) => (
            <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              <a
                href={step.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {step.actionLabel}
              </a>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
