import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home, Clock, Shield, MapPin, Phone, ArrowRight,
  CheckCircle2, Truck, FlaskConical, FileText, CalendarCheck, Users
} from "lucide-react";
import heroBooktestImg from "@/assets/hero-booktest.jpg";
import heroAbout1 from "@/assets/hero-about-1.jpg";

const HomeSampleCollection = () => {
  const { t } = useTranslation();

  const benefits = [
    { icon: Home, titleKey: "homeCollectionPage.benefit1", descKey: "homeCollectionPage.benefit1Desc" },
    { icon: Clock, titleKey: "homeCollectionPage.benefit2", descKey: "homeCollectionPage.benefit2Desc" },
    { icon: Shield, titleKey: "homeCollectionPage.benefit3", descKey: "homeCollectionPage.benefit3Desc" },
    { icon: MapPin, titleKey: "homeCollectionPage.benefit4", descKey: "homeCollectionPage.benefit4Desc" },
  ];

  const steps = [
    { step: 1, icon: CalendarCheck, titleKey: "homeCollectionPage.step1", descKey: "homeCollectionPage.step1Desc" },
    { step: 2, icon: Truck, titleKey: "homeCollectionPage.step2", descKey: "homeCollectionPage.step2Desc" },
    { step: 3, icon: FlaskConical, titleKey: "homeCollectionPage.step3", descKey: "homeCollectionPage.step3Desc" },
    { step: 4, icon: FileText, titleKey: "homeCollectionPage.step4", descKey: "homeCollectionPage.step4Desc" },
  ];

  const areas = [
    "Mohammadpur", "Dhanmondi", "Mirpur", "Uttara", "Gulshan",
    "Banani", "Farmgate", "Shyamoli", "Lalmatia", "Shamoli",
  ];

  return (
    <MainLayout>
      <SEOHead
        title="Home Sample Collection"
        titleBn="হোম স্যাম্পল কালেকশন"
        description="Book home sample collection in Dhaka. Our trained phlebotomists will collect your blood samples from your doorstep. Fast reports, affordable prices."
        descriptionBn="ঢাকায় হোম স্যাম্পল কালেকশন বুক করুন। আমাদের প্রশিক্ষিত কর্মী আপনার বাড়ি থেকে রক্তের নমুনা সংগ্রহ করবে। দ্রুত রিপোর্ট, সাশ্রয়ী মূল্য।"
        keywords="home sample collection dhaka, blood test at home, home blood test, doorstep lab test"
        url="https://diagnosticcentercare.lovable.app/home-collection"
      />

      {/* Hero */}
      <PageHero
        badge={t("homeCollectionPage.badge")}
        title={t("homeCollectionPage.heroTitle")}
        subtitle={t("homeCollectionPage.heroSubtitle")}
        images={[heroBooktestImg, heroAbout1]}
        variant="gradient"
      >
        <div className="flex flex-wrap gap-4">
          <Link to="/book-test">
            <Button size="lg" variant="secondary">
              {t("homeCollectionPage.bookNow")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <a href="tel:+8801345580203">
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white">
              <Phone className="h-4 w-4 mr-2" />
              {t("homeCollectionPage.callUs")}
            </Button>
          </a>
        </div>
      </PageHero>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              {t("homeCollectionPage.whyChoose")}
            </h2>
            <p className="text-muted-foreground">{t("homeCollectionPage.whyChooseDesc")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <Card key={b.titleKey} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <b.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t(b.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(b.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              {t("homeCollectionPage.howItWorks")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <Card className="h-full">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                      {s.step}
                    </div>
                    <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">{t(s.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(s.descKey)}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              {t("homeCollectionPage.serviceAreas")}
            </h2>
            <p className="text-muted-foreground">{t("homeCollectionPage.serviceAreasDesc")}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {areas.map((area) => (
              <span key={area} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-display-sm font-bold mb-4">{t("homeCollectionPage.ctaTitle")}</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">{t("homeCollectionPage.ctaDesc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book-test">
              <Button size="lg" variant="secondary">
                {t("homeCollectionPage.bookNow")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:+8801345580203">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Phone className="h-4 w-4 mr-2" />
                01345-580203
              </Button>
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomeSampleCollection;
