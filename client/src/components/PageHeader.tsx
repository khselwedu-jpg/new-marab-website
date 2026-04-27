import { useLanguage } from "@/contexts/LanguageContext";

interface PageHeaderProps {
  title: string;
  breadcrumb?: string;
  image?: string;
}

export function PageHeader({ title, breadcrumb, image }: PageHeaderProps) {
  const { t } = useLanguage();

  return (
    <section className="relative h-64 flex items-center justify-center overflow-hidden">
      {image && (
        <>
          <img
            src={image}
            alt={title}
            loading="lazy"
            width="1920"
            height="256"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
        </>
      )}
      {!image && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
      )}
      <div className="relative container text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        {breadcrumb && (
          <div className="flex items-center justify-center gap-2 text-white/80">
            <span>{t("nav.home")}</span>
            <span>/</span>
            <span className="text-secondary">{breadcrumb}</span>
          </div>
        )}
      </div>
    </section>
  );
}
