import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TeamPage() {
  const { language } = useLanguage();
  const { data: members, isLoading } = trpc.content.teamMembers.useQuery();

  const title = language === "ar" ? "فريق العمل" : "Our Team";

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
        {!members || members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Users className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {language === "ar" ? "لم يتم إضافة أعضاء الفريق بعد." : "No team members added yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {member.imageUrl && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.imageUrl}
                      alt={language === "ar" ? member.nameAr : member.nameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!member.imageUrl && (
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <Users className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold text-lg text-foreground">
                    {language === "ar" ? member.nameAr : member.nameEn}
                  </h3>
                  {(member.positionAr || member.positionEn) && (
                    <p className="text-primary text-sm mt-1">
                      {language === "ar" ? member.positionAr : member.positionEn}
                    </p>
                  )}
                  {(member.bioAr || member.bioEn) && (
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
                      {language === "ar" ? member.bioAr : member.bioEn}
                    </p>
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
