import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { FlaskConical, Stethoscope, Home as HomeIcon, ArrowRight, CheckCircle2 } from "lucide-react";

export function ServicesSection() {
  const { t } = useTranslation();

  const services = [
    {
      icon: FlaskConical,
      title: t("servicesSection.diagnosticTests"),
      description: t("servicesSection.diagnosticDesc"),
      features: [t("servicesSection.diagnosticF1"), t("servicesSection.diagnosticF2"), t("servicesSection.diagnosticF3")],
      href: "/services#diagnostic",
      color: "bg-primary",
    },
    {
      icon: Stethoscope,
      title: t("servicesSection.doctorConsultation"),
      description: t("servicesSection.consultDesc"),
      features: [t("servicesSection.consultF1"), t("servicesSection.consultF2"), t("servicesSection.consultF3")],
      href: "/services#consultation",
      color: "bg-care-amber",
    },
    {
      icon: HomeIcon,
      title: t("servicesSection.homeCollection"),
      description: t("servicesSection.homeCollDesc"),
      features: [t("servicesSection.homeCollF1"), t("servicesSection.homeCollF2"), t("servicesSection.homeCollF3")],
      href: "/services#home-collection",
      color: "bg-success",
    },
  ];

  const stats = [
    { value: "10,000+", label: t("servicesSection.happyPatients") },
    { value: "100+", label: t("servicesSection.diagnosticTestsStat") },
    { value: "20+", label: t("servicesSection.expertDoctorsStat") },
    { value: "99%", label: t("servicesSection.accuracyRate") },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            {t("servicesSection.badge")}
          </span>
          <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
            {t("servicesSection.title")}
          </h2>
          <p className="text-muted-foreground text-lg">{t("servicesSection.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div key={service.title} className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 ease-out hover:-translate-y-1" style={{ animationDelay: `${index * 100}ms` }}>
              <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to={service.href} className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-200">
                {t("servicesSection.learnMore")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
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
