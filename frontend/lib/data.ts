import { Company, Job } from "@/types";
import { api } from "./api";
import { companies as mockCompanies, jobs as mockJobs } from "./mockData";

// NEXT_PUBLIC_API_URL 이 설정되어 있으면 실제 백엔드를 사용합니다.
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
    return await api.companies();
  } catch (error) {
    disableApiTemporarily(error);
    return mockCompanies;
  }
}

export async function getJobs(): Promise<Job[]> {
  if (!shouldUseApi()) return mockJobs;
  try {
    return await api.jobs();
  } catch (error) {
    disableApiTemporarily(error);
    return mockJobs;
  }
}
