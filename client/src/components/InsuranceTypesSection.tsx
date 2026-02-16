import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Car, Ship, HardHat, Zap, Building2 } from "lucide-react";

export function InsuranceTypesSection() {
  const { t } = useLanguage();

  const insuranceTypes = [
    {
      icon: Heart,
      titleKey: "insurance.health",
      href: "/insurance/health",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    },
    {
      icon: Car,
      titleKey: "insurance.car",
      href: "/insurance/car",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80",
    },
    {
      icon: Ship,
      titleKey: "insurance.marine",
      href: "/insurance/marine",
      image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=600&q=80",
    },
    {
      icon: HardHat,
      titleKey: "insurance.engineering",
      href: "/insurance/engineering",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80",
    },
    {
      icon: Zap,
      titleKey: "insurance.energy",
      href: "/insurance/energy",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80",
    },
    {
      icon: Building2,
      titleKey: "insurance.takaful",
      href: "/insurance/takaful",
      image: "https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=600&q=80",
    },
  ];

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
          {insuranceTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={type.image}
                    alt={t(type.titleKey)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/60 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                    {t(type.titleKey)}
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    {t(`${type.titleKey}.desc`) !== `${type.titleKey}.desc`
                      ? t(`${type.titleKey}.desc`)
                      : "نقدم لكم أفضل الحلول التأمينية المتخصصة"}
                  </p>
                  <Link href={type.href}>
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
