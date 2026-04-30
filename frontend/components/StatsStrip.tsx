interface StatsStripProps {
  liveJobsTotal?: number;
}

export default function StatsStrip({ liveJobsTotal }: StatsStripProps) {
  const stats = [
    { value: liveJobsTotal != null ? `${liveJobsTotal.toLocaleString()}건` : "—", label: "실시간 장애인 구인 공고" },
    { value: "960만원", label: "고용장려금 최대/년" },
    { value: "6개", label: "근무환경 접근성 지표" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm"
        >
          <p className="text-2xl font-bold tabular-nums text-primary-800 md:text-3xl">{item.value}</p>
          <p className="mt-1 text-sm text-slate-600">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
