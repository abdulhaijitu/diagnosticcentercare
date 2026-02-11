import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const { data: testimonials, isLoading } = useTestimonials();
  const isBn = i18n.language === "bn";

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

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
                <Skeleton className="h-10 w-10 mb-4 bg-white/20" />
                <Skeleton className="h-4 w-24 mb-4 bg-white/20" />
                <Skeleton className="h-20 w-full mb-6 bg-white/20" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
                  <div>
                    <Skeleton className="h-4 w-28 mb-2 bg-white/20" />
                    <Skeleton className="h-3 w-20 bg-white/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials?.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
                <Quote className="h-10 w-10 text-care-amber mb-4 opacity-50" />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-care-amber text-care-amber" />
                  ))}
                </div>
                <p className="text-primary-foreground/90 leading-relaxed mb-6">
                  "{isBn && testimonial.text_bn ? testimonial.text_bn : testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  {testimonial.image_url ? (
                    <img
                      src={testimonial.image_url}
                      alt={isBn && testimonial.name_bn ? testimonial.name_bn : testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {(isBn && testimonial.name_bn ? testimonial.name_bn : testimonial.name)[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{isBn && testimonial.name_bn ? testimonial.name_bn : testimonial.name}</p>
                    <p className="text-sm text-primary-foreground/70">
                      {isBn && testimonial.location_bn ? testimonial.location_bn : testimonial.location}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-xs text-care-amber font-medium">
                    {isBn && testimonial.service_bn ? testimonial.service_bn : testimonial.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
