import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Shield } from "lucide-react";

export default function InsuranceList() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [, navigate] = useLocation();
  const { data: insuranceTypes = [], isLoading } = trpc.content.insuranceTypes.useQuery();

  return (
    <div className="min-h-screen flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      <Navigation />

      {/* Page Header */}
      <section className="bg-primary text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">
            {isAr ? "أنواع التأمين" : "Insurance Types"}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {isAr
              ? "نقدم مجموعة متكاملة من حلول التأمين لحماية أصولكم وأعمالكم"
              : "We offer a comprehensive range of insurance solutions to protect your assets and business"}
          </p>
        </div>
      </section>

      {/* Insurance Types Grid */}
      <section className="py-16 bg-gray-50 flex-1">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {insuranceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "instant" });
                    navigate(`/insurance/${type.slug}`);
                  }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-right group"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-primary/10">
                    {type.imageUrl ? (
                      <img
                        src={type.imageUrl}
                        alt={isAr ? type.titleAr : type.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Shield className="w-16 h-16 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-primary text-lg mb-2">
                      {isAr ? type.titleAr : type.titleEn}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {isAr ? type.descriptionAr : type.descriptionEn}
                    </p>
                    <span className="inline-block mt-3 text-secondary font-semibold text-sm">
                      {isAr ? "اعرف المزيد ←" : "Learn More →"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
