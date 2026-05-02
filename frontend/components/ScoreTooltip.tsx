"use client";

import { useEffect, useId, useRef, useState } from "react";

import { MATCHING_SCORE_TOOLTIP } from "@/lib/score-copy";

type Props = {
  /** 기본값: MATCHING_SCORE_TOOLTIP */
  content?: string;
  ariaLabel?: string;
};

export default function ScoreTooltip({
  content = MATCHING_SCORE_TOOLTIP,
  ariaLabel = "점수 산정 방식 안내",
}: Props) {
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tipId = useId();
  const visible = pinned || hover;

  useEffect(() => {
    if (!pinned) return;
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setPinned(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [pinned]);

  return (
    <div
      ref={wrapRef}
      className="relative inline-flex flex-col items-center gap-1"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {visible ? (
        <span
          id={tipId}
          role="tooltip"
          className="order-1 w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-[11px] leading-relaxed text-slate-700 shadow-lg ring-1 ring-black/[0.06]"
        >
          {content}
        </span>
      ) : null}
      <button
        type="button"
        className="order-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-[10px] font-bold leading-none text-slate-600 shadow-sm hover:border-primary-400 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label={ariaLabel}
        aria-expanded={visible}
        aria-describedby={visible ? tipId : undefined}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setPinned((p) => !p);
        }}
      >
        i
      </button>
    </div>
  );
}
