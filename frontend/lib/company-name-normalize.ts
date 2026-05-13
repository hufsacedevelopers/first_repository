/**
 * 공고 `businessName` / 표준사업장 `workplaceName` 비교용 정규화 키.
 * 표시 문자열은 바꾸지 않고, 매칭·그룹핑에만 사용합니다.
 */
export function normalizeCompanyNameKey(raw: string): string {
  if (!raw) return "";
  let s = raw.normalize("NFKC").trim().replace(/\s+/g, " ");
  s = stripLegalEntityTokens(s);
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

function stripLegalEntityTokens(s: string): string {
  let prev = "";
  let cur = s;
  /** 앞·뒤에서 반복 제거 (중첩 `(주)(주)` 등) */
  const edgePatterns = [
    /^\(주\)\s*/gi,
    /^\(주식회사\)\s*/gi,
    /^㈜\s*/,
    /^주식회사\s*/g,
    /^\(유\)\s*/gi,
    /^\(유한회사\)\s*/gi,
    /^유한회사\s*/g,
    /^\(합\)\s*/gi,
    /^\(합자회사\)\s*/gi,
    /^합자회사\s*/g,
    /\s*\(주\)$/gi,
    /\s*\(주식회사\)$/gi,
    /\s*주식회사$/g,
    /\s*\(유\)$/gi,
    /\s*\(유한회사\)$/gi,
    /\s*유한회사$/g,
    /\s*\(합\)$/gi,
    /\s*\(합자회사\)$/gi,
    /\s*합자회사$/g,
    /^\(사\)\s*/gi,
    /\s*\(사\)$/gi,
  ];

  while (cur !== prev) {
    prev = cur;
    for (const re of edgePatterns) {
      cur = cur.replace(re, "");
    }
    cur = cur.trim();
  }

  cur = cur
    .replace(/\bco\.?\s*,?\s*ltd\.?\b/gi, "")
    .replace(/\binc\.?\b/gi, "")
    .replace(/\bllc\.?\b/gi, "")
    .replace(/\bcorp\.?\b/gi, "")
    .trim();

  return cur;
}

/** 검색어가 원문 또는 정규화 키에 포함되는지 */
export function rawNameMatchesCompanySearch(raw: string, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  if (raw.toLowerCase().includes(q.toLowerCase())) return true;
  const key = normalizeCompanyNameKey(raw);
  const qKey = normalizeCompanyNameKey(q);
  if (!key) return false;
  if (qKey && key.includes(qKey)) return true;
  return key.includes(q.toLowerCase().replace(/\s+/g, " "));
}
