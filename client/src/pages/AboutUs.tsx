import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/PageHeader";

export default function AboutUs() {
  const { t, language } = useLanguage();

  const content = {
    ar: {
      title: "من نحن",
      intro: "شركة مأرب اليمنية للتأمين هي إحدى الشركات الرائدة في مجال التأمين باليمن، تأسست بهدف تقديم خدمات تأمينية متميزة تلبي احتياجات السوق اليمني.",
      history: "تاريخنا",
      historyText: "منذ تأسيسها، حرصت شركة مأرب للتأمين على بناء سمعة قوية في السوق اليمني من خلال تقديم خدمات تأمينية عالية الجودة والتزامها الكامل بحماية مصالح عملائها. على مدار أكثر من 15 عاماً، نجحت الشركة في بناء قاعدة عملاء واسعة وشراكات استراتيجية مع كبرى شركات إعادة التأمين العالمية.",
      values: "قيمنا",
      valuesText: "نؤمن بأهمية النزاهة والشفافية في جميع تعاملاتنا، ونلتزم بتقديم أفضل الخدمات لعملائنا مع الحفاظ على أعلى معايير الجودة والمهنية. نسعى دائماً لتطوير خدماتنا ومواكبة أحدث التطورات في صناعة التأمين.",
      commitment: "التزامنا",
      commitmentText: "نلتزم بحماية مصالح عملائنا وتوفير الأمان والطمأنينة لهم ولعائلاتهم. نعمل على تقديم حلول تأمينية مبتكرة تتناسب مع احتياجات السوق المتغيرة ونضمن سرعة الاستجابة والتعويض العادل في حالة المطالبات.",
    },
    en: {
      title: "Who We Are",
      intro: "Mareb Insurance Company is one of the leading insurance companies in Yemen, established to provide distinguished insurance services that meet the needs of the Yemeni market.",
      history: "Our History",
      historyText: "Since its establishment, Mareb Insurance Company has been committed to building a strong reputation in the Yemeni market by providing high-quality insurance services and full commitment to protecting the interests of its clients. Over more than 15 years, the company has successfully built a wide customer base and strategic partnerships with major global reinsurance companies.",
      values: "Our Values",
      valuesText: "We believe in the importance of integrity and transparency in all our dealings, and we are committed to providing the best services to our clients while maintaining the highest standards of quality and professionalism. We always strive to develop our services and keep pace with the latest developments in the insurance industry.",
      commitment: "Our Commitment",
      commitmentText: "We are committed to protecting the interests of our clients and providing security and peace of mind for them and their families. We work to provide innovative insurance solutions that suit the changing market needs and ensure quick response and fair compensation in case of claims.",
    },
  };

  const text = content[language];

  return (
    <div>
      <PageHeader
        title={text.title}
        breadcrumb={text.title}
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
      />

      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <p className="text-lg text-foreground/80 leading-relaxed">
                {text.intro}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary border-b-2 border-secondary pb-2 inline-block">
                {text.history}
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                {text.historyText}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted rounded-lg p-8 space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  {text.values}
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {text.valuesText}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-8 space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  {text.commitment}
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {text.commitmentText}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="text-center p-6 bg-primary rounded-lg text-white">
                <div className="text-4xl font-bold text-secondary mb-2">15+</div>
                <p className="text-lg">{language === "ar" ? "سنة خبرة" : "Years Experience"}</p>
              </div>
              <div className="text-center p-6 bg-primary rounded-lg text-white">
                <div className="text-4xl font-bold text-secondary mb-2">25,000+</div>
                <p className="text-lg">{language === "ar" ? "عميل راضٍ" : "Satisfied Clients"}</p>
              </div>
              <div className="text-center p-6 bg-primary rounded-lg text-white">
                <div className="text-4xl font-bold text-secondary mb-2">60+</div>
                <p className="text-lg">{language === "ar" ? "شريك موثوق" : "Trusted Partners"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
