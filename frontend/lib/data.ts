import { Company, Job } from "@/types";
import { api } from "./api";
import { companies as mockCompanies, jobs as mockJobs } from "./mockData";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;
const API_RETRY_COOLDOWN_MS = 30_000;
let apiDisabledUntil = 0;

function shouldUseApi(): boolean {
  if (USE_MOCK) return false;
  return Date.now() >= apiDisabledUntil;
}

function disableApiTemporarily(reason: unknown): void {
  apiDisabledUntil = Date.now() + API_RETRY_COOLDOWN_MS;
  console.warn(
    `API unavailable, fallback to mock for ${API_RETRY_COOLDOWN_MS / 1000}s.`,
    reason
  );
}

export async function getCompanies(): Promise<Company[]> {
  if (!shouldUseApi()) return mockCompanies;
  try {
    const raw = await api.companies();
    return raw.map((c, i) => ({ ...c, id: String(i) }));
  } catch (error) {
    disableApiTemporarily(error);
    return mockCompanies;
  }
}

export async function getJobs(numOfRows = 20): Promise<Job[]> {
  if (!shouldUseApi()) return mockJobs;
  try {
    return await api.liveJobsWithEnv(1, numOfRows);
  } catch (error) {
    disableApiTemporarily(error);
    return mockJobs;
  }
}

const PAGE_SIZE = 20;

export async function getJobById(id: string): Promise<Job | null> {
  const idx = parseInt(id, 10);
  if (isNaN(idx) || idx < 0) return null;

  if (!shouldUseApi()) return mockJobs[idx] ?? null;

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
    return mockJobs[idx] ?? null;
  }
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const companies = await getCompanies();
  return companies.find((c) => c.id === id) ?? null;
}

export async function getLiveJobsTotal(): Promise<number> {
  if (!shouldUseApi()) return mockJobs.length;
  try {
    return await api.liveJobsTotal();
  } catch {
    return mockJobs.length;
  }
}
