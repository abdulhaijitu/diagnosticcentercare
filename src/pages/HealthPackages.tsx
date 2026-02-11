import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, ArrowRight, Phone, Heart, Shield, Star } from "lucide-react";
import { useCorporatePackages } from "@/hooks/useCorporatePackages";
import heroServicesImg from "@/assets/hero-services.jpg";
import heroAbout1 from "@/assets/hero-about-1.jpg";

const HealthPackages = () => {
  const { t, i18n } = useTranslation();
  const { data: packages, isLoading } = useCorporatePackages();
  const isBn = i18n.language === "bn";

  const whyPackages = [
    { icon: Heart, titleKey: "healthPackagesPage.why1", descKey: "healthPackagesPage.why1Desc" },
    { icon: Shield, titleKey: "healthPackagesPage.why2", descKey: "healthPackagesPage.why2Desc" },
    { icon: Star, titleKey: "healthPackagesPage.why3", descKey: "healthPackagesPage.why3Desc" },
  ];

  return (
    <MainLayout>
      <SEOHead
        title="Health Packages"
        titleBn="হেলথ প্যাকেজ"
        description="Affordable health checkup packages at TrustCare Diagnostic Center. Basic, Standard, and Premium packages with comprehensive blood tests."
        descriptionBn="ট্রাস্ট কেয়ার ডায়াগনোস্টিক সেন্টারে সাশ্রয়ী হেলথ চেকআপ প্যাকেজ। বেসিক, স্ট্যান্ডার্ড এবং প্রিমিয়াম প্যাকেজ।"
        keywords="health checkup packages dhaka, affordable blood test package, health screening dhaka"
        url="https://diagnosticcentercare.lovable.app/health-packages"
      />

      {/* Hero */}
      <PageHero
        badge={t("healthPackagesPage.badge")}
        title={t("healthPackagesPage.heroTitle")}
        subtitle={t("healthPackagesPage.heroSubtitle")}
        images={[heroServicesImg, heroAbout1]}
        variant="gradient"
      />

      {/* Packages */}
      <section className="section-padding">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8 -mt-12">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader><Skeleton className="h-6 w-40" /><Skeleton className="h-10 w-32 mt-2" /></CardHeader>
                  <CardContent><div className="space-y-3">{[1,2,3,4,5].map(j => <Skeleton key={j} className="h-5 w-full" />)}</div></CardContent>
                </Card>
              ))}
            </div>
          ) : packages && packages.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 -mt-12">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 ${
                    pkg.is_popular ? "ring-2 ring-accent scale-[1.02]" : ""
                  }`}
                >
                  {pkg.is_popular && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-accent text-accent-foreground">{t("healthPackagesPage.mostPopular")}</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">{isBn ? pkg.name : pkg.name_en}</CardTitle>
                    {pkg.description && (
                      <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                    )}
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-foreground">৳{pkg.price.toLocaleString()}</span>
                      <span className="text-muted-foreground text-sm ml-1">/ {pkg.price_label}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {pkg.tests.map((test, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{test}</span>
                        </li>
                      ))}
                    </ul>
                    {pkg.features.length > 0 && (
                      <div className="mb-6 pt-4 border-t border-border">
                        <p className="text-xs font-semibold text-foreground mb-2">{t("healthPackagesPage.includes") || "অন্তর্ভুক্ত সুবিধা"}</p>
                        <ul className="space-y-1.5">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 text-accent flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Link to="/book-test">
                      <Button className="w-full" variant={pkg.is_popular ? "default" : "outline"}>
                        {t("healthPackagesPage.bookNow")}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("healthPackagesPage.noPackages") || "কোনো প্যাকেজ পাওয়া যায়নি"}</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Health Packages */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              {t("healthPackagesPage.whyTitle")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {whyPackages.map((w) => (
              <Card key={w.titleKey} className="text-center">
                <CardContent className="pt-8 pb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <w.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t(w.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(w.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-display-sm font-bold mb-4">{t("healthPackagesPage.ctaTitle")}</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">{t("healthPackagesPage.ctaDesc")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book-test">
              <Button size="lg" variant="secondary">
                {t("healthPackagesPage.bookNow")}
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

export default HealthPackages;
