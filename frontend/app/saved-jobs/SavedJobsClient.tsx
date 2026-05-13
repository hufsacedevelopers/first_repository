"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import JobCard from "@/components/JobCard";
import type { Job } from "@/types";

export default function SavedJobsClient() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedIds, setFailedIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = localStorage.getItem("bookmarks");
        const bookmarks: string[] = stored ? JSON.parse(stored) : [];
        const ids = [
          ...new Set(
            bookmarks
              .filter((k) => k.startsWith("job-"))
              .map((k) => k.replace(/^job-/, ""))
              .filter(Boolean)
          ),
        ];
        if (ids.length === 0) {
          if (!cancelled) {
            setJobs([]);
            setFailedIds([]);
            setLoading(false);
          }
          return;
        }

        const results = await Promise.allSettled(
          ids.map(async (id) => {
            const res = await fetch(`/api/jobs/${encodeURIComponent(id)}`);
            if (!res.ok) throw new Error(id);
            return (await res.json()) as Job;
          })
        );

        const ok: Job[] = [];
        const bad: string[] = [];
        results.forEach((r, i) => {
          if (r.status === "fulfilled") ok.push(r.value);
          else bad.push(ids[i] ?? "");
        });

        if (!cancelled) {
          setJobs(ok);
          setFailedIds(bad.filter(Boolean));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setJobs([]);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-slate-600">불러오는 중…</p>
    );
  }

  if (jobs.length === 0 && failedIds.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="font-medium text-slate-800">아직 찜한 공고가 없어요.</p>
        <p className="mt-2 text-sm text-slate-600">
          일자리 카드에서 ♡ 찜을 누르면 여기 모입니다.
        </p>
        <Link
          href="/recommendations"
          className="mt-6 inline-flex rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
        >
          일자리 찾아보기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {failedIds.length > 0 ? (
        <p className="text-sm text-amber-800">
          일부 공고는 마감되었거나 목록에서 빠져 불러오지 못했습니다.
        </p>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
