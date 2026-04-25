import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.about": "عن الشركة",
    "nav.insurance": "أنواع التأمين",
    "nav.partners": "الشركاء",
    "nav.media": "المركز الإعلامي",
    "nav.contact": "تواصل معنا",
    
    // About submenu
    "nav.about.who": "من نحن",
    "nav.about.chairman": "رئيس مجلس الإدارة",
    "nav.about.vision": "الرؤية",
    "nav.about.mission": "الرسالة",
    "nav.about.goals": "الأهداف",
    "nav.about.structure": "الهيكل التنظيمي",
    "nav.about.branches": "فروع الشركة",
    "nav.about.team": "فريق العمل",
    "nav.about.privacy": "سياسة الخصوصية",
    "nav.about.cookies": "سياسة ملفات تعريف الارتباط",
    
    // Insurance types
    "insurance.health": "التأمين الصحي",
    "insurance.car": "تأمين السيارات",
    "insurance.marine": "التأمين البحري",
    "insurance.engineering": "التأمين الهندسي",
    "insurance.energy": "تأمين الطاقة",
    "insurance.takaful": "التأمين التكافلي الإسلامي",
    
    // Partners
    "partners.reinsurers": "معيدي التأمين",
    "partners.brokers": "وسطاء التأمين",
    "partners.success": "شركاء النجاح",
    "partners.shareholders": "المساهمون",
    "partners.shareholdersTitle": "المساهمون والشركاء",
    "partners.shareholdersSubtitle": "الشركاء المؤسسون لشركة مأرب اليمنية للتأمين",
    
    // Media Center
    "media.photos": "معرض الصور",
    "media.videos": "معرض الفيديو",
    "media.conferences": "المؤتمرات والمشاركات",
    "media.events": "الفعاليات",
    "media.news": "الأخبار",
    
    // Hero Section
    "hero.title": "حصن الأمان والضمان",
    "hero.subtitle": "نحن نوفر لك أفضل حلول التأمين الشاملة لحماية مستقبلك وأعمالك",
    "hero.cta": "احصل على عرض تأمين",
    
    // About Section
    "about.title": "نبذة عن الشركة",
    "about.description": "شركة مأرب اليمنية للتأمين هي إحدى الشركات الرائدة في مجال التأمين باليمن، نقدم خدمات تأمينية متنوعة ومتكاملة تلبي احتياجات عملائنا من الأفراد والشركات.",
    "about.cta": "تعرف علينا",
    
    // Why Us Section
    "why.title": "لماذا نحن؟",
    "why.experience.title": "خبرة واسعة",
    "why.experience.desc": "أكثر من 15 عاماً من الخبرة في مجال التأمين",
    "why.trust.title": "ثقة وأمان",
    "why.trust.desc": "نحن نضع ثقة عملائنا في المقام الأول",
    "why.coverage.title": "تغطية شاملة",
    "why.coverage.desc": "حلول تأمينية متنوعة تناسب جميع الاحتياجات",
    "why.support.title": "دعم متواصل",
    "why.support.desc": "فريق دعم متاح على مدار الساعة",
    
    // Insurance Types Section
    "insurance.title": "أنواع التأمين",
    "insurance.subtitle": "نقدم مجموعة متنوعة من خدمات التأمين",
    "insurance.viewDetails": "عرض التفاصيل",
    
    // Statistics Section
    "stats.clients": "عميل",
    "stats.partners": "شريك",
    "stats.experience": "سنة خبرة",
    "stats.satisfaction": "رضا العملاء",
    
    // Partners Section
    "partners.title": "شركاؤنا",
    "partners.subtitle": "نفخر بشراكاتنا مع أفضل الشركات",
    "partners.viewMore": "عرض المزيد",
    
    // Branches Section
    "branches.title": "فروعنا",
    "branches.viewLocation": "عرض الموقع",
    
    // News Section
    "news.title": "آخر الأخبار والفعاليات",
    "news.readMore": "قراءة المزيد",
    
    // Footer
    "footer.about": "نبذة عن الشركة",
    "footer.aboutText": "شركة مأرب اليمنية للتأمين هي إحدى الشركات الرائدة في مجال التأمين باليمن",
    "footer.quickLinks": "روابط سريعة",
    "footer.insuranceTypes": "أنواع التأمين",
    "footer.contactInfo": "معلومات التواصل",
    "footer.phone": "الهاتف",
    "footer.email": "البريد الإلكتروني",
    "footer.address": "العنوان",
    "footer.copyright": "© 2026 جميع الحقوق محفوظة لدى شركة مأرب للتأمين",
    
    // Contact Form
    "contact.title": "تواصل معنا",
    "contact.name": "الاسم",
    "contact.email": "البريد الإلكتروني",
    "contact.phone": "الهاتف",
    "contact.subject": "الموضوع",
    "contact.messageType": "نوع الرسالة",
    "contact.message": "نص الرسالة",
    "contact.send": "إرسال",
    "contact.success": "تم إرسال رسالتك بنجاح",
    "contact.error": "حدث خطأ، يرجى المحاولة مرة أخرى",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.insurance": "Insurance Types",
    "nav.partners": "Partners",
    "nav.media": "Media Center",
    "nav.contact": "Contact Us",
    
    // About submenu
    "nav.about.who": "Who We Are",
    "nav.about.chairman": "Chairman of the Board",
    "nav.about.vision": "Vision",
    "nav.about.mission": "Mission",
    "nav.about.goals": "Goals",
    "nav.about.structure": "Organizational Structure",
    "nav.about.branches": "Our Branches",
    "nav.about.team": "Our Team",
    "nav.about.privacy": "Privacy Policy",
    "nav.about.cookies": "Cookie Policy",
    
    // Insurance types
    "insurance.health": "Health Insurance",
    "insurance.car": "Car Insurance",
    "insurance.marine": "Marine Insurance",
    "insurance.engineering": "Engineering Insurance",
    "insurance.energy": "Energy Insurance",
    "insurance.takaful": "Islamic Takaful Insurance",
    
    // Partners
    "partners.reinsurers": "Reinsurers",
    "partners.brokers": "Insurance Brokers",
    "partners.success": "Success Partners",
    "partners.shareholders": "Shareholders",
    "partners.shareholdersTitle": "Shareholders & Partners",
    "partners.shareholdersSubtitle": "Founding partners of Mareb Yemeni Insurance Company",
    
    // Media Center
    "media.photos": "Photo Gallery",
    "media.videos": "Video Gallery",
    "media.conferences": "Conferences & Participations",
    "media.events": "Events",
    "media.news": "News",
    
    // Hero Section
    "hero.title": "Fortress of Safety and Security",
    "hero.subtitle": "We provide you with the best comprehensive insurance solutions to protect your future and business",
    "hero.cta": "Get Insurance Quote",
    
    // About Section
    "about.title": "About the Company",
    "about.description": "Mareb Insurance Company is one of the leading insurance companies in Yemen, offering diverse and comprehensive insurance services that meet the needs of our individual and corporate clients.",
    "about.cta": "Learn More",
    
    // Why Us Section
    "why.title": "Why Choose Us?",
    "why.experience.title": "Extensive Experience",
    "why.experience.desc": "Over 15 years of experience in the insurance industry",
    "why.trust.title": "Trust and Security",
    "why.trust.desc": "We put our clients' trust first",
    "why.coverage.title": "Comprehensive Coverage",
    "why.coverage.desc": "Diverse insurance solutions for all needs",
    "why.support.title": "Continuous Support",
    "why.support.desc": "Support team available 24/7",
    
    // Insurance Types Section
    "insurance.title": "Insurance Types",
    "insurance.subtitle": "We offer a variety of insurance services",
    "insurance.viewDetails": "View Details",
    
    // Statistics Section
    "stats.clients": "Clients",
    "stats.partners": "Partners",
    "stats.experience": "Years Experience",
    "stats.satisfaction": "Client Satisfaction",
    
    // Partners Section
    "partners.title": "Our Partners",
    "partners.subtitle": "We are proud of our partnerships with the best companies",
    "partners.viewMore": "View More",
    
    // Branches Section
    "branches.title": "Our Branches",
    "branches.viewLocation": "View Location",
    
    // News Section
    "news.title": "Latest News and Events",
    "news.readMore": "Read More",
    
    // Footer
    "footer.about": "About the Company",
    "footer.aboutText": "Mareb Insurance Company is one of the leading insurance companies in Yemen",
    "footer.quickLinks": "Quick Links",
    "footer.insuranceTypes": "Insurance Types",
    "footer.contactInfo": "Contact Information",
    "footer.phone": "Phone",
    "footer.email": "Email",
    "footer.address": "Address",
    "footer.copyright": "© 2026 All Rights Reserved - Mareb Insurance Company",
    
    // Contact Form
    "contact.title": "Contact Us",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.subject": "Subject",
    "contact.messageType": "Message Type",
    "contact.message": "Message",
    "contact.send": "Send",
    "contact.success": "Your message has been sent successfully",
    "contact.error": "An error occurred, please try again",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved === "ar" || saved === "en") ? saved : "ar";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "ar" ? "en" : "ar");
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
