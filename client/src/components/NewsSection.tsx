import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export function NewsSection() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const { data } = trpc.content.news.useQuery();
  const news = data || [];

  if (news.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          {t("news.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border"
            >
              {item.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={isAr ? item.titleAr : item.titleEn}
                    loading="lazy"
                    width="600"
                    height="192"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-secondary text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(item.publishDate || item.createdAt).toLocaleDateString(
                    isAr ? "ar-YE" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}</span>
                </div>
                <h3 className="text-xl font-bold text-primary line-clamp-2">
                  {isAr ? item.titleAr : item.titleEn}
                </h3>
                <p className="text-foreground/70 text-sm line-clamp-3">
                  {isAr ? item.summaryAr : item.summaryEn}
                </p>
                <Link href="/media/news">
                  <Button
                    variant="link"
                    className="text-secondary hover:text-secondary/80 p-0"
                  >
                    {t("news.readMore")} →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
