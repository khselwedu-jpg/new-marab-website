import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "wouter";

export function NewsSection() {
  const { t } = useLanguage();

  const news = [
    {
      titleAr: "إطلاق منتج تأميني جديد للشركات الصغيرة والمتوسطة",
      titleEn: "Launch of New Insurance Product for SMEs",
      summaryAr: "أعلنت شركة مأرب للتأمين عن إطلاق منتج تأميني جديد مخصص للشركات الصغيرة والمتوسطة",
      summaryEn: "Mareb Insurance Company announced the launch of a new insurance product for small and medium enterprises",
      date: "2026-02-10",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    },
    {
      titleAr: "توقيع اتفاقية شراكة استراتيجية مع شركة عالمية",
      titleEn: "Strategic Partnership Agreement with Global Company",
      summaryAr: "وقعت شركة مأرب للتأمين اتفاقية شراكة استراتيجية مع إحدى الشركات العالمية الرائدة",
      summaryEn: "Mareb Insurance Company signed a strategic partnership agreement with a leading global company",
      date: "2026-02-05",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
    },
    {
      titleAr: "مشاركة فعالة في المؤتمر السنوي للتأمين",
      titleEn: "Active Participation in Annual Insurance Conference",
      summaryAr: "شاركت شركة مأرب للتأمين بفعالية في المؤتمر السنوي للتأمين الذي أقيم في العاصمة",
      summaryEn: "Mareb Insurance Company actively participated in the annual insurance conference held in the capital",
      date: "2026-01-28",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          {t("news.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={t("nav.home") === "الرئيسية" ? item.titleAr : item.titleEn}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-secondary text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(item.date).toLocaleDateString(
                    t("nav.home") === "الرئيسية" ? "ar-YE" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}</span>
                </div>
                <h3 className="text-xl font-bold text-primary line-clamp-2">
                  {t("nav.home") === "الرئيسية" ? item.titleAr : item.titleEn}
                </h3>
                <p className="text-foreground/70 text-sm line-clamp-3">
                  {t("nav.home") === "الرئيسية" ? item.summaryAr : item.summaryEn}
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
