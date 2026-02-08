import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = [
    { id: 1, name: t("testimonials.t1Name"), location: t("testimonials.t1Location"), rating: 5, text: t("testimonials.t1Text"), service: t("testimonials.t1Service") },
    { id: 2, name: t("testimonials.t2Name"), location: t("testimonials.t2Location"), rating: 5, text: t("testimonials.t2Text"), service: t("testimonials.t2Service") },
    { id: 3, name: t("testimonials.t3Name"), location: t("testimonials.t3Location"), rating: 5, text: t("testimonials.t3Text"), service: t("testimonials.t3Service") },
  ];

  return (
    <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-white rounded-full blur-3xl" />
      </div>
      <div className="container-custom relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-4">
            {t("testimonials.badge")}
          </span>
          <h2 className="text-display-sm md:text-display-md font-bold mb-4">{t("testimonials.title")}</h2>
          <p className="text-primary-foreground/80 text-lg">{t("testimonials.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
              <Quote className="h-10 w-10 text-care-amber mb-4 opacity-50" />
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-care-amber text-care-amber" />
                ))}
              </div>
              <p className="text-primary-foreground/90 leading-relaxed mb-6">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg font-bold">{testimonial.name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-primary-foreground/70">{testimonial.location}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-xs text-care-amber font-medium">{testimonial.service}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
