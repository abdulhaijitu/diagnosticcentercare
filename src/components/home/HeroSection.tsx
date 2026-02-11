import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserCheck, Home, ClipboardList, Shield, Clock, Award } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import trustCareTagline from "@/assets/your-trust-our-care.png";

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
    { icon: ClipboardList, label: t("hero.diagnosticService"), link: "/book-test" },
    { icon: UserCheck, label: t("hero.doctorConsultation"), link: "/doctors" },
    { icon: Home, label: t("hero.homeCollection"), link: "/book-test" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/88 via-primary/82 to-primary/92" />
      </div>

      {/* Decorative blurs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-care-amber rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container-custom relative py-10 md:py-14 lg:py-16">
        {/* Tagline Image */}
        <div className="flex justify-center mb-6 md:mb-8 animate-fade-in-up">
          <img
            src={trustCareTagline}
            alt="Your Trust, Our Care"
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* Subtitle */}
        <p className="text-center text-sm md:text-base text-primary-foreground/75 max-w-xl mx-auto leading-relaxed mb-8 md:mb-10 animate-fade-in-up animation-delay-100">
          {t("hero.subtitle")}
        </p>

        {/* Service Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-3 gap-3 md:gap-5 w-full max-w-3xl mx-auto mb-8 md:mb-10"
        >
          {serviceCards.map((card, index) => (
            <Link
              key={card.label}
              to={card.link}
              className={`group bg-white/12 backdrop-blur-lg border border-white/20 rounded-2xl p-4 md:p-6 flex flex-col items-center text-center transition-all duration-500 hover:bg-white/20 hover:-translate-y-1 hover:shadow-elevated ${
                visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300">
                <card.icon className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-primary-foreground leading-tight">
                {card.label}
              </h3>
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 md:mb-8 animate-fade-in-up animation-delay-200">
          <Button size="lg" variant="accent" asChild>
            <Link to="/book-test">
              {t("hero.bookTest")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="hero-outline" asChild>
            <Link to="/doctors">{t("hero.findDoctor")}</Link>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-2 justify-center animate-fade-in-up animation-delay-300">
          {[
            { icon: Shield, text: t("hero.trustedResults") },
            { icon: Clock, text: t("hero.quickReports") },
            { icon: Award, text: t("hero.expertDoctors") },
          ].map((feature) => (
            <div key={feature.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
              <feature.icon className="h-3.5 w-3.5 text-care-amber" />
              <span className="text-xs font-medium text-primary-foreground">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
