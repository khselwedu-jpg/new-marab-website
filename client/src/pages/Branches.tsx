import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { PageHeader } from "@/components/PageHeader";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BranchesPage() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const { data, isLoading } = trpc.content.branches.useQuery();
  const branches = data || [];

  return (
    <div>
      <PageHeader
        title={isAr ? "فروعنا ومكاتبنا" : "Our Branches & Offices"}
        breadcrumb={isAr ? "الفروع" : "Branches"}
      />

      <section className="py-16 bg-muted/30">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md h-72 animate-pulse" />
              ))}
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-20 text-foreground/50">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">{isAr ? "لا توجد فروع متاحة حالياً" : "No branches available"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Branch image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={
                        branch.imageUrl ||
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"
                      }
                      alt={isAr ? branch.nameAr : branch.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                    <div className="absolute bottom-4 right-4 left-4">
                      <h3 className="text-xl font-bold text-white">
                        {isAr ? branch.nameAr : branch.nameEn}
                      </h3>
                    </div>
                  </div>

                  {/* Branch details */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3 text-foreground/70">
                      <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">
                        {isAr ? branch.addressAr : branch.addressEn}
                      </p>
                    </div>

                    {branch.phone && (
                      <div className="flex items-center gap-3 text-foreground/70">
                        <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                        <a
                          href={`tel:${branch.phone}`}
                          dir="ltr"
                          className="text-sm hover:text-secondary transition-colors"
                        >
                          {branch.phone}
                        </a>
                      </div>
                    )}

                    {branch.email && (
                      <div className="flex items-center gap-3 text-foreground/70">
                        <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                        <a
                          href={`mailto:${branch.email}`}
                          className="text-sm hover:text-secondary transition-colors"
                        >
                          {branch.email}
                        </a>
                      </div>
                    )}

                    {branch.mapUrl && (
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-secondary text-secondary hover:bg-secondary hover:text-primary gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {isAr ? "عرض على الخريطة" : "View on Map"}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
