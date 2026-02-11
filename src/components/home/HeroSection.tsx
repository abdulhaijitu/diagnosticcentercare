import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Stethoscope, UserCheck, Home, ClipboardList, Shield, Clock, Award } from "lucide-react";

export function HeroSection() {
  const { t } = useTranslation();
  const cardsRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger each card with 150ms delay
          [0, 1, 2].forEach((i) => {
            setTimeout(() => {
              setVisibleCards((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 150);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (cardsRef.current) observer.observe(cardsRef.current);
    return () => observer.disconnect();
  }, []);

  const serviceCards = [
    {
      icon: ClipboardList,
      secondaryIcon: Stethoscope,
      label: t("hero.diagnosticService"),
      link: "/book-test",
    },
    {
      icon: UserCheck,
      label: t("hero.doctorConsultation"),
      link: "/doctors",
    },
    {
      icon: Home,
      secondaryIcon: Stethoscope,
      label: t("hero.homeCollection"),
      link: "/book-test",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-trust-teal-light">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container-custom relative py-16 md:py-24 lg:py-28">
        {/* Top Section - Tagline */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Shield className="h-4 w-4 text-care-amber" />
            <span className="text-sm font-medium text-primary-foreground">{t("hero.trustBadge")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            {t("hero.title")}{" "}
            <span className="text-care-amber drop-shadow-md">{t("hero.titleHighlight")}</span>
          </h1>

          <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up animation-delay-100">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up animation-delay-200">
            <Button size="xl" variant="accent" asChild>
              <Link to="/book-test">
                {t("hero.bookTest")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="hero-outline" asChild>
              <Link to="/doctors">{t("hero.findDoctor")}</Link>
            </Button>
          </div>

          {/* Trust badges row */}
          <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up animation-delay-300">
            {[
              { icon: Shield, text: t("hero.trustedResults") },
              { icon: Clock, text: t("hero.quickReports") },
              { icon: Award, text: t("hero.expertDoctors") },
            ].map((feature) => (
              <div key={feature.text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <feature.icon className="h-4 w-4 text-care-amber" />
                <span className="text-sm font-medium text-primary-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Cards - Staggered fade-in on scroll */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8 max-w-4xl mx-auto">
          {serviceCards.map((card, index) => (
            <Link
              key={card.label}
              to={card.link}
              className={`group relative bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center transition-all duration-500 hover:bg-white/25 hover:-translate-y-2 hover:shadow-elevated ${
                visibleCards[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: visibleCards[index] ? "0ms" : `${index * 150}ms` }}
            >
              {/* Icon container */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <card.icon className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground" strokeWidth={1.5} />
              </div>

              {/* Label */}
              <h3 className="text-lg md:text-xl font-bold text-primary-foreground leading-snug">
                {card.label}
              </h3>

              {/* Hover arrow */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="h-5 w-5 text-care-amber" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
