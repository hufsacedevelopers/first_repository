"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function GigsGeoBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const hasCoords = searchParams.get("lat") && searchParams.get("lng");

  const applyCoords = useCallback(
    (latitude: number, longitude: number) => {
      const q = new URLSearchParams();
      q.set("lat", String(latitude));
      q.set("lng", String(longitude));
      router.replace(`/gigs?${q.toString()}`);
      setMsg(null);
    },
    [router]
  );

  const onNearMe = () => {
    if (!navigator.geolocation) {
      setMsg("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
      return;
    }
    setBusy(true);
    setMsg(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(false);
        applyCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setBusy(false);
        if (err.code === 1) {
          setMsg("위치 권한이 거부되었습니다. 브라우저 설정에서 위치를 허용해 주세요.");
        } else {
          setMsg("위치를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        }
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 }
    );
  };

  const onClear = () => {
    router.replace("/gigs");
    setMsg(null);
  };

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-4 text-sm text-slate-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-relaxed">
          {hasCoords ? (
            <>
              <span className="font-semibold text-slate-900">내 위치 기준</span>으로 가까운 순으로 정렬했습니다.
              주소에 위치 좌표가 없는 기관은 목록 뒤쪽에 모입니다.
            </>
          ) : (
            <>
              <span className="font-semibold text-slate-900">내 위치 허용</span> 시 위치 정보가 있는 기관부터
              거리순으로 보여 드립니다.
            </>
          )}
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={onNearMe}
            disabled={busy}
            className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            {busy ? "위치 확인 중…" : "내 위치로 정렬"}
          </button>
          {hasCoords ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              위치 초기화
            </button>
          ) : null}
        </div>
      </div>
      {msg ? <p className="mt-3 text-xs text-rose-700">{msg}</p> : null}
    </div>
  );
}
