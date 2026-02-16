import { useLanguage } from "@/contexts/LanguageContext";
import { Award, Shield, Layers, Headphones } from "lucide-react";

export function WhyUsSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Award,
      titleKey: "why.experience.title",
      descKey: "why.experience.desc",
    },
    {
      icon: Shield,
      titleKey: "why.trust.title",
      descKey: "why.trust.desc",
    },
    {
      icon: Layers,
      titleKey: "why.coverage.title",
      descKey: "why.coverage.desc",
    },
    {
      icon: Headphones,
      titleKey: "why.support.title",
      descKey: "why.support.desc",
    },
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          {t("why.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
