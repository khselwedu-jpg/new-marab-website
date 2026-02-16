import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function PartnersSection() {
  const { t } = useLanguage();

  const partners = [
    { name: "Partner Company 1", logo: "https://via.placeholder.com/200x100?text=Partner+1" },
    { name: "Partner Company 2", logo: "https://via.placeholder.com/200x100?text=Partner+2" },
    { name: "Partner Company 3", logo: "https://via.placeholder.com/200x100?text=Partner+3" },
    { name: "Partner Company 4", logo: "https://via.placeholder.com/200x100?text=Partner+4" },
    { name: "Partner Company 5", logo: "https://via.placeholder.com/200x100?text=Partner+5" },
    { name: "Partner Company 6", logo: "https://via.placeholder.com/200x100?text=Partner+6" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t("partners.title")}
          </h2>
          <p className="text-lg text-foreground/70">
            {t("partners.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group bg-muted rounded-lg p-6 flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/partners/success">
            <Button
              size="lg"
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-primary"
            >
              {t("partners.viewMore")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
