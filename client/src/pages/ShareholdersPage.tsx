import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ShareholdersPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { data: partnersList, isLoading } = trpc.content.partnersByCategory.useQuery({ category: "other" });

  const title = isAr ? "المساهمون والشركاء" : "Shareholders & Partners";
  const subtitle = isAr
    ? "الشركاء المؤسسون لشركة مأرب اليمنية للتأمين منذ عام 1974م"
    : "Founding partners of Mareb Yemeni Insurance Company since 1974";

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-white/80 text-lg mb-4">{subtitle}</p>
          <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
            <a href="/" className="hover:text-white transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </a>
            <span>/</span>
            <span className="text-secondary">{title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Company capital info */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-12 text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">
            {isAr ? "رأس المال" : "Capital"}
          </h2>
          <p className="text-3xl font-bold text-secondary">
            {isAr ? "مليار ريال يمني" : "One Billion Yemeni Riyals"}
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            {isAr
              ? "يمثل كل 10% من الأسهم عضو في مجلس الإدارة"
              : "Every 10% of shares represents one board member"}
          </p>
        </div>

        {/* Shareholders grid */}
        {!partnersList || partnersList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {isAr ? "لم يتم إضافة مساهمين بعد." : "No shareholders added yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnersList.map((partner) => {
              const name = isAr ? partner.nameAr : partner.nameEn;
              // Extract percentage from name (format: "Name — XX%")
              const parts = name.split(" — ");
              const displayName = parts[0];
              const percentage = parts[1] || "";
              const phone = isAr ? partner.descriptionAr : partner.descriptionEn;

              return (
                <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-2 hover:border-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground leading-tight mb-2">
                          {displayName}
                        </h3>
                        {phone && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {phone}
                          </p>
                        )}
                      </div>
                      {percentage && (
                        <div className="flex-shrink-0 text-center">
                          <div className="bg-secondary text-primary font-bold text-xl px-4 py-2 rounded-xl min-w-[80px]">
                            {percentage}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isAr ? "نسبة المساهمة" : "Share"}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
