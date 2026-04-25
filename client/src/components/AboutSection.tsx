import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export function AboutSection() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const { data: about } = trpc.content.about.useQuery();

  const title = about ? (isAr ? about.titleAr : about.titleEn) : t("about.title");
  const description = about ? (isAr ? about.contentAr : about.contentEn) : t("about.description");
  const imageUrl = about?.imageUrl || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80";

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <img
              src={imageUrl} loading="lazy"
              alt={title}
              className="rounded-lg shadow-xl w-full h-[400px] object-cover"
            />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              {title}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {description}
            </p>
            <Link href="/about/who-we-are">
              <Button
                size="lg"
                className="bg-secondary text-primary hover:bg-secondary/90"
              >
                {t("about.cta")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
