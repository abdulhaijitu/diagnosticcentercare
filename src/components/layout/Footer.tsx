import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import trustCareLogo from "@/assets/trust-care-logo.png";

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  const { t } = useTranslation();

  const services = [
    { name: t("footer.diagnosticTests"), href: "/services#diagnostic" },
    { name: t("footer.doctorConsultation"), href: "/services#consultation" },
    { name: t("footer.homeSampleCollection"), href: "/services#home-collection" },
    { name: t("footer.healthPackages"), href: "/services#packages" },
  ];

  const quickLinks = [
    { name: t("footer.aboutUs"), href: "/about" },
    { name: t("footer.ourDoctors"), href: "/doctors" },
    { name: t("footer.bookATest"), href: "/book-test" },
    { name: t("footer.downloadReports"), href: "/my-requests" },
    { name: t("footer.contactUs"), href: "/contact" },
  ];

  return (
    <footer className="bg-foreground text-background" role="contentinfo">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src={trustCareLogo} 
                alt="TrustCare Diagnostic Center Logo" 
                className="h-12 w-auto brightness-0 invert"
                width={48}
                height={48}
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-tight">TrustCare</span>
                <span className="text-sm text-background/60">Diagnostic Center</span>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-4">
              {t("footer.brandDesc")}
            </p>
            <p className="text-sm font-medium text-primary mb-2">
              {t("footer.brandSlogan")}
            </p>
            <p className="text-sm text-background/70">
              {t("footer.brandNameBn")}
            </p>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t("footer.ourServices")}</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <Link 
                    to={service.href} 
                    className="text-background/70 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t("footer.quickLinks")}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-background/70 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t("footer.contactUs")}</h3>
            <address className="not-italic">
              <ul className="space-y-4">
                <li>
                  <a 
                    href="tel:+8801345580203" 
                    className="flex items-start gap-3 text-background/70 hover:text-primary transition-colors duration-200"
                  >
                    <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm">01345580203</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:trustcaredc@gmail.com" 
                    className="flex items-start gap-3 text-background/70 hover:text-primary transition-colors duration-200"
                  >
                    <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm">trustcaredc@gmail.com</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-background/70">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">
                    Plot-04, Block-F, Dhaka Uddan Co-operative Housing Society Ltd, 
                    Chandrima Model Town, Avenue-1 Gate Chowrasta, Mohammadpur, Dhaka-1207
                  </span>
                </li>
                <li className="flex items-start gap-3 text-background/70">
                  <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">{t("footer.open247")}</span>
                </li>
              </ul>
            </address>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
            <p>© {new Date().getFullYear()} {t("footer.copyright")}</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                {t("footer.privacyPolicy")}
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                {t("footer.termsOfService")}
              </Link>
            </div>
          </div>
          <div className="text-center mt-4 pt-4 border-t border-background/10">
            <p className="text-xs text-background/50">
              {t("footer.designedBy")}{" "}
              <a 
                href="http://creationtechbd.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Creation Tech
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
