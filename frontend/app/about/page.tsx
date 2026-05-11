import { LandingWhy } from "@/components/home/landing-sections";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
      {/* "왜 이런 서비스가 필요할까요?" 섹션 배치 */}
      <LandingWhy />
    </div>
  );
}