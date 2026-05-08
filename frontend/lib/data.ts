import { Company, Job } from "@/types";
import { api } from "./api";
import { companies as mockCompanies, jobs as mockJobs } from "./mockData";
import { getKeadJobComparison, getMergedKeadJobs } from "./kead-jobs";

const USE_MOCK = !(process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL);
const ALLOW_MOCK_FALLBACK =
  process.env.NEXT_PUBLIC_ALLOW_MOCK_FALLBACK === "true" || process.env.NODE_ENV !== "production";
const API_RETRY_COOLDOWN_MS = 30_000;
let apiDisabledUntil = 0;

function shouldUseApi(): boolean {
  if (USE_MOCK) return false;
  return Date.now() >= apiDisabledUntil;
}

function apiErrorSummary(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause = error.cause;
  if (cause instanceof Error && "code" in cause) {
    const code = (cause as NodeJS.ErrnoException).code;
    if (code === "ECONNREFUSED") {
      return "ECONNREFUSED — 백엔드(예: 127.0.0.1:8000)가 꺼져 있거나 주소가 다릅니다.";
    }
  }
  return error.message;
}

function disableApiTemporarily(reason: unknown): void {
  apiDisabledUntil = Date.now() + API_RETRY_COOLDOWN_MS;
  console.warn(
    `API unavailable for ${API_RETRY_COOLDOWN_MS / 1000}s: ${apiErrorSummary(reason)}`
  );
}

export async function getCompanies(): Promise<Company[]> {
  const result = await getCompaniesWithMeta();
  return result.companies;
}

export async function getCompaniesWithMeta(): Promise<{
  source: "live" | "static";
  syncedAt: string | null;
  companies: Company[];
}> {
  if (!shouldUseApi()) {
    return {
      source: "static",
      syncedAt: null,
      companies: ALLOW_MOCK_FALLBACK ? mockCompanies : [],
    };
  }
  try {
    const raw = await api.companies();
    if (Array.isArray(raw)) {
      return {
        source: "static",
        syncedAt: null,
        companies: raw.map((c, i) => ({ ...c, id: String(i) })),
      };
    }
    return {
      source: raw.source ?? "static",
      syncedAt: raw.syncedAt ?? null,
      companies: raw.data.map((c, i) => ({ ...c, id: String(i) })),
    };
  } catch (error) {
    disableApiTemporarily(error);
    return {
      source: "static",
      syncedAt: null,
      companies: ALLOW_MOCK_FALLBACK ? mockCompanies : [],
    };
  }
}

export async function getJobs(numOfRows = 20): Promise<Job[]> {
  if (shouldUseApi()) {
    try {
      const mergedFromBackend = await api.liveJobsMerged(1, numOfRows);
      if (mergedFromBackend.length > 0) return mergedFromBackend;
    } catch (error) {
      disableApiTemporarily(error);
    }
  }

  const keadJobs = await getMergedKeadJobs(1, numOfRows);
  if (keadJobs.length > 0) return keadJobs;

  if (!shouldUseApi()) return ALLOW_MOCK_FALLBACK ? mockJobs : [];
  try {
    return await api.liveJobsWithEnv(1, numOfRows);
  } catch (error) {
    disableApiTemporarily(error);
    try {
      const fallbackJobs = await api.jobs();
      return fallbackJobs.slice(0, numOfRows);
    } catch {
      return ALLOW_MOCK_FALLBACK ? mockJobs : [];
    }
  }
}

const PAGE_SIZE = 20;

export async function getJobById(id: string): Promise<Job | null> {
  const idx = parseInt(id, 10);
  if (isNaN(idx) || idx < 0) return null;

  const keadJobs = await getMergedKeadJobs(Math.max(PAGE_SIZE, idx + 1));
  if (keadJobs.length > idx) {
    return keadJobs[idx] ?? null;
  }

  if (!shouldUseApi()) return ALLOW_MOCK_FALLBACK ? (mockJobs[idx] ?? null) : null;

  const page = Math.floor(idx / PAGE_SIZE) + 1;
  const localIdx = idx % PAGE_SIZE;

  try {
    const jobs = await api.liveJobsWithEnv(page, PAGE_SIZE);
    // ID는 전체 배열 기준 인덱스이므로 재계산
    return jobs[localIdx]
      ? { ...jobs[localIdx], id: String(idx) }
      : null;
  } catch (error) {
    disableApiTemporarily(error);
    return ALLOW_MOCK_FALLBACK ? (mockJobs[idx] ?? null) : null;
  }
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const companies = await getCompanies();
  return companies.find((c) => c.id === id) ?? null;
}

export async function getLiveJobsTotal(): Promise<number> {
  if (shouldUseApi()) {
    try {
      const comparison = await api.liveJobsComparison();
      if (comparison.jobListEnvTotal > 0 || comparison.jobListTotal > 0) {
        return comparison.jobListEnvTotal || comparison.jobListTotal;
      }
    } catch (error) {
      disableApiTemporarily(error);
    }
  }

  const keadJobs = await getMergedKeadJobs(1, 1);
  if (keadJobs.length > 0) {
    const comparison = await getKeadJobComparison(1, 1);
    return comparison.jobListEnvTotal || comparison.jobListTotal || keadJobs.length;
  }

  if (!shouldUseApi()) return ALLOW_MOCK_FALLBACK ? mockJobs.length : 0;
  try {
    return await api.liveJobsTotal();
  } catch (error) {
    disableApiTemporarily(error);
    try {
      const fallbackJobs = await api.jobs();
      return fallbackJobs.length;
    } catch {
      return ALLOW_MOCK_FALLBACK ? mockJobs.length : 0;
    }
  }
}

export async function getLiveJobsComparison() {
  if (shouldUseApi()) {
    try {
      const comparison = await api.liveJobsComparison();
      return {
        jobListTotal: comparison.jobListTotal,
        jobListEnvTotal: comparison.jobListEnvTotal,
        jobListResultCode: "0000",
        jobListEnvResultCode: "0000",
      };
    } catch (error) {
      disableApiTemporarily(error);
    }
  }

  return getKeadJobComparison(1, 1);
}

export async function getLiveJobsMergedMeta() {
  if (shouldUseApi()) {
    try {
      return await api.liveJobsMergedMeta(1, 200);
    } catch (error) {
      disableApiTemporarily(error);
    }
  }
  return null;
}
