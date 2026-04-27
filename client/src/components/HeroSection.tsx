import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

// CDN URLs for optimized images
const HERO_IMAGES = {
  desktop: "https://d2xsxph8kpxj0f.cloudfront.net/310519663249456574/9MB65zStTYVQDwrWb5myAt/hero1_d838ccf7.webp",
  mobile: "https://d2xsxph8kpxj0f.cloudfront.net/310519663249456574/9MB65zStTYVQDwrWb5myAt/hero1-mobile_4b23656d.webp",
  lqip: "https://d2xsxph8kpxj0f.cloudfront.net/310519663249456574/9MB65zStTYVQDwrWb5myAt/hero1-lqip_c7f8d178.webp",
  desktop2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663249456574/9MB65zStTYVQDwrWb5myAt/hero2_f9cd545d.webp",
};

const FALLBACK_SLIDES = [
  {
    id: 0,
    titleAr: "شركة مأرب للتأمين منذ عام 1974",
    titleEn: "Mareb Insurance Company Since 1974",
    subtitleAr: "أول شركة مساهمة يمنية للتأمين — نحمي أصولكم وممتلكاتكم وأعمالكم بأفضل الحلول التأمينية المدعومة بشبكة من معيدي التأمين العالميين",
    subtitleEn: "Yemen's first joint-stock insurance company — protecting your assets with world-class reinsurance networks",
    imageUrl: HERO_IMAGES.desktop,
    mobileImageUrl: HERO_IMAGES.mobile,
    ctaTextAr: "احصل على عرض تأمين",
    ctaTextEn: "Get Insurance Quote",
    ctaLink: "/contact",
    displayOrder: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 1,
    titleAr: "تأمين شامل لجميع احتياجاتك",
    titleEn: "Comprehensive Insurance for All Your Needs",
    subtitleAr: "خبرة تزيد عن 50 عاماً في مجال التأمين",
    subtitleEn: "Over 50 years of experience in the insurance industry",
    imageUrl: HERO_IMAGES.desktop2,
    mobileImageUrl: HERO_IMAGES.desktop2,
    ctaTextAr: "خدماتنا",
    ctaTextEn: "Our Services",
    ctaLink: "/insurance",
    displayOrder: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function HeroSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: slidesData } = trpc.content.heroSlides.useQuery();
  const slides = (slidesData && slidesData.length > 0) ? slidesData : FALLBACK_SLIDES;

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [slides.length]);

  const nextSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background: instant CSS gradient shown while image loads */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0A1F3D 0%, #1a3a6b 50%, #0d2a50 100%)",
        }}
      />

      {/* Hero images with blur-up technique */}
      {slides.map((slide, index) => {
        const isFirst = index === 0;
        const imgSrc = (slide as typeof FALLBACK_SLIDES[0]).mobileImageUrl || slide.imageUrl;
        return (
          <div
            key={slide.id}
            className="absolute inset-0"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              transition: "opacity 800ms ease-in-out",
              zIndex: index === currentSlide ? 1 : 0,
            }}
          >
            {/* LQIP blur placeholder - only for first slide */}
            {isFirst && !imgLoaded && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${HERO_IMAGES.lqip})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(20px)",
                  transform: "scale(1.1)",
                }}
              />
            )}
            {/* Actual image with responsive srcset */}
            <img
              src={slide.imageUrl}
              srcSet={`${imgSrc} 640w, ${slide.imageUrl} 1280w`}
              sizes="100vw"
              alt={isAr ? slide.titleAr : slide.titleEn}
              className="w-full h-full object-cover"
              loading={isFirst ? "eager" : "lazy"}
              fetchPriority={isFirst ? "high" : "auto"}
              decoding={isFirst ? "sync" : "async"}
              width="1280"
              height="720"
              onLoad={() => { if (isFirst) setImgLoaded(true); }}
            />
            <div className="absolute inset-0 bg-primary/65" />
          </div>
        );
      })}

      {/* Content */}
      <div className="relative h-full flex items-center justify-center" style={{ zIndex: 2 }}>
        <div className="container text-center text-white space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {isAr ? current.titleAr : current.titleEn}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
            {isAr ? current.subtitleAr : (current.subtitleEn || "")}
          </p>
          {current.ctaLink && (current.ctaTextAr || current.ctaTextEn) && (
            <div>
              <Link href={current.ctaLink}>
                <Button
                  size="lg"
                  className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  {isAr ? current.ctaTextAr : (current.ctaTextEn || current.ctaTextAr)}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-secondary w-8" : "w-3 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
