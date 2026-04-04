import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export function PartnersSection() {
  const { t } = useLanguage();
  const { data } = trpc.content.partners.useQuery();
  const partners = data || [];

  if (partners.length === 0) return null;

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
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="group bg-muted rounded-lg p-6 flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={partner.logoUrl}
                alt={partner.nameAr}
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
