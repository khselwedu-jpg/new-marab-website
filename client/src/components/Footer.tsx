import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { key: "nav.home", href: "/" },
    { key: "nav.about.who", href: "/about/who-we-are" },
    { key: "nav.about.vision", href: "/about/vision" },
    { key: "nav.about.mission", href: "/about/mission" },
    { key: "nav.contact", href: "/contact" },
  ];

  const insuranceLinks = [
    { key: "insurance.health", href: "/insurance/health" },
    { key: "insurance.car", href: "/insurance/car" },
    { key: "insurance.marine", href: "/insurance/marine" },
    { key: "insurance.engineering", href: "/insurance/engineering" },
    { key: "insurance.energy", href: "/insurance/energy" },
    { key: "insurance.takaful", href: "/insurance/takaful" },
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo and Description */}
          <div className="space-y-4">
            <img
              src="/logo.jpg"
              alt="Mareb Insurance"
              className="h-20 w-auto object-contain mb-4"
            />
            <p className="text-white/80 text-sm leading-relaxed">
              {t("footer.aboutText")}
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-secondary hover:text-primary" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-secondary hover:text-primary" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-secondary hover:text-primary" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5 text-secondary hover:text-primary" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary pb-2">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-secondary transition-colors text-sm"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Insurance Types */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary pb-2">
              {t("footer.insuranceTypes")}
            </h3>
            <ul className="space-y-2">
              {insuranceLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-secondary transition-colors text-sm"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary pb-2">
              {t("footer.contactInfo")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-secondary">{t("footer.phone")}</div>
                  <a href="tel:+9671234567" className="text-white/80 hover:text-secondary text-sm">
                    +967 1 234 567
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-secondary">{t("footer.email")}</div>
                  <a
                    href="mailto:info@marebinsurance.com"
                    className="text-white/80 hover:text-secondary text-sm"
                  >
                    info@marebinsurance.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-secondary">{t("footer.address")}</div>
                  <p className="text-white/80 text-sm">
                    Sana'a, Yemen
                  </p>
                </div>
              </div>
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
