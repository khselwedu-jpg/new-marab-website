import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState, useRef } from "react";
import { trpc } from "@/lib/trpc";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function Counter({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-bold text-secondary">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

const FALLBACK_STATS = [
  { id: 1, value: 25000, suffix: "+", prefix: "", labelAr: "عميل", labelEn: "Clients", displayOrder: 0, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, value: 60, suffix: "+", prefix: "", labelAr: "شريك", labelEn: "Partners", displayOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, value: 15, suffix: "+", prefix: "", labelAr: "عام خبرة", labelEn: "Years Experience", displayOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, value: 98, suffix: "%", prefix: "", labelAr: "رضا العملاء", labelEn: "Client Satisfaction", displayOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

export function StatisticsSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const { data } = trpc.content.statistics.useQuery();
  const stats = (data && data.length > 0) ? data : FALLBACK_STATS;

  return (
    <section className="py-20 bg-muted">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Counter end={stat.value} suffix={stat.suffix || ""} prefix={stat.prefix || ""} />
              <p className="text-lg font-semibold text-primary">
                {isAr ? stat.labelAr : stat.labelEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
