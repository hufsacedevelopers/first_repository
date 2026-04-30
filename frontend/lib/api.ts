import { Company, Job } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  } catch (error) {
    throw new Error(`API fetch failed: ${path} (${BASE_URL})`, { cause: error });
  }
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// 백엔드 /jobs/live-with-env 응답 형태
interface LiveJobItem {
  recruitmentPeriod: string;
  businessName: string;
  contactNumber: string;
  companyAddress: string;
  employmentType: string;
  entryType: string;
  jobName: string;
  applicationDate: string;
  registeredAt: string;
  agencyName: string;
  requiredCareer: string;
  requiredEducation: string;
  salaryType: string;
  salary: string;
  envBothHands?: string;
  envEyesight?: string;
  envHandwork?: string;
  envLiftPower?: string;
  envLstnTalk?: string;
  envStndWalk?: string;
}

interface LiveJobsResponse {
  pageNo: number;
  numOfRows: number;
  totalCount: number;
  data: LiveJobItem[];
}

function mapEmploymentType(raw: string): string {
  const map: Record<string, string> = {
    "상용직": "정규직",
    "임시직": "계약직",
    "일용직": "일용직",
  };
  return map[raw] ?? raw;
}

function formatSalary(salary: string, salaryType: string): string | undefined {
  if (!salary || !salaryType) return undefined;
  const num = parseInt(salary.replace(/,/g, ""), 10);
  if (isNaN(num) || num === 0) return undefined;
  const manwon = Math.round(num / 10000);
  return `${salaryType} ${manwon.toLocaleString()}만원`;
}

function extractRegion(address: string): string {
  if (!address) return "지역 미상";
  const match = address.match(/^(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)[^\s]*/);
  return match ? match[0] : address.split(" ").slice(0, 2).join(" ");
}

function generateTags(item: LiveJobItem): string[] {
  const tags: string[] = [];
  if (item.entryType === "신입" || item.entryType === "무관") tags.push("신입 환영");
  if (item.envStndWalk && item.envStndWalk !== "필요") tags.push("서기/걷기 무관");
  if (item.envLiftPower && item.envLiftPower !== "필요") tags.push("중량물 무관");
  return tags;
}

function mapLiveJobToJob(item: LiveJobItem, index: number): Job {
  return {
    id: String(index),
    title: item.jobName || "직무명 없음",
    companyName: item.businessName || "기업명 없음",
    location: extractRegion(item.companyAddress),
    employmentType: mapEmploymentType(item.employmentType),
    accessibilityTags: generateTags(item),
    salaryRange: formatSalary(item.salary, item.salaryType),
    recruitmentPeriod: item.recruitmentPeriod,
    entryType: item.entryType,
    requiredCareer: item.requiredCareer,
    requiredEducation: item.requiredEducation,
    agencyName: item.agencyName,
    contactNumber: item.contactNumber,
    applicationDate: item.applicationDate,
    salaryType: item.salaryType,
    envBothHands: item.envBothHands,
    envEyesight: item.envEyesight,
    envHandwork: item.envHandwork,
    envLiftPower: item.envLiftPower,
    envLstnTalk: item.envLstnTalk,
    envStndWalk: item.envStndWalk,
  };
}

export const api = {
  companies: () => get<Company[]>("/companies"),
  jobs: () => get<Job[]>("/jobs"),
  liveJobsWithEnv: async (pageNo = 1, numOfRows = 20): Promise<Job[]> => {
    const res = await get<LiveJobsResponse>(
      `/jobs/live-with-env?pageNo=${pageNo}&numOfRows=${numOfRows}`
    );
    return res.data.map(mapLiveJobToJob);
  },
  liveJobsTotal: async (): Promise<number> => {
    const res = await get<LiveJobsResponse>("/jobs/live-with-env?pageNo=1&numOfRows=1");
    return res.totalCount;
  },
};
