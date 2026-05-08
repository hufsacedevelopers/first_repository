export type StandardWorkplaceItem = {
  address: string;
  authDate: string;
  compAuthId: string;
  compBizNo: string;
  compName: string;
  compRegNo: string;
  compTel: string;
  presidentName: string;
  product: string;
  rnum: string;
  compTypeNm: string;
};

type StandardWorkplaceApiResponse = {
  response?: {
    header?: {
      resultCode?: string;
      resultMsg?: string;
    };
    body?: {
      totalCount?: string | number;
      items?: {
        item?: StandardWorkplaceItem | StandardWorkplaceItem[];
      };
    };
  };
};

function normalizeItems(
  items: StandardWorkplaceItem | StandardWorkplaceItem[] | undefined
): StandardWorkplaceItem[] {
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

export async function getStandardWorkplaces(params?: {
  pageNo?: number;
  numOfRows?: number;
  compBizNo?: string;
}): Promise<{ totalCount: number; items: StandardWorkplaceItem[]; resultCode: string; resultMsg: string }> {
  const serviceKey = process.env.ODCLOUD_SERVICE_KEY;
  if (!serviceKey) {
    return { totalCount: 0, items: [], resultCode: "NO_KEY", resultMsg: "ODCLOUD_SERVICE_KEY is missing" };
  }

  const url = new URL("https://apis.data.go.kr/B552583/comp/comp_auth");
  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("pageNo", String(params?.pageNo ?? 1));
  url.searchParams.set("numOfRows", String(params?.numOfRows ?? 20));
  url.searchParams.set("_type", "json");
  if (params?.compBizNo) {
    url.searchParams.set("comp_biz_no", params.compBizNo);
  }

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) {
      return { totalCount: 0, items: [], resultCode: String(response.status), resultMsg: "HTTP Error" };
    }
    const payload = (await response.json()) as StandardWorkplaceApiResponse;
    const resultCode = payload.response?.header?.resultCode ?? "UNKNOWN";
    const resultMsg = payload.response?.header?.resultMsg ?? "Unknown response";
    const totalCountRaw = payload.response?.body?.totalCount ?? 0;
    const totalCount = Number(totalCountRaw) || 0;
    const items = normalizeItems(payload.response?.body?.items?.item);

    return { totalCount, items, resultCode, resultMsg };
  } catch {
    return { totalCount: 0, items: [], resultCode: "FETCH_ERROR", resultMsg: "Request failed" };
  }
}
