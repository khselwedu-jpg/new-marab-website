import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import { trpc } from "@/lib/trpc";

const FALLBACK_BRANCHES = [
  { id: 1, nameAr: "فرع صنعاء الرئيسي", nameEn: "Sana'a Main Branch", addressAr: "شارع الزبيري، صنعاء", addressEn: "Al-Zubairi Street, Sana'a", phone: "+967 1 234 567", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80", mapUrl: "https://maps.google.com/?q=Sanaa,Yemen", email: null, workingHoursAr: null, workingHoursEn: null, isMain: true, displayOrder: 0, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, nameAr: "فرع عدن", nameEn: "Aden Branch", addressAr: "شارع المعلا، عدن", addressEn: "Al-Mualla Street, Aden", phone: "+967 2 345 678", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80", mapUrl: "https://maps.google.com/?q=Aden,Yemen", email: null, workingHoursAr: null, workingHoursEn: null, isMain: false, displayOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, nameAr: "فرع تعز", nameEn: "Taiz Branch", addressAr: "شارع جمال، تعز", addressEn: "Jamal Street, Taiz", phone: "+967 4 456 789", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80", mapUrl: "https://maps.google.com/?q=Taiz,Yemen", email: null, workingHoursAr: null, workingHoursEn: null, isMain: false, displayOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

export function BranchesSection() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const { data } = trpc.content.branches.useQuery();
  const branches = (data && data.length > 0) ? data : FALLBACK_BRANCHES;

  return (
    <section className="py-20 bg-muted">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          {t("branches.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={branch.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"}
                  alt={isAr ? branch.nameAr : branch.nameEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary">
                  {isAr ? branch.nameAr : branch.nameEn}
                </h3>
                <div className="flex items-start gap-2 text-foreground/70">
                  <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    {isAr ? branch.addressAr : branch.addressEn}
                  </p>
                </div>
                {branch.phone && (
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                    <a href={`tel:${branch.phone}`} dir="ltr" className="text-sm hover:text-secondary">
                      {branch.phone}
                    </a>
                  </div>
                )}
                {branch.mapUrl && (
                  <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="w-full border-secondary text-secondary hover:bg-secondary hover:text-primary"
                    >
                      {t("branches.viewLocation")}
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
