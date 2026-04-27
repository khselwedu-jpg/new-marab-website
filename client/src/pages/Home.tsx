import { lazy, Suspense } from "react";
import { HeroSection } from "@/components/HeroSection";

// Lazy load all below-the-fold sections to reduce TBT and initial JS parse time
const AboutSection = lazy(() => import("@/components/AboutSection").then(m => ({ default: m.AboutSection })));
const WhyUsSection = lazy(() => import("@/components/WhyUsSection").then(m => ({ default: m.WhyUsSection })));
const InsuranceTypesSection = lazy(() => import("@/components/InsuranceTypesSection").then(m => ({ default: m.InsuranceTypesSection })));
const StatisticsSection = lazy(() => import("@/components/StatisticsSection").then(m => ({ default: m.StatisticsSection })));
const PartnersSection = lazy(() => import("@/components/PartnersSection").then(m => ({ default: m.PartnersSection })));
const BranchesSection = lazy(() => import("@/components/BranchesSection").then(m => ({ default: m.BranchesSection })));
const NewsSection = lazy(() => import("@/components/NewsSection").then(m => ({ default: m.NewsSection })));

function SectionFallback() {
  return <div className="h-32" />;
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WhyUsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <InsuranceTypesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <StatisticsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <PartnersSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <BranchesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <NewsSection />
      </Suspense>
    </div>
  );
}
