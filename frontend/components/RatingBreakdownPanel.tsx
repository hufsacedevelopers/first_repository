import { RATING_BREAKDOWN_LABELS } from "@/lib/companyRating";

const ORDER: string[] = [
  "employment",
  "retention",
  "jobDiversity",
  "standardWorkplace",
  "workEnvironmentSixAvg",
  "welfare",
];

export default function RatingBreakdownPanel({
  breakdown,
  compact = false,
}: {
  breakdown: Record<string, number>;
  compact?: boolean;
}) {
  const entries: { key: string; label: string; value: number }[] = ORDER.filter((k) => k in breakdown).map(
    (k) => ({
      key: k,
      label: RATING_BREAKDOWN_LABELS[k] ?? k,
      value: breakdown[k]!,
    })
  );
  const rest = Object.entries(breakdown).filter(([k]) => !ORDER.includes(k));
  for (const [k, v] of rest) {
    entries.push({ key: k, label: RATING_BREAKDOWN_LABELS[k] ?? k, value: v });
  }

  return (
    <div
      className={
        compact
          ? "mt-4 rounded-xl border border-slate-100 bg-slate-50/90 p-4"
          : "rounded-2xl border border-slate-100 bg-slate-50/90 p-6"
      }
    >
      <p className="text-xs font-semibold text-slate-700">
        친화도 산출 세부 <span className="font-normal text-slate-500">(부분 점수 0–100)</span>
      </p>
      <dl className={compact ? "mt-2 grid gap-2 text-xs sm:grid-cols-2" : "mt-4 grid gap-3 text-sm sm:grid-cols-2"}>
        {entries.map(({ key, label, value }) => (
          <div key={key} className="flex justify-between gap-3 border-b border-slate-100/80 pb-2 last:border-0 sm:block sm:border-0 sm:pb-0">
            <dt className="text-slate-600">{label}</dt>
            <dd className="shrink-0 text-right font-mono font-semibold tabular-nums text-slate-900">
              {Number.isFinite(value) ? value.toFixed(1) : "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
