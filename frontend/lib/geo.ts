/** 위도·경도 문자열을 숫자로 파싱 (경기도 API는 문자열 필드로 제공). */
export function parseWgs84(latRaw: string, lngRaw: string): { lat: number; lng: number } | null {
  const lat = parseFloat(String(latRaw).trim());
  const lng = parseFloat(String(lngRaw).trim());
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

/** 쿼리스트링에서 사용자 기준 좌표 (브라우저 geolocation 등). */
export function parseUserGeoQuery(lat?: string, lng?: string): { lat: number; lng: number } | null {
  if (lat == null || lng == null) return null;
  return parseWgs84(lat, lng);
}

/** 두 지점 간 거리(km), Haversine. */
export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
