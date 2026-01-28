import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FlaskConical, Stethoscope, Home, ArrowRight, Clock, Shield, CheckCircle2 } from "lucide-react";

const services = [
  {
    icon: FlaskConical,
    title: "Diagnostic Tests",
    description: "Comprehensive range of blood tests, imaging, and pathology services with accurate results.",
    features: ["100+ Tests Available", "Same Day Reports", "NABL Accredited"],
    href: "/services#diagnostic",
    color: "bg-primary",
  },
  {
    icon: Stethoscope,
    title: "Doctor Consultation",
    description: "Expert consultations with experienced specialists across multiple medical disciplines.",
    features: ["20+ Specialists", "Flexible Scheduling", "Follow-up Support"],
    href: "/services#consultation",
    color: "bg-care-amber",
  },
  {
    icon: Home,
    title: "Home Sample Collection",
    description: "Convenient sample collection at your doorstep by trained phlebotomists.",
    features: ["Trained Staff", "Hygienic Process", "Time-Slot Booking"],
    href: "/services#home-collection",
    color: "bg-success",
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
            Complete Healthcare Solutions
          </h2>
          <p className="text-muted-foreground text-lg">
            From diagnostic tests to specialist consultations, we provide comprehensive 
            healthcare services with a focus on accuracy and patient comfort.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 ease-out hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="h-7 w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={service.href}
                className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-200"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "10,000+", label: "Happy Patients" },
            { value: "100+", label: "Diagnostic Tests" },
            { value: "20+", label: "Expert Doctors" },
            { value: "99%", label: "Accuracy Rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
