import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, LogIn, LogOut, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export function Navigation() {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [, navigate] = useLocation();

  // Fetch insurance types dynamically from DB
  const { data: insuranceTypesList = [] } = trpc.content.insuranceTypes.useQuery();

  // Fetch slugs of dynamic pages that have content
  const { data: pagesWithContent = [] } = trpc.content.pagesWithContentSlugs.useQuery();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper: check if a dynamic page slug has content
  const hasContent = (slug: string) => pagesWithContent.includes(slug);

  // About links - filter dynamic pages that have no content
  const aboutLinks = [
    { key: "nav.about.who", href: "/about/who-we-are", dynamic: false },
    { key: "nav.about.chairman", href: "/about/chairman", dynamic: true, slug: "chairman" },
    { key: "nav.about.vision", href: "/about/vision", dynamic: true, slug: "vision" },
    { key: "nav.about.mission", href: "/about/mission", dynamic: true, slug: "mission" },
    { key: "nav.about.goals", href: "/about/goals", dynamic: true, slug: "goals" },
    { key: "nav.about.structure", href: "/about/structure", dynamic: true, slug: "structure" },
    { key: "nav.about.branches", href: "/about/branches", dynamic: false },
    { key: "nav.about.team", href: "/about/team", dynamic: false },
    { key: "nav.about.privacy", href: "/about/privacy", dynamic: true, slug: "privacy" },
    { key: "nav.about.cookies", href: "/about/cookies", dynamic: true, slug: "cookies" },
  ].filter(link => !link.dynamic || hasContent(link.slug!));

  const partnerLinks = [
    { key: "partners.reinsurers", href: "/partners/reinsurers" },
    { key: "partners.brokers", href: "/partners/brokers" },
    { key: "partners.success", href: "/partners/success" },
  ];

  const mediaLinks = [
    { key: "media.photos", href: "/media/photos" },
    { key: "media.videos", href: "/media/videos" },
    { key: "media.conferences", href: "/media/conferences" },
    { key: "media.events", href: "/media/events" },
    { key: "media.news", href: "/media/news" },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-primary shadow-lg" : "bg-primary"
      }`}
      style={{ height: "90px" }}
    >
      <div className="container h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })} className="flex items-center">
          <img
            src="/logo.jpg"
            alt="Mareb Insurance"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-white hover:text-secondary transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>
            {t("nav.home")}
          </Link>

          {/* About Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setOpenDropdown("about")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="text-white hover:text-secondary transition-colors flex items-center gap-1">
              {t("nav.about")}
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "about" && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-4 px-2 min-w-[280px] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="border-b-2 border-secondary pb-2 mb-2">
                  <h3 className="text-primary font-semibold px-4">{t("nav.about")}</h3>
                </div>
                {aboutLinks.map((link) => (
                  <button
                    key={link.key}
                    onClick={() => handleNavClick(link.href)}
                    className="block w-full text-right px-4 py-2 text-primary hover:text-secondary hover:bg-muted rounded transition-colors"
                  >
                    {t(link.key)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Insurance Dropdown - Dynamic from DB */}
          <div
            className="relative group"
            onMouseEnter={() => setOpenDropdown("insurance")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="text-white hover:text-secondary transition-colors flex items-center gap-1">
              {t("nav.insurance")}
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "insurance" && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-4 px-2 min-w-[320px] grid grid-cols-2 gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="col-span-2 border-b-2 border-secondary pb-2 mb-2">
                  <h3 className="text-primary font-semibold px-4">{t("nav.insurance")}</h3>
                </div>
                {insuranceTypesList.length > 0 ? (
                  insuranceTypesList.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleNavClick(`/insurance/${type.slug}`)}
                      className="px-4 py-2 text-primary hover:text-secondary hover:bg-muted rounded transition-colors flex items-center gap-2 text-sm text-right"
                    >
                      <span className="text-secondary flex-shrink-0">●</span>
                      {language === "ar" ? type.titleAr : type.titleEn}
                    </button>
                  ))
                ) : (
                  // Fallback while loading
                  <div className="col-span-2 px-4 py-2 text-muted-foreground text-sm">
                    {language === "ar" ? "جاري التحميل..." : "Loading..."}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Partners Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setOpenDropdown("partners")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="text-white hover:text-secondary transition-colors flex items-center gap-1">
              {t("nav.partners")}
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "partners" && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-4 px-2 min-w-[250px] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="border-b-2 border-secondary pb-2 mb-2">
                  <h3 className="text-primary font-semibold px-4">{t("nav.partners")}</h3>
                </div>
                {partnerLinks.map((link) => (
                  <button
                    key={link.key}
                    onClick={() => handleNavClick(link.href)}
                    className="block w-full text-right px-4 py-2 text-primary hover:text-secondary hover:bg-muted rounded transition-colors"
                  >
                    {t(link.key)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Media Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setOpenDropdown("media")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="text-white hover:text-secondary transition-colors flex items-center gap-1">
              {t("nav.media")}
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "media" && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-4 px-2 min-w-[280px] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="border-b-2 border-secondary pb-2 mb-2">
                  <h3 className="text-primary font-semibold px-4">{t("nav.media")}</h3>
                </div>
                {mediaLinks.map((link) => (
                  <button
                    key={link.key}
                    onClick={() => handleNavClick(link.href)}
                    className="block w-full text-right px-4 py-2 text-primary hover:text-secondary hover:bg-muted rounded transition-colors"
                  >
                    {t(link.key)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick("/contact")}
            className="text-white hover:text-secondary transition-colors"
          >
            {t("nav.contact")}
          </button>

          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="bg-transparent border-white text-white hover:bg-secondary hover:text-primary hover:border-secondary"
          >
            {language === "ar" ? "EN" : "AR"}
          </Button>

          {/* Login/User Button */}
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button size="sm" className="bg-secondary text-primary hover:bg-secondary/90 font-semibold">
                    <User className="w-4 h-4 mr-1" />
                    {language === "ar" ? "لوحة الإدارة" : "Admin Panel"}
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="bg-transparent border-white text-white hover:bg-red-500 hover:border-red-500"
              >
                <LogOut className="w-4 h-4 mr-1" />
                {language === "ar" ? "خروج" : "Logout"}
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-secondary text-primary hover:bg-secondary/90 font-semibold"
            >
              <LogIn className="w-4 h-4 mr-1" />
              {language === "ar" ? "تسجيل الدخول" : "Login"}
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-primary border-t border-white/10 max-h-[calc(100vh-90px)] overflow-y-auto">
          <div className="container py-4 space-y-4">
            <button
              className="block w-full text-right text-white hover:text-secondary py-2"
              onClick={() => handleNavClick("/")}
            >
              {t("nav.home")}
            </button>

            <div className="space-y-2">
              <div className="text-secondary font-semibold">{t("nav.about")}</div>
              {aboutLinks.map((link) => (
                <button
                  key={link.key}
                  className="block w-full text-right text-white hover:text-secondary py-1 pl-4"
                  onClick={() => handleNavClick(link.href)}
                >
                  {t(link.key)}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="text-secondary font-semibold">{t("nav.insurance")}</div>
              {insuranceTypesList.map((type) => (
                <button
                  key={type.id}
                  className="block w-full text-right text-white hover:text-secondary py-1 pl-4 text-sm"
                  onClick={() => handleNavClick(`/insurance/${type.slug}`)}
                >
                  {language === "ar" ? type.titleAr : type.titleEn}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="text-secondary font-semibold">{t("nav.partners")}</div>
              {partnerLinks.map((link) => (
                <button
                  key={link.key}
                  className="block w-full text-right text-white hover:text-secondary py-1 pl-4"
                  onClick={() => handleNavClick(link.href)}
                >
                  {t(link.key)}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="text-secondary font-semibold">{t("nav.media")}</div>
              {mediaLinks.map((link) => (
                <button
                  key={link.key}
                  className="block w-full text-right text-white hover:text-secondary py-1 pl-4"
                  onClick={() => handleNavClick(link.href)}
                >
                  {t(link.key)}
                </button>
              ))}
            </div>

            <button
              className="block w-full text-right text-white hover:text-secondary py-2"
              onClick={() => handleNavClick("/contact")}
            >
              {t("nav.contact")}
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="bg-transparent border-white text-white hover:bg-secondary hover:text-primary hover:border-secondary w-full"
            >
              {language === "ar" ? "English" : "العربية"}
            </Button>

            {/* Mobile Login/Logout */}
            {user ? (
              <div className="space-y-2">
                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="bg-secondary text-primary hover:bg-secondary/90 font-semibold w-full">
                      <User className="w-4 h-4 mr-1" />
                      {language === "ar" ? "لوحة الإدارة" : "Admin Panel"}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="bg-transparent border-white text-white hover:bg-red-500 hover:border-red-500 w-full"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  {language === "ar" ? "خروج" : "Logout"}
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-secondary text-primary hover:bg-secondary/90 font-semibold w-full"
              >
                <LogIn className="w-4 h-4 mr-1" />
                {language === "ar" ? "تسجيل الدخول" : "Login"}
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
