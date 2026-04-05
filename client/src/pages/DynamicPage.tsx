import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, AlertCircle, FileText } from "lucide-react";

interface DynamicPageProps {
  slug: string;
}

export default function DynamicPage({ slug }: DynamicPageProps) {
  const { language } = useLanguage();
  const { data: page, isLoading } = trpc.content.pageBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!page || !page.isActive) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">
          {language === "ar" ? "الصفحة غير متاحة" : "Page Not Available"}
        </h1>
        <p className="text-muted-foreground max-w-md">
          {language === "ar"
            ? "هذه الصفحة لم يتم إضافة محتواها بعد. يرجى التواصل مع الإدارة."
            : "This page content has not been added yet. Please contact the administration."}
        </p>
      </div>
    );
  }

  const title = language === "ar" ? page.titleAr : page.titleEn;
  const content = language === "ar" ? page.contentAr : page.contentEn;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div
        className="relative py-20 bg-primary text-white overflow-hidden"
        style={page.imageUrl ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${page.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        } : {}}
      >
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

      {/* Page Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {content ? (
          <div
            className="prose prose-lg max-w-none text-foreground leading-relaxed"
            style={{ direction: language === "ar" ? "rtl" : "ltr" }}
            dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <FileText className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {language === "ar"
                ? "لم يتم إضافة محتوى لهذه الصفحة بعد."
                : "No content has been added to this page yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
