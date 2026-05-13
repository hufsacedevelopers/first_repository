import type { Job } from "@/types";

/** `/recommendations` 필터와 동일한 근무환경 판단 */
export const DISABILITY_FILTER: Record<string, (job: Job) => boolean> = {
  지체장애: (job) => job.envStndWalk !== "오랫동안 가능",
  시각장애: (job) => job.envEyesight !== "아주 작은 글씨를 읽을 수 있음",
  청각장애: (job) => job.envLstnTalk !== "듣고 말하기에 어려움 없음",
  발달장애: (job) =>
    (!job.envLiftPower || !job.envLiftPower.includes("20Kg")) &&
    job.envStndWalk !== "오랫동안 가능",
  기타: () => true,
};

/**
 * 선택한 장애 유형에 대한 적합도 0~100.
 * 필터에 해당하지 않거나 「기타」·미선택이면 undefined (배지 미표시).
 */
export function computeDisabilityMatchPercent(
  job: Job,
  disabilityType: string
): number | undefined {
  if (!disabilityType || disabilityType === "기타") return undefined;
  const gate = DISABILITY_FILTER[disabilityType];
  if (!gate || !gate(job)) return undefined;

  let fit = 52;
  const fs = job.friendlinessScore;

  switch (disabilityType) {
    case "지체장애": {
      const w = job.envStndWalk ?? "";
      if (w.includes("어려움")) fit += 30;
      else if (w.includes("일부")) fit += 15;
      else fit += 8;
      const lift = job.envLiftPower ?? "";
      if (/5\s*Kg|5kg/i.test(lift) || lift.includes("5Kg 이내")) fit += 12;
      else if (!lift.includes("20Kg")) fit += 8;
      break;
    }
    case "시각장애": {
      const e = job.envEyesight ?? "";
      if (e.includes("일상적")) fit += 30;
      else if (e.includes("비교적 큰")) fit += 18;
      else fit += 10;
      break;
    }
    case "청각장애": {
      const t = job.envLstnTalk ?? "";
      if (t.includes("어려움")) fit += 28;
      else if (t.includes("간단한")) fit += 16;
      else fit += 10;
      break;
    }
    case "발달장애": {
      const lift = job.envLiftPower ?? "";
      const w = job.envStndWalk ?? "";
      if (!lift.includes("20Kg")) fit += 14;
      if (w.includes("어려움")) fit += 22;
      else if (w.includes("일부")) fit += 12;
      break;
    }
    default:
      return undefined;
  }

  fit = Math.min(100, fit);
  if (fs != null) {
    return Math.min(100, Math.round((fs + fit) / 2));
  }
  return fit;
}
