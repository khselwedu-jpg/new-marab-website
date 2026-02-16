import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

interface InsuranceDetailProps {
  type: "health" | "car" | "marine" | "engineering" | "energy" | "takaful";
}

export default function InsuranceDetail({ type }: InsuranceDetailProps) {
  const { t, language } = useLanguage();

  const insuranceData = {
    health: {
      titleAr: "التأمين الصحي",
      titleEn: "Health Insurance",
      descAr: "نقدم لكم أفضل حلول التأمين الصحي الشاملة التي تغطي جميع احتياجاتكم الطبية وتوفر لكم الرعاية الصحية المتميزة.",
      descEn: "We offer the best comprehensive health insurance solutions that cover all your medical needs and provide you with excellent healthcare.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80",
      featuresAr: [
        "تغطية شاملة للعلاج في المستشفيات الخاصة والحكومية",
        "تغطية الأدوية والفحوصات الطبية",
        "تغطية العمليات الجراحية والطوارئ",
        "خدمات الرعاية الوقائية والفحوصات الدورية",
        "تغطية علاج الأسنان والعيون",
        "خدمة الطوارئ على مدار الساعة",
      ],
      featuresEn: [
        "Comprehensive coverage for treatment in private and public hospitals",
        "Coverage for medicines and medical tests",
        "Coverage for surgical operations and emergencies",
        "Preventive care services and periodic examinations",
        "Dental and eye treatment coverage",
        "24/7 emergency service",
      ],
    },
    car: {
      titleAr: "تأمين السيارات",
      titleEn: "Car Insurance",
      descAr: "نوفر لكم حماية شاملة لمركباتكم ضد جميع المخاطر المحتملة على الطرق.",
      descEn: "We provide comprehensive protection for your vehicles against all potential road risks.",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80",
      featuresAr: [
        "تغطية شاملة ضد الحوادث والتصادم",
        "تغطية الأضرار الناتجة عن الحريق والسرقة",
        "المسؤولية تجاه الطرف الثالث",
        "خدمة المساعدة على الطريق",
        "تغطية الكوارث الطبيعية",
        "سرعة في معالجة المطالبات",
      ],
      featuresEn: [
        "Comprehensive coverage against accidents and collisions",
        "Coverage for fire and theft damage",
        "Third party liability",
        "Roadside assistance service",
        "Natural disaster coverage",
        "Fast claims processing",
      ],
    },
    marine: {
      titleAr: "التأمين البحري",
      titleEn: "Marine Insurance",
      descAr: "حماية شاملة للبضائع والسفن أثناء النقل البحري.",
      descEn: "Comprehensive protection for cargo and vessels during maritime transport.",
      image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1920&q=80",
      featuresAr: [
        "تغطية البضائع أثناء النقل البحري",
        "تأمين السفن والقوارب",
        "تغطية المسؤولية البحرية",
        "حماية ضد الكوارث البحرية",
        "تغطية التلف والفقدان",
        "خدمات استشارية متخصصة",
      ],
      featuresEn: [
        "Cargo coverage during maritime transport",
        "Ship and boat insurance",
        "Marine liability coverage",
        "Protection against marine disasters",
        "Damage and loss coverage",
        "Specialized consulting services",
      ],
    },
    engineering: {
      titleAr: "التأمين الهندسي",
      titleEn: "Engineering Insurance",
      descAr: "حلول تأمينية متخصصة للمشاريع الهندسية والإنشائية.",
      descEn: "Specialized insurance solutions for engineering and construction projects.",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80",
      featuresAr: [
        "تأمين المشاريع الإنشائية",
        "تغطية المعدات والآلات",
        "تأمين المسؤولية المهنية",
        "حماية ضد أخطار التشييد",
        "تغطية فترة الصيانة",
        "استشارات هندسية متخصصة",
      ],
      featuresEn: [
        "Construction project insurance",
        "Equipment and machinery coverage",
        "Professional liability insurance",
        "Protection against construction risks",
        "Maintenance period coverage",
        "Specialized engineering consultations",
      ],
    },
    energy: {
      titleAr: "تأمين الطاقة",
      titleEn: "Energy Insurance",
      descAr: "تغطية شاملة لمشاريع الطاقة والبنية التحتية.",
      descEn: "Comprehensive coverage for energy projects and infrastructure.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80",
      featuresAr: [
        "تأمين مشاريع الطاقة المتجددة",
        "تغطية محطات الكهرباء",
        "تأمين خطوط النقل والتوزيع",
        "حماية المنشآت النفطية",
        "تغطية الأضرار التشغيلية",
        "خدمات إدارة المخاطر",
      ],
      featuresEn: [
        "Renewable energy project insurance",
        "Power plant coverage",
        "Transmission and distribution line insurance",
        "Oil facility protection",
        "Operational damage coverage",
        "Risk management services",
      ],
    },
    takaful: {
      titleAr: "التأمين التكافلي الإسلامي",
      titleEn: "Islamic Takaful Insurance",
      descAr: "حلول تأمينية متوافقة مع أحكام الشريعة الإسلامية.",
      descEn: "Insurance solutions compliant with Islamic Sharia principles.",
      image: "https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=1920&q=80",
      featuresAr: [
        "منتجات متوافقة مع الشريعة الإسلامية",
        "نظام التكافل والتعاون",
        "استثمارات حلال",
        "شفافية كاملة في العمليات",
        "إشراف هيئة شرعية",
        "توزيع عادل للفوائض",
      ],
      featuresEn: [
        "Sharia-compliant products",
        "Takaful and cooperation system",
        "Halal investments",
        "Full transparency in operations",
        "Sharia board supervision",
        "Fair surplus distribution",
      ],
    },
  };

  const data = insuranceData[type];
  const title = language === "ar" ? data.titleAr : data.titleEn;
  const description = language === "ar" ? data.descAr : data.descEn;
  const features = language === "ar" ? data.featuresAr : data.featuresEn;

  return (
    <div>
      <PageHeader title={title} breadcrumb={title} image={data.image} />

      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-6">
                  {language === "ar" ? "نظرة عامة" : "Overview"}
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">
                  {language === "ar" ? "المزايا والتغطيات" : "Benefits & Coverage"}
                </h3>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary rounded-lg p-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-4">
                  {language === "ar" 
                    ? "هل تحتاج إلى مزيد من المعلومات؟" 
                    : "Need More Information?"}
                </h3>
                <p className="mb-6 text-white/90">
                  {language === "ar"
                    ? "تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر مخصص"
                    : "Contact us now for a free consultation and personalized quote"}
                </p>
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-secondary text-primary hover:bg-secondary/90"
                  >
                    {t("hero.cta")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
