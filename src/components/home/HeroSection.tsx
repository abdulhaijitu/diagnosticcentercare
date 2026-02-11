import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserCheck, Home, ClipboardList, Shield, Clock, Award } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  const { t } = useTranslation();
  const cardsRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
      label: t("hero.homeCollection"),
      link: "/book-test",
    },
  ];

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-5rem)]">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/80 to-primary/90" />
      </div>

      {/* Decorative blurs */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-care-amber rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container-custom relative py-14 md:py-20 lg:py-24 flex flex-col items-center">
        {/* Service Cards — Top */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mb-14 md:mb-16"
        >
          {serviceCards.map((card, index) => (
            <Link
              key={card.label}
              to={card.link}
              className={`group relative bg-white/12 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center transition-all duration-500 hover:bg-white/20 hover:-translate-y-1.5 hover:shadow-elevated ${
                visibleCards[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300">
                <card.icon className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-base md:text-lg font-bold text-primary-foreground leading-snug">
                {card.label}
              </h3>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="h-4 w-4 text-care-amber" />
              </div>
            </Link>
          ))}
        </div>

        {/* Divider line */}
        <div className="w-24 h-0.5 bg-care-amber/50 rounded-full mb-10 md:mb-12 animate-fade-in-up animation-delay-200" />

        {/* Tagline & Text — Below */}
        <div className="text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Shield className="h-4 w-4 text-care-amber" />
            <span className="text-sm font-medium text-primary-foreground">{t("hero.trustBadge")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-5">
            {t("hero.title")}{" "}
            <span className="text-care-amber drop-shadow-md">{t("hero.titleHighlight")}</span>
          </h1>

          <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed mb-8 animate-fade-in-up animation-delay-100">
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

          {/* Trust badges */}
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
      </div>
    </section>
  );
}
