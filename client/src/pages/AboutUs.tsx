import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";
import { trpc } from "@/lib/trpc";

function getSetting(
  settings: { key: string; valueAr: string | null; valueEn: string | null }[],
  key: string,
  lang: "ar" | "en",
  fallback = ""
) {
  const row = settings.find((s) => s.key === key);
  if (!row) return fallback;
  return (lang === "ar" ? row.valueAr : row.valueEn) ?? row.valueAr ?? row.valueEn ?? fallback;
}

export default function AboutUs() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { data: settings = [] } = trpc.content.settings.useQuery();

  // Dynamic content from settings (with fallbacks to original static content)
  const intro = isAr
    ? getSetting(settings, "about_intro_ar", "ar", "شركة مأرب اليمنية للتأمين هي إحدى الشركات الرائدة في مجال التأمين باليمن، تأسست بهدف تقديم خدمات تأمينية متميزة تلبي احتياجات السوق اليمني.")
    : getSetting(settings, "about_intro_en", "en", "Mareb Insurance Company is one of the leading insurance companies in Yemen, established to provide distinguished insurance services that meet the needs of the Yemeni market.");

  const historyText = isAr
    ? getSetting(settings, "about_history_ar", "ar", "منذ تأسيسها، حرصت شركة مأرب للتأمين على بناء سمعة قوية في السوق اليمني من خلال تقديم خدمات تأمينية عالية الجودة والتزامها الكامل بحماية مصالح عملائها. على مدار أكثر من 15 عاماً، نجحت الشركة في بناء قاعدة عملاء واسعة وشراكات استراتيجية مع كبرى شركات إعادة التأمين العالمية.")
    : getSetting(settings, "about_history_en", "en", "Since its establishment, Mareb Insurance Company has been committed to building a strong reputation in the Yemeni market by providing high-quality insurance services and full commitment to protecting the interests of its clients. Over more than 15 years, the company has successfully built a wide customer base and strategic partnerships with major global reinsurance companies.");

  const valuesText = isAr
    ? getSetting(settings, "about_values_ar", "ar", "نؤمن بأهمية النزاهة والشفافية في جميع تعاملاتنا، ونلتزم بتقديم أفضل الخدمات لعملائنا مع الحفاظ على أعلى معايير الجودة والمهنية. نسعى دائماً لتطوير خدماتنا ومواكبة أحدث التطورات في صناعة التأمين.")
    : getSetting(settings, "about_values_en", "en", "We believe in the importance of integrity and transparency in all our dealings, and we are committed to providing the best services to our clients while maintaining the highest standards of quality and professionalism. We always strive to develop our services and keep pace with the latest developments in the insurance industry.");

  const commitmentText = isAr
    ? getSetting(settings, "about_commitment_ar", "ar", "نلتزم بحماية مصالح عملائنا وتوفير الأمان والطمأنينة لهم ولعائلاتهم. نعمل على تقديم حلول تأمينية مبتكرة تتناسب مع احتياجات السوق المتغيرة ونضمن سرعة الاستجابة والتعويض العادل في حالة المطالبات.")
    : getSetting(settings, "about_commitment_en", "en", "We are committed to protecting the interests of our clients and providing security and peace of mind for them and their families. We work to provide innovative insurance solutions that suit the changing market needs and ensure quick response and fair compensation in case of claims.");

  // Statistics
  const stat1Value = getSetting(settings, "about_stat1_value", "ar", "15+");
  const stat1Label = isAr
    ? getSetting(settings, "about_stat1_label_ar", "ar", "سنة خبرة")
    : getSetting(settings, "about_stat1_label_en", "en", "Years Experience");

  const stat2Value = getSetting(settings, "about_stat2_value", "ar", "25,000+");
  const stat2Label = isAr
    ? getSetting(settings, "about_stat2_label_ar", "ar", "عميل راضٍ")
    : getSetting(settings, "about_stat2_label_en", "en", "Satisfied Clients");

  const stat3Value = getSetting(settings, "about_stat3_value", "ar", "60+");
  const stat3Label = isAr
    ? getSetting(settings, "about_stat3_label_ar", "ar", "شريك موثوق")
    : getSetting(settings, "about_stat3_label_en", "en", "Trusted Partners");

  const pageTitle = isAr ? "من نحن" : "Who We Are";

  return (
    <div>
      <PageHeader
        title={pageTitle}
        breadcrumb={pageTitle}
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
      />

      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Intro */}
            <div className="space-y-4">
              <p className="text-lg text-foreground/80 leading-relaxed">
                {intro}
              </p>
            </div>

            {/* History */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary border-b-2 border-secondary pb-2 inline-block">
                {isAr ? "تاريخنا" : "Our History"}
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                {historyText}
              </p>
            </div>

            {/* Values & Commitment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted rounded-lg p-8 space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  {isAr ? "قيمنا" : "Our Values"}
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {valuesText}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-8 space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  {isAr ? "التزامنا" : "Our Commitment"}
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {commitmentText}
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="text-center p-6 bg-primary rounded-lg text-white">
                <div className="text-4xl font-bold text-secondary mb-2">{stat1Value}</div>
                <p className="text-lg">{stat1Label}</p>
              </div>
              <div className="text-center p-6 bg-primary rounded-lg text-white">
                <div className="text-4xl font-bold text-secondary mb-2">{stat2Value}</div>
                <p className="text-lg">{stat2Label}</p>
              </div>
              <div className="text-center p-6 bg-primary rounded-lg text-white">
                <div className="text-4xl font-bold text-secondary mb-2">{stat3Value}</div>
                <p className="text-lg">{stat3Label}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
