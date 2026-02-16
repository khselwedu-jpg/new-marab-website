import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { InsuranceTypesSection } from "@/components/InsuranceTypesSection";
import { StatisticsSection } from "@/components/StatisticsSection";
import { PartnersSection } from "@/components/PartnersSection";
import { BranchesSection } from "@/components/BranchesSection";
import { NewsSection } from "@/components/NewsSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <WhyUsSection />
      <InsuranceTypesSection />
      <StatisticsSection />
      <PartnersSection />
      <BranchesSection />
      <NewsSection />
    </div>
  );
}
