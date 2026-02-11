import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import trustCareTagline from "@/assets/your-trust-our-care.png";
import heroCard1 from "@/assets/hero-card-1.png";
import heroCard2 from "@/assets/hero-card-2.png";
import heroCard3 from "@/assets/hero-card-3.png";

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
    { image: heroCard1, label: t("hero.diagnosticService"), link: "/book-test" },
    { image: heroCard2, label: t("hero.doctorConsultation"), link: "/doctors" },
    { image: heroCard3, label: t("hero.homeCollection"), link: "/book-test" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
      </div>

      {/* Decorative blurs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-care-amber rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container-custom relative py-10 md:py-14 lg:py-16">
        {/* Tagline Image */}
        <div className="flex flex-col items-center mb-6 md:mb-8 animate-fade-in-up">
          <img
            src={trustCareTagline}
            alt="Your Trust, Our Care"
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-lg"
          />
          <div className="mt-3 h-1 w-48 sm:w-64 md:w-80 rounded-full bg-gradient-to-r from-care-amber via-primary-foreground/60 to-trust-teal-light" />
        </div>


        {/* Service Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-3 gap-3 md:gap-5 w-full max-w-3xl mx-auto mb-8 md:mb-10"
        >
          {serviceCards.map((card, index) => (
            <Link
              key={card.label}
              to={card.link}
              className={`group overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-elevated ${
                visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <img
                src={card.image}
                alt={card.label}
                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 md:mb-8 animate-fade-in-up animation-delay-200">
          <Button size="lg" variant="accent" className="shadow-lg text-base font-bold px-8" asChild>
            <Link to="/book-test">
              {t("hero.bookTest")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="hero-outline" className="shadow-lg border-2 text-base font-bold px-8 bg-white/20 backdrop-blur-md" asChild>
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
            <div key={feature.text} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md shadow-md">
              <feature.icon className="h-3.5 w-3.5 text-care-amber" />
              <span className="text-xs font-semibold text-white">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
