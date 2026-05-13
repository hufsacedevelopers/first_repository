// frontend/app/features/page.tsx

import { LandingFeatures } from "@/components/home/landing-sections";

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 md:px-8 md:pt-10">
      <LandingFeatures />
    </div>
  );
}