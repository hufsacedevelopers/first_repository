import { Company, Job } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:8000");

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

interface LiveJobsMergedResponse extends LiveJobsResponse {
  meta: {
    requestedCount: number;
    collectedPages: number;
    rawCollectedCount: number;
    envCollectedCount: number;
    mergedCount: number;
    mergeMatchRate: number;
    rawTotalCount: number;
    envTotalCount: number;
  };
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

function computeAccessibilityScore(item: LiveJobItem): number {
  let score = 60;

  if (item.envStndWalk === "서거나 걷는 일 어려움") score += 15;
  else if (item.envStndWalk === "일부 서서하는 작업 가능") score += 8;

  if (item.envLiftPower?.includes("5Kg 이내")) score += 8;
  else if (item.envLiftPower?.includes("5~20Kg")) score += 4;

  if (item.envEyesight === "일상적 활동 가능") score += 8;
  else if (item.envEyesight?.includes("비교적 큰")) score += 4;

  if (item.envLstnTalk === "듣고 말하는 작업 어려움") score += 8;
  else if (item.envLstnTalk === "간단한 듣고 말하기 가능") score += 5;

  if (item.envBothHands === "한손작업 가능") score += 5;
  if (item.entryType === "신입" || item.entryType === "무관") score += 3;

  return Math.min(100, score);
}

function generateTags(item: LiveJobItem): string[] {
  const tags: string[] = [];
  if (item.entryType === "신입" || item.entryType === "무관") tags.push("신입 환영");
  if (item.envStndWalk === "서거나 걷는 일 어려움") tags.push("이동 약자 적합");
  if (item.envBothHands === "한손작업 가능") tags.push("한손 작업 가능");
  if (item.envEyesight === "일상적 활동 가능") tags.push("시력 부담 낮음");
  if (item.envLstnTalk === "듣고 말하는 작업 어려움") tags.push("청각 부담 낮음");
  return tags;
}

function mapLiveJobToJob(item: LiveJobItem, index: number): Job {
  return {
    id: String(index),
    friendlinessScore: computeAccessibilityScore(item),
    title: item.jobName || "직무명 없음",
    companyName: item.businessName || "기업명 없음",
    location: extractRegion(item.companyAddress),
    employmentType: mapEmploymentType(item.employmentType),
    accessibilityTags: generateTags(item),
    salaryRange: formatSalary(item.salary, item.salaryType),
    salaryType: item.salaryType,
    recruitmentPeriod: item.recruitmentPeriod,
    entryType: item.entryType,
    requiredCareer: item.requiredCareer,
    requiredEducation: item.requiredEducation,
    agencyName: item.agencyName,
    contactNumber: item.contactNumber,
    applicationDate: item.applicationDate,
    envBothHands: item.envBothHands,
    envEyesight: item.envEyesight,
    envHandwork: item.envHandwork,
    envLiftPower: item.envLiftPower,
    envLstnTalk: item.envLstnTalk,
    envStndWalk: item.envStndWalk,
  };
}

export const api = {
  companies: () =>
    get<
      | Company[]
      | {
          source: "live" | "static";
          syncedAt: string;
          data: Company[];
        }
    >("/companies"),
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
  liveJobsMerged: async (pageNo = 1, numOfRows = 20): Promise<Job[]> => {
    const res = await get<LiveJobsMergedResponse>(
      `/jobs/live-merged?pageNo=${pageNo}&numOfRows=${numOfRows}`
    );
    return res.data.map(mapLiveJobToJob);
  },
  liveJobsMergedMeta: async (pageNo = 1, numOfRows = 20) => {
    const res = await get<LiveJobsMergedResponse>(
      `/jobs/live-merged?pageNo=${pageNo}&numOfRows=${numOfRows}`
    );
    return res.meta;
  },
  liveJobsComparison: () =>
    get<{
      jobListTotal: number;
      jobListEnvTotal: number;
      missingEnvCount: number;
      missingEnvRate: number;
    }>("/jobs/live-comparison?pageNo=1&numOfRows=1"),
};
