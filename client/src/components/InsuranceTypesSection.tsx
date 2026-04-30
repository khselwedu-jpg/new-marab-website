import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Heart, Car, Ship, HardHat, Zap, Building2, Shield } from "lucide-react";
import type { LucideProps } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Heart, Car, Ship, HardHat, Zap, Building2, Shield,
};

const FALLBACK_TYPES = [
  { id: 1, slug: "health", titleAr: "التأمين الصحي", titleEn: "Health Insurance", descriptionAr: "نقدم لكم أفضل الحلول التأمينية الصحية", descriptionEn: "We provide the best health insurance solutions", imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80", icon: "Heart", featuresAr: null, featuresEn: null, displayOrder: 0, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, slug: "car", titleAr: "تأمين السيارات", titleEn: "Car Insurance", descriptionAr: "حماية شاملة لسيارتك", descriptionEn: "Comprehensive protection for your car", imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80", icon: "Car", featuresAr: null, featuresEn: null, displayOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, slug: "marine", titleAr: "التأمين البحري", titleEn: "Marine Insurance", descriptionAr: "تأمين الشحن البحري والسفن", descriptionEn: "Marine cargo and vessel insurance", imageUrl: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=600&q=80", icon: "Ship", featuresAr: null, featuresEn: null, displayOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, slug: "engineering", titleAr: "التأمين الهندسي", titleEn: "Engineering Insurance", descriptionAr: "تأمين المشاريع الهندسية والإنشائية", descriptionEn: "Engineering and construction project insurance", imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80", icon: "HardHat", featuresAr: null, featuresEn: null, displayOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, slug: "energy", titleAr: "تأمين الطاقة", titleEn: "Energy Insurance", descriptionAr: "تأمين قطاع الطاقة والنفط والغاز", descriptionEn: "Energy, oil and gas sector insurance", imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80", icon: "Zap", featuresAr: null, featuresEn: null, displayOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, slug: "takaful", titleAr: "التأمين التكافلي", titleEn: "Takaful Insurance", descriptionAr: "التأمين الإسلامي وفق أحكام الشريعة", descriptionEn: "Islamic insurance according to Sharia principles", imageUrl: "https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=600&q=80", icon: "Building2", featuresAr: null, featuresEn: null, displayOrder: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

export function InsuranceTypesSection() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const { data } = trpc.content.insuranceTypes.useQuery();
  const types = (data && data.length > 0) ? data : FALLBACK_TYPES;

  return (
    <section className="py-20 bg-muted">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t("insurance.title")}
          </h2>
          <p className="text-lg text-foreground/70">
            {t("insurance.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {types.map((type) => {
            const IconComponent = (type.icon && ICON_MAP[type.icon]) || Shield;
            return (
              <div
                key={type.id}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={type.imageUrl}
                    alt={isAr ? type.titleAr : type.titleEn}
                    loading="lazy"
                    width="600"
                    height="192"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/60 transition-colors" />

                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                    {isAr ? type.titleAr : type.titleEn}
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    {isAr ? type.descriptionAr : type.descriptionEn}
                  </p>
                  <Link href={`/insurance/${type.slug}`}>
                    <Button
                      variant="outline"
                      className="w-full border-secondary text-secondary hover:bg-secondary hover:text-primary"
                    >
                      {t("insurance.viewDetails")}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
