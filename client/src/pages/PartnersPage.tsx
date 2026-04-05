import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Users2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type PartnerCategory = "reinsurer" | "broker" | "medical" | "other";

interface PartnersPageProps {
  category: PartnerCategory;
}

const categoryConfig = {
  reinsurer: {
    titleAr: "شركات إعادة التأمين",
    titleEn: "Reinsurance Companies",
  },
  broker: {
    titleAr: "وسطاء التأمين",
    titleEn: "Insurance Brokers",
  },
  medical: {
    titleAr: "الشركاء الطبيون",
    titleEn: "Medical Partners",
  },
  other: {
    titleAr: "الشركاء",
    titleEn: "Partners",
  },
};

export default function PartnersPage({ category }: PartnersPageProps) {
  const { language } = useLanguage();
  const { data: partnersList, isLoading } = trpc.content.partnersByCategory.useQuery({ category });

  const config = categoryConfig[category];
  const title = language === "ar" ? config.titleAr : config.titleEn;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
            <a href="/" className="hover:text-white transition-colors">
              {language === "ar" ? "الرئيسية" : "Home"}
            </a>
            <span>/</span>
            <span className="text-secondary">{title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {!partnersList || partnersList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Users2 className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {language === "ar" ? "لم يتم إضافة شركاء بعد." : "No partners added yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {partnersList.map((partner) => (
              <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                  {partner.logoUrl ? (
                    <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-lg bg-muted">
                      <img
                        src={partner.logoUrl}
                        alt={language === "ar" ? partner.nameAr : partner.nameEn}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                      <Users2 className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">
                      {language === "ar" ? partner.nameAr : partner.nameEn}
                    </h3>
                    {(partner.descriptionAr || partner.descriptionEn) && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {language === "ar" ? partner.descriptionAr : partner.descriptionEn}
                      </p>
                    )}
                  </div>
                  {partner.websiteUrl && (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      {language === "ar" ? "زيارة الموقع" : "Visit Website"}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
