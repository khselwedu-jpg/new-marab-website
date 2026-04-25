import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";

function getSetting(settings: { key: string; valueAr: string | null; valueEn: string | null }[], key: string, lang: "ar" | "en", fallback = "") {
  const row = settings.find((s) => s.key === key);
  if (!row) return fallback;
  return (lang === "ar" ? row.valueAr : row.valueEn) ?? row.valueAr ?? row.valueEn ?? fallback;
}

export function Footer() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const [, navigate] = useLocation();

  const { data: settings = [] } = trpc.content.settings.useQuery();
  const { data: insuranceTypes = [] } = trpc.content.insuranceTypes.useQuery();

  // Social media links from settings
  const facebook = getSetting(settings, "social_facebook", "ar", "");
  const twitter = getSetting(settings, "social_twitter", "ar", "");
  const instagram = getSetting(settings, "social_instagram", "ar", "");
  const linkedin = getSetting(settings, "social_linkedin", "ar", "");
  const youtube = getSetting(settings, "social_youtube", "ar", "");

  // Contact info from settings (keys match SiteSettings page)
  const phone = getSetting(settings, "phone_main", "ar", "+967 1 234 567");
  const email = getSetting(settings, "email_main", "ar", "info@marebinsurance.com");
  const address = isAr
    ? getSetting(settings, "address_ar", "ar", "صنعاء، اليمن")
    : getSetting(settings, "address_en", "en", "Sana'a, Yemen");

  const quickLinks = [
    { label: isAr ? "الرئيسية" : "Home", href: "/" },
    { label: isAr ? "من نحن" : "Who We Are", href: "/about/who-we-are" },
    { label: isAr ? "الرؤية" : "Vision", href: "/about/vision" },
    { label: isAr ? "الرسالة" : "Mission", href: "/about/mission" },
    { label: isAr ? "تواصل معنا" : "Contact Us", href: "/contact" },
  ];

  // Navigate and scroll to top
  const handleNavClick = (href: string) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(href);
  };

  return (
    <footer className="bg-primary text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo and Social Media */}
          <div className="space-y-4">
            <button onClick={() => handleNavClick("/")} className="block">
              <img
                src="/logo-new.png"
                alt="Mareb Insurance"
                className="h-20 w-auto object-contain mb-4"
              />
            </button>
            <p className="text-white/80 text-sm leading-relaxed">
              {t("footer.aboutText")}
            </p>
            <div className="flex gap-3 pt-2 flex-wrap">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5 text-secondary hover:text-primary" />
                </a>
              )}
              {twitter && (
                <a href={twitter} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5 text-secondary hover:text-primary" />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5 text-secondary hover:text-primary" />
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5 text-secondary hover:text-primary" />
                </a>
              )}
              {youtube && (
                <a href={youtube} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary flex items-center justify-center transition-colors">
                  <Youtube className="w-5 h-5 text-secondary hover:text-primary" />
                </a>
              )}
              {/* Fallback icons when no settings yet */}
              {!facebook && !twitter && !instagram && !linkedin && !youtube && (
                <>
                  <span className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Facebook className="w-5 h-5 text-secondary/40" />
                  </span>
                  <span className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Twitter className="w-5 h-5 text-secondary/40" />
                  </span>
                  <span className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-secondary/40" />
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary pb-2">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-white/80 hover:text-secondary transition-colors text-sm text-right w-full"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Insurance Types (dynamic) */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary pb-2">
              {t("footer.insuranceTypes")}
            </h3>
            <ul className="space-y-2">
              {insuranceTypes.length > 0 ? (
                insuranceTypes.map((type) => (
                  <li key={type.id}>
                    <button
                      onClick={() => handleNavClick(`/insurance/${type.slug}`)}
                      className="text-white/80 hover:text-secondary transition-colors text-sm text-right w-full"
                    >
                      {isAr ? type.titleAr : type.titleEn}
                    </button>
                  </li>
                ))
              ) : (
                // Fallback static links
                [
                  { label: isAr ? "التأمين الصحي" : "Health Insurance", href: "/insurance/health" },
                  { label: isAr ? "تأمين السيارات" : "Car Insurance", href: "/insurance/car" },
                  { label: isAr ? "التأمين البحري" : "Marine Insurance", href: "/insurance/marine" },
                  { label: isAr ? "التأمين الهندسي" : "Engineering Insurance", href: "/insurance/engineering" },
                  { label: isAr ? "تأمين الطاقة" : "Energy Insurance", href: "/insurance/energy" },
                  { label: isAr ? "التأمين التكافلي" : "Takaful Insurance", href: "/insurance/takaful" },
                ].map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="text-white/80 hover:text-secondary transition-colors text-sm text-right w-full"
                    >
                      {link.label}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Column 4: Contact Info (dynamic) */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary pb-2">
              {t("footer.contactInfo")}
            </h3>
            <div className="space-y-3">
              {phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-secondary">{t("footer.phone")}</div>
                    <a href={`tel:${phone}`} dir="ltr" className="text-white/80 hover:text-secondary text-sm">
                      {phone}
                    </a>
                  </div>
                </div>
              )}
              {email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-secondary">{t("footer.email")}</div>
                    <a href={`mailto:${email}`} className="text-white/80 hover:text-secondary text-sm">
                      {email}
                    </a>
                  </div>
                </div>
              )}
              {address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-secondary">{t("footer.address")}</div>
                    <p className="text-white/80 text-sm">{address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container py-6 text-center">
          <p className="text-white/60 text-sm">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
