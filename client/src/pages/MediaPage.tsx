import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Image, Video, Mic, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type MediaType = "photo" | "video" | "conference" | "event";

interface MediaPageProps {
  type: MediaType;
}

const typeConfig = {
  photo: {
    titleAr: "معرض الصور",
    titleEn: "Photo Gallery",
    icon: Image,
  },
  video: {
    titleAr: "مكتبة الفيديو",
    titleEn: "Video Library",
    icon: Video,
  },
  conference: {
    titleAr: "المؤتمرات",
    titleEn: "Conferences",
    icon: Mic,
  },
  event: {
    titleAr: "الفعاليات",
    titleEn: "Events",
    icon: Calendar,
  },
};

export default function MediaPage({ type }: MediaPageProps) {
  const { language } = useLanguage();
  const { data: items, isLoading } = trpc.content.mediaByType.useQuery({ type });

  const config = typeConfig[type];
  const title = language === "ar" ? config.titleAr : config.titleEn;
  const Icon = config.icon;

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
            <a href="/media/photos" className="hover:text-white transition-colors">
              {language === "ar" ? "المركز الإعلامي" : "Media Center"}
            </a>
            <span>/</span>
            <span className="text-secondary">{title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {!items || items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Icon className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {language === "ar" ? "لم يتم إضافة محتوى بعد." : "No content added yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-video overflow-hidden bg-muted relative">
                  {item.thumbnailUrl || (type === "photo" && item.mediaUrl) ? (
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={language === "ar" ? item.titleAr : item.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  {type === "video" && (
                    <a
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                        <Video className="w-6 h-6 text-primary ml-1" />
                      </div>
                    </a>
                  )}
                  {type === "photo" && (
                    <a
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                        <Image className="w-6 h-6 text-primary" />
                      </div>
                    </a>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {language === "ar" ? item.titleAr : item.titleEn}
                  </h3>
                  {(item.descriptionAr || item.descriptionEn) && (
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {language === "ar" ? item.descriptionAr : item.descriptionEn}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(item.publishDate).toLocaleDateString(
                      language === "ar" ? "ar-YE" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
