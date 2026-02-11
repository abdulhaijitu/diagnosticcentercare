import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  images: string[];
  children?: React.ReactNode;
  variant?: "gradient" | "light";
}

export function PageHero({ badge, title, subtitle, images, children, variant = "gradient" }: PageHeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const isGradient = variant === "gradient";

  return (
    <section
      ref={ref}
      className={cn(
        "relative overflow-hidden py-16 md:py-24",
        isGradient ? "bg-gradient-hero text-white" : "bg-gradient-to-br from-primary/10 via-background to-accent/10"
      )}
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <div
            className={cn(
              "transition-all duration-700 ease-out",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            )}
          >
            {badge && (
              <span
                className={cn(
                  "inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4",
                  isGradient ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                )}
              >
                {badge}
              </span>
            )}
            <h1
              className={cn(
                "text-display-sm md:text-display-lg font-bold mb-6",
                isGradient ? "text-white" : "text-foreground"
              )}
            >
              {title}
            </h1>
            <p
              className={cn(
                "text-lg md:text-xl leading-relaxed mb-8",
                isGradient ? "text-white/80" : "text-muted-foreground"
              )}
            >
              {subtitle}
            </p>
            {children}
          </div>

          {/* Right: Image Grid */}
          <div className="relative hidden md:block">
            {images.length === 1 && (
              <div
                className={cn(
                  "rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 delay-200 ease-out",
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                )}
              >
                <img src={images[0]} alt="" className="w-full h-[400px] object-cover" loading="eager" />
              </div>
            )}
            {images.length >= 2 && (
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={cn(
                    "rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 delay-200 ease-out",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  )}
                >
                  <img src={images[0]} alt="" className="w-full h-[280px] object-cover" loading="eager" />
                </div>
                <div
                  className={cn(
                    "rounded-2xl overflow-hidden shadow-2xl mt-8 transition-all duration-700 delay-[400ms] ease-out",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  )}
                >
                  <img src={images[1]} alt="" className="w-full h-[280px] object-cover" loading="eager" />
                </div>
                {images[2] && (
                  <div
                    className={cn(
                      "col-span-2 rounded-2xl overflow-hidden shadow-2xl -mt-4 transition-all duration-700 delay-[600ms] ease-out",
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    )}
                  >
                    <img src={images[2]} alt="" className="w-full h-[180px] object-cover" loading="eager" />
                  </div>
                )}
              </div>
            )}

            {/* Decorative elements */}
            <div className={cn(
              "absolute -z-10 -top-6 -right-6 w-32 h-32 rounded-full transition-all duration-1000 delay-300",
              isGradient ? "bg-white/10" : "bg-primary/10",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )} />
            <div className={cn(
              "absolute -z-10 -bottom-4 -left-4 w-24 h-24 rounded-full transition-all duration-1000 delay-500",
              isGradient ? "bg-white/10" : "bg-accent/10",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )} />
          </div>
        </div>
      </div>
    </section>
  );
}
