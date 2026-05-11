import { LandingDemoScenario } from "@/components/home/landing-sections";

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
      {/* "실제 사용 흐름을 보여드립니다" 섹션 배치 */}
      <LandingDemoScenario />
    </div>
  );
}