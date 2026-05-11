"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface RegionOption {
  sigunNm: string;
  institutionCount: number;
}

interface GyeonggiSigunFilterProps {
  regions: RegionOption[];
  selectedSigunNm: string;
}

export default function GyeonggiSigunFilter({ regions, selectedSigunNm }: GyeonggiSigunFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function applySigun(next: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (next) {
      p.set("sigunNm", next);
    } else {
      p.delete("sigunNm");
    }
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <label htmlFor="gyeonggi-sigun" className="text-sm font-semibold text-slate-800">
          시·군 선택
        </label>
        <p className="mt-1 text-xs text-slate-500">
          경기도 Open API 시군명 기준입니다. 선택 시 URL에 반영되어 공유할 수 있습니다.
        </p>
      </div>
      <select
        id="gyeonggi-sigun"
        value={selectedSigunNm}
        onChange={(e) => applySigun(e.target.value)}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200 sm:w-72"
      >
        <option value="">경기도 전체</option>
        {regions.map((r) => (
          <option key={r.sigunNm} value={r.sigunNm}>
            {r.sigunNm} ({r.institutionCount})
          </option>
        ))}
      </select>
    </div>
  );
}
