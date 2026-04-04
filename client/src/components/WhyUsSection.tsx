import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Award, Shield, Layers, Headphones, Star, CheckCircle, type LucideProps } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Award, Shield, Layers, Headphones, Star, CheckCircle,
};

const FALLBACK_FEATURES = [
  { id: 1, titleAr: "خبرة واسعة", titleEn: "Wide Experience", descriptionAr: "خبرة تزيد عن 15 عاماً في مجال التأمين", descriptionEn: "Over 15 years of experience in insurance", icon: "Award", displayOrder: 0, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, titleAr: "ثقة وأمان", titleEn: "Trust & Security", descriptionAr: "نحمي مصالحك بأعلى معايير الجودة", descriptionEn: "We protect your interests with the highest quality standards", icon: "Shield", displayOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, titleAr: "تغطية شاملة", titleEn: "Comprehensive Coverage", descriptionAr: "حلول تأمينية متكاملة لجميع احتياجاتك", descriptionEn: "Integrated insurance solutions for all your needs", icon: "Layers", displayOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, titleAr: "دعم متواصل", titleEn: "Continuous Support", descriptionAr: "فريق دعم متاح 24/7 لخدمتك", descriptionEn: "Support team available 24/7 at your service", icon: "Headphones", displayOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

export function WhyUsSection() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const { data } = trpc.content.whyUs.useQuery();
  const features = (data && data.length > 0) ? data : FALLBACK_FEATURES;

  return (
    <section className="py-20 bg-primary">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          {t("why.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = (feature.icon && ICON_MAP[feature.icon]) || Award;
            return (
              <div
                key={feature.id}
                className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
                  <IconComponent className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {isAr ? feature.titleAr : feature.titleEn}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {isAr ? feature.descriptionAr : feature.descriptionEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
