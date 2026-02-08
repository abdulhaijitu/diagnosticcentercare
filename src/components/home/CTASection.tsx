import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, ArrowRight, Clock, MapPin } from "lucide-react";

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                <Calendar className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{t("cta.bookAppointment")}</h3>
                <p className="text-muted-foreground">{t("cta.scheduleVisit")}</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">{t("cta.bookAppointmentDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1" asChild>
                <Link to="/book-test">{t("cta.bookTest")}<ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="flex-1" asChild>
                <Link to="/doctors">{t("cta.findDoctor")}</Link>
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary to-trust-teal-light rounded-3xl p-8 md:p-10 text-primary-foreground">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Phone className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t("cta.needHelp")}</h3>
                <p className="text-primary-foreground/80">{t("cta.hereToAssist")}</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">{t("cta.needHelpDesc")}</p>
            <div className="space-y-4 mb-6">
              <a href="tel:01345580203" className="flex items-center gap-3 text-primary-foreground hover:opacity-80 transition-opacity">
                <Phone className="h-5 w-5" />
                <span className="font-semibold">01345580203</span>
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Clock className="h-5 w-5" />
                <span>{t("cta.open247")}</span>
              </div>
              <div className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Plot-04, Block-F, Dhaka Uddan, Mohammadpur, Dhaka-1207</span>
              </div>
            </div>
            <Button size="lg" variant="accent" className="w-full sm:w-auto" asChild>
              <a href="tel:01345580203">{t("cta.callNow")}<Phone className="h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
