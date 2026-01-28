import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Award, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Shield, text: "Trusted Results" },
  { icon: Clock, text: "Quick Reports" },
  { icon: Award, text: "Expert Doctors" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-trust-teal-light">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)] py-16 lg:py-24">
          {/* Content */}
          <div className="text-primary-foreground order-2 lg:order-1">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in-up">
              <CheckCircle2 className="h-4 w-4 text-care-amber" />
              <span className="text-sm font-medium">Trusted by 10,000+ Patients</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-display-lg font-bold leading-tight mb-6 animate-fade-in-up animation-delay-100">
              Your Trust,{" "}
              <span className="text-care-amber">Your Care</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-xl animate-fade-in-up animation-delay-200">
              Fast & accurate lab services with compassionate care. Book diagnostic tests, 
              consult with expert doctors, and get your results delivered to your doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-in-up animation-delay-300">
              <Button size="xl" variant="accent" asChild>
                <Link to="/book-test">
                  Book a Test
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="hero-outline" asChild>
                <Link to="/doctors">Find a Doctor</Link>
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              {features.map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  <feature.icon className="h-4 w-4 text-care-amber" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in animation-delay-200">
            <div className="relative">
              {/* Main Card */}
              <div className="w-full max-w-md bg-card rounded-3xl shadow-elevated p-8 text-foreground">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Quick Lab Booking</h3>
                  <p className="text-muted-foreground text-sm">Get your test done in 3 easy steps</p>
                </div>

                <div className="space-y-4">
                  {["Choose Your Test", "Pick Date & Time", "Get Results Fast"].map((step, index) => (
                    <div key={step} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium">{step}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-6" size="lg" asChild>
                  <Link to="/book-test">
                    Start Booking
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-card p-4 text-foreground animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">99%</p>
                    <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
