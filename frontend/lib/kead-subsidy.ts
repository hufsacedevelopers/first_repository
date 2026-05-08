type RawRow = Record<string, unknown>;

export type KeadSubsidyRow = {
  region: string;
  industry: string;
  companyCount: number;
};

type KeadApiResponse = {
  page: number;
  perPage: number;
  totalCount: number;
  data: RawRow[];
};

const KEAD_ENDPOINTS: Record<string, string> = {
  "2018": "/15054713/v1/uddi:a576a3fc-ac93-4728-bb24-9f11c66740d5",
  "2019": "/15054713/v1/uddi:3e728908-ac34-44f4-bb8f-86153a55bc63",
  "2020": "/15054713/v1/uddi:d2eda7f8-b10d-478b-b7c0-c9b71d60ddfa",
  "2021": "/15054713/v1/uddi:fb2af9f6-49b4-4d1f-96b7-93e6d42b0e97",
  "2022": "/15054713/v1/uddi:58d80582-8386-43c8-b0ee-b3bcd6ccd4ec",
  "2023": "/15054713/v1/uddi:eda3ce2c-4312-4a29-8a9d-ff0c33508008",
  "2024": "/15054713/v1/uddi:9741cfd1-ff55-4555-bf21-f59ead6bed36",
  "2025": "/15054713/v1/uddi:8dc5b7ce-f641-4cb4-a5b5-9a8876b01253",
};

const FALLBACK_ROWS: KeadSubsidyRow[] = [
  { region: "경기도", industry: "제조업", companyCount: 132 },
  { region: "경기도", industry: "도매 및 소매업", companyCount: 89 },
  { region: "경기도", industry: "사업시설관리 및 사업지원 서비스업", companyCount: 61 },
  { region: "경기도", industry: "숙박 및 음식점업", companyCount: 44 },
  { region: "서울특별시", industry: "정보통신업", companyCount: 57 },
  { region: "인천광역시", industry: "운수 및 창고업", companyCount: 39 },
];

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function pickText(row: RawRow, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function normalizeRow(row: RawRow): KeadSubsidyRow {
  const region = pickText(row, ["지역명", "지역"]);
  const industry = pickText(row, ["업종명", "업종"]);
  const companyCount = toNumber(row["사업체수"]);

  return {
    region: region || "지역 미상",
    industry: industry || "업종 미상",
    companyCount,
  };
}

export function getSupportedKeadYears(): string[] {
  return Object.keys(KEAD_ENDPOINTS).sort((a, b) => Number(b) - Number(a));
}

export async function getKeadSubsidyRows(year: string, perPage = 100): Promise<KeadSubsidyRow[]> {
  const endpoint = KEAD_ENDPOINTS[year];
  if (!endpoint) return FALLBACK_ROWS;

  const serviceKey = process.env.ODCLOUD_SERVICE_KEY;
  const authorization = process.env.ODCLOUD_AUTHORIZATION;

  if (!serviceKey && !authorization) {
    return FALLBACK_ROWS;
  }

  const url = new URL(`https://api.odcloud.kr/api${endpoint}`);
  url.searchParams.set("page", "1");
  url.searchParams.set("perPage", String(perPage));
  url.searchParams.set("returnType", "JSON");
  if (serviceKey) {
    url.searchParams.set("serviceKey", serviceKey);
  }

  const headers: HeadersInit = {};
  if (authorization) {
    headers.Authorization = authorization;
  }

  try {
    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return FALLBACK_ROWS;
    }

    const payload = (await response.json()) as KeadApiResponse;
    return (payload.data ?? []).map(normalizeRow).filter((item) => item.companyCount > 0);
  } catch {
    return FALLBACK_ROWS;
  }
}
