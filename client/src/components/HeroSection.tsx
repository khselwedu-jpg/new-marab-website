import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const FALLBACK_SLIDES = [
  {
    id: 0,
    titleAr: "شركة مأرب للتأمين",
    titleEn: "Mareb Insurance Company",
    subtitleAr: "نحمي مستقبلك بأفضل الحلول التأمينية",
    subtitleEn: "Protecting your future with the best insurance solutions",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663249456574/9MB65zStTYVQDwrWb5myAt/hero1_d838ccf7.webp",
    ctaTextAr: "تواصل معنا",
    ctaTextEn: "Contact Us",
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
    subtitleAr: "خبرة تزيد عن 15 عاماً في مجال التأمين",
    subtitleEn: "Over 15 years of experience in the insurance industry",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663249456574/9MB65zStTYVQDwrWb5myAt/hero2_f9cd545d.webp",
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

  const { data: slidesData } = trpc.content.heroSlides.useQuery();
  const slides = (slidesData && slidesData.length > 0) ? slidesData : FALLBACK_SLIDES;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const current = slides[currentSlide];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Image Slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={isAr ? slide.titleAr : slide.titleEn}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "low"}
              width="1920"
              height="1080"
            />
            <div className="absolute inset-0 bg-primary/70" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container text-center text-white space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isAr ? current.titleAr : current.titleEn}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            {isAr ? current.subtitleAr : (current.subtitleEn || "")}
          </p>
          {current.ctaLink && (current.ctaTextAr || current.ctaTextEn) && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
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
