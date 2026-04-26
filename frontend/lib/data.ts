import { Company, Job } from "@/types";
import { api } from "./api";
import { companies as mockCompanies, jobs as mockJobs } from "./mockData";

// NEXT_PUBLIC_API_URL 이 설정되어 있으면 실제 백엔드를 사용합니다.
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

export async function getCompanies(): Promise<Company[]> {
  if (USE_MOCK) return mockCompanies;
  return api.companies();
}

export async function getJobs(): Promise<Job[]> {
  if (USE_MOCK) return mockJobs;
  return api.jobs();
}
