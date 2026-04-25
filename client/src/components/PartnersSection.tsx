import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export function PartnersSection() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const { data } = trpc.content.partners.useQuery();
  const partners = data || [];

  if (partners.length === 0) return null;

  // Triplicate for seamless infinite loop
  const items = [...partners, ...partners, ...partners];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t("partners.title")}
          </h2>
          <p className="text-lg text-foreground/70">
            {t("partners.subtitle")}
          </p>
        </div>
      </div>

      {/* Infinite scroll track */}
      <div className="relative w-full">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, white, transparent)" }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, white, transparent)" }} />

        <div
          className="flex gap-6 partners-scroll"
          style={{
            animation: isAr
              ? "scrollRtl 40s linear infinite"
              : "scrollLtr 40s linear infinite",
            width: "max-content",
          }}
        >
          {items.map((partner, idx) => (
            <div
              key={`${partner.id}-${idx}`}
              className="flex-shrink-0 w-44 h-24 bg-muted rounded-xl flex items-center justify-center px-4 hover:shadow-md transition-shadow duration-300 group"
            >
              {partner.logoUrl && !partner.logoUrl.includes("placeholder") ? (
                <img
                  src={partner.logoUrl} loading="lazy"
                  alt={isAr ? partner.nameAr : partner.nameEn}
                  className="max-w-full max-h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
              ) : (
                <span className="text-center text-sm font-semibold text-primary/60 group-hover:text-primary transition-colors duration-300 leading-tight">
                  {isAr ? partner.nameAr : partner.nameEn}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="container mt-10 text-center">
        <Link href="/partners/reinsurers">
          <Button
            size="lg"
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary hover:text-primary"
          >
            {t("partners.viewMore")}
          </Button>
        </Link>
      </div>

      <style>{`
        @keyframes scrollLtr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scrollRtl {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        .partners-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
