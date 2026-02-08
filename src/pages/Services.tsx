import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { 
  Microscope, Stethoscope, Home, ArrowRight, CheckCircle2,
  Clock, Shield, Award, Users, FileText, CalendarCheck, Truck,
  FlaskConical, HeartPulse, Brain, Bone, Baby, Eye, Activity,
  Building2, BadgeCheck, Star, Phone
} from "lucide-react";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CorporateInquiryForm } from "@/components/corporate/CorporateInquiryForm";
import { useCorporatePackages } from "@/hooks/useCorporatePackages";
import { Skeleton } from "@/components/ui/skeleton";

const Services = () => {
  const { t } = useTranslation();
  const { data: corporatePackages, isLoading: packagesLoading } = useCorporatePackages();

  const services = [
    {
      id: "diagnostic",
      icon: Microscope,
      title: t("servicesPage.diagnostic.title"),
      titleEn: t("servicesPage.diagnostic.titleEn"),
      description: t("servicesPage.diagnostic.description"),
      features: [
        t("servicesPage.diagnostic.f1"), t("servicesPage.diagnostic.f2"),
        t("servicesPage.diagnostic.f3"), t("servicesPage.diagnostic.f4"),
        t("servicesPage.diagnostic.f5"),
      ],
      categories: [
        { name: t("servicesPage.diagnostic.cat1"), icon: FlaskConical, tests: ["CBC", "Blood Sugar", "Lipid Profile", "Liver Function", "Kidney Function"] },
        { name: t("servicesPage.diagnostic.cat2"), icon: Activity, tests: ["Thyroid Profile", "Diabetes Panel", "Fertility Hormones"] },
        { name: t("servicesPage.diagnostic.cat3"), icon: FlaskConical, tests: ["Routine Urine", "Urine Culture", "Microalbumin"] },
        { name: t("servicesPage.diagnostic.cat4"), icon: Eye, tests: ["X-Ray", "Ultrasound", "ECG", "Echo"] },
      ],
      cta: { text: t("servicesPage.diagnostic.cta"), link: "/book-test" },
      color: "primary",
    },
    {
      id: "consultation",
      icon: Stethoscope,
      title: t("servicesPage.consultation.title"),
      titleEn: t("servicesPage.consultation.titleEn"),
      description: t("servicesPage.consultation.description"),
      features: [
        t("servicesPage.consultation.f1"), t("servicesPage.consultation.f2"),
        t("servicesPage.consultation.f3"), t("servicesPage.consultation.f4"),
        t("servicesPage.consultation.f5"),
      ],
      categories: [
        { name: t("servicesPage.consultation.cat1"), icon: HeartPulse, tests: ["হৃদরোগ বিশেষজ্ঞ", "ECG, Echo", "Stress Test"] },
        { name: t("servicesPage.consultation.cat2"), icon: Stethoscope, tests: ["সাধারণ চিকিৎসা", "ডায়াবেটিস", "উচ্চ রক্তচাপ"] },
        { name: t("servicesPage.consultation.cat3"), icon: Bone, tests: ["হাড় ও জয়েন্ট", "ফিজিওথেরাপি", "স্পোর্টস ইনজুরি"] },
        { name: t("servicesPage.consultation.cat4"), icon: Baby, tests: ["প্রসূতি বিদ্যা", "বন্ধ্যাত্ব চিকিৎসা", "মহিলা রোগ"] },
        { name: t("servicesPage.consultation.cat5"), icon: Brain, tests: ["মস্তিষ্ক ও স্নায়ু", "মাইগ্রেন", "স্ট্রোক"] },
      ],
      cta: { text: t("servicesPage.consultation.cta"), link: "/book-appointment" },
      color: "accent",
    },
    {
      id: "home-collection",
      icon: Home,
      title: t("servicesPage.homeCollection.title"),
      titleEn: t("servicesPage.homeCollection.titleEn"),
      description: t("servicesPage.homeCollection.description"),
      features: [
        t("servicesPage.homeCollection.f1"), t("servicesPage.homeCollection.f2"),
        t("servicesPage.homeCollection.f3"), t("servicesPage.homeCollection.f4"),
        t("servicesPage.homeCollection.f5"),
      ],
      categories: [
        { name: t("servicesPage.homeCollection.cat1"), icon: Users, tests: ["বাড়িতেই সব টেস্ট", "বিশেষ যত্ন", "রিপোর্ট বাড়িতে"] },
        { name: t("servicesPage.homeCollection.cat2"), icon: Clock, tests: ["সুবিধাজনক সময়", "অফিসে কালেকশন", "দ্রুত সেবা"] },
        { name: t("servicesPage.homeCollection.cat3"), icon: Award, tests: ["গ্রুপ হেলথ চেকআপ", "কর্মী স্বাস্থ্য পরীক্ষা", "বিশেষ ছাড়"] },
      ],
      cta: { text: t("servicesPage.homeCollection.cta"), link: "/book-test" },
      color: "success",
    },
  ];

  const processSteps = [
    { step: 1, title: t("servicesPage.process.step1"), description: t("servicesPage.process.step1Desc"), icon: CalendarCheck },
    { step: 2, title: t("servicesPage.process.step2"), description: t("servicesPage.process.step2Desc"), icon: Truck },
    { step: 3, title: t("servicesPage.process.step3"), description: t("servicesPage.process.step3Desc"), icon: FlaskConical },
    { step: 4, title: t("servicesPage.process.step4"), description: t("servicesPage.process.step4Desc"), icon: FileText },
  ];

  const faqs = [
    { question: t("servicesPage.faq.q1"), answer: t("servicesPage.faq.a1") },
    { question: t("servicesPage.faq.q2"), answer: t("servicesPage.faq.a2") },
    { question: t("servicesPage.faq.q3"), answer: t("servicesPage.faq.a3") },
    { question: t("servicesPage.faq.q4"), answer: t("servicesPage.faq.a4") },
    { question: t("servicesPage.faq.q5"), answer: t("servicesPage.faq.a5") },
  ];

  const whyChooseItems = [
    { icon: Shield, titleKey: "servicesPage.whyChoose.accurateResults", descKey: "servicesPage.whyChoose.accurateResultsDesc" },
    { icon: Clock, titleKey: "servicesPage.whyChoose.fastReports", descKey: "servicesPage.whyChoose.fastReportsDesc" },
    { icon: Users, titleKey: "servicesPage.whyChoose.expertTeam", descKey: "servicesPage.whyChoose.expertTeamDesc" },
    { icon: Award, titleKey: "servicesPage.whyChoose.affordablePrice", descKey: "servicesPage.whyChoose.affordablePriceDesc" },
  ];

  const corporateBenefits = [
    t("servicesPage.corporate.b1"), t("servicesPage.corporate.b2"),
    t("servicesPage.corporate.b3"), t("servicesPage.corporate.b4"),
    t("servicesPage.corporate.b5"), t("servicesPage.corporate.b6"),
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="Our Services"
        titleBn="আমাদের সেবাসমূহ"
        description="Diagnostic tests, doctor consultation, and home sample collection services."
        descriptionBn="ডায়াগনস্টিক টেস্ট, ডক্টর কনসালটেশন এবং হোম স্যাম্পল কালেকশন সেবা।"
        keywords="diagnostic services dhaka, doctor consultation, home sample collection, blood test"
        url="https://diagnosticcentercare.lovable.app/services"
      />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-16 md:py-24">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                {t("servicesPage.heroBadge")}
              </span>
              <h1 className="text-display-sm md:text-display-lg font-bold mb-6">
                {t("servicesPage.heroTitle")}
              </h1>
              <p className="text-white/80 text-lg mb-8">
                {t("servicesPage.heroSubtitle")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/book-test">
                  <Button size="lg" variant="secondary">
                    {t("servicesPage.bookTest")}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/book-appointment">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20">
                    {t("servicesPage.doctorAppointment")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-card border-b border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter end={50} duration={1500} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">{t("servicesPage.statsTests")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter end={20} duration={1500} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">{t("servicesPage.statsDoctors")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter end={10000} duration={2000} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">{t("servicesPage.statsPatients")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter end={99} duration={1500} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">{t("servicesPage.statsAccuracy")}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Detail */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-display-sm font-bold text-foreground mb-4">
                {t("servicesPage.mainServicesTitle")}
              </h2>
              <p className="text-muted-foreground">
                {t("servicesPage.mainServicesSubtitle")}
              </p>
            </div>

            <div className="space-y-16">
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        service.color === "primary" ? "bg-primary/10" :
                        service.color === "accent" ? "bg-accent/10" : "bg-success/10"
                      }`}>
                        <service.icon className={`h-7 w-7 ${
                          service.color === "primary" ? "text-primary" :
                          service.color === "accent" ? "text-accent" : "text-success"
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.titleEn}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6 text-lg">{service.description}</p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${
                            service.color === "primary" ? "text-primary" :
                            service.color === "accent" ? "text-accent" : "text-success"
                          }`} />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={service.cta.link}>
                      <Button size="lg">
                        {service.cta.text}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {service.categories.map((category, i) => (
                        <Card key={i} className="hover:shadow-elevated transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                service.color === "primary" ? "bg-primary/10" :
                                service.color === "accent" ? "bg-accent/10" : "bg-success/10"
                              }`}>
                                <category.icon className={`h-5 w-5 ${
                                  service.color === "primary" ? "text-primary" :
                                  service.color === "accent" ? "text-accent" : "text-success"
                                }`} />
                              </div>
                              <CardTitle className="text-base">{category.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-1.5">
                              {category.tests.map((test, j) => (
                                <Badge key={j} variant="secondary" className="text-xs">{test}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-display-sm font-bold text-foreground mb-4">
                {t("servicesPage.process.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("servicesPage.process.subtitle")}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="h-full text-center hover:shadow-elevated transition-shadow">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                        <step.icon className="h-8 w-8 text-primary" />
                        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                          {step.step}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-primary/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Health Checkup Packages */}
        <section className="section-padding bg-gradient-to-b from-background to-muted/30">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Building2 className="h-4 w-4" />
                <span>{t("servicesPage.corporate.badge")}</span>
              </div>
              <h2 className="text-display-sm font-bold text-foreground mb-4">
                {t("servicesPage.corporate.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("servicesPage.corporate.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {packagesLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader>
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <Skeleton className="h-6 w-3/4 mt-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : corporatePackages && corporatePackages.length > 0 ? (
                corporatePackages.map((pkg) => (
                  <Card 
                    key={pkg.id} 
                    className={`relative overflow-hidden transition-all duration-300 hover:shadow-elevated ${
                      pkg.is_popular ? "border-primary ring-2 ring-primary/20" : "border-muted"
                    }`}
                  >
                    {pkg.is_popular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {t("servicesPage.corporate.popular")}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          pkg.is_popular ? "bg-primary/10" : "bg-muted"
                        }`}>
                          <Building2 className={`h-6 w-6 ${pkg.is_popular ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{pkg.name_en}</p>
                        </div>
                      </div>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center py-4 bg-muted/50 rounded-xl">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-bold text-foreground">৳{pkg.price.toLocaleString()}</span>
                          <span className="text-muted-foreground">/{pkg.price_label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("servicesPage.corporate.minEmployees", { count: pkg.min_employees })}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <FlaskConical className="h-4 w-4 text-primary" />
                          {t("servicesPage.corporate.testsIncluded")}
                        </h4>
                        <ul className="space-y-2">
                          {pkg.tests.map((test, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{test}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-border">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-primary" />
                          {t("servicesPage.corporate.specialFeatures")}
                        </h4>
                        <ul className="space-y-2">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <CorporateInquiryForm 
                        defaultPackage={pkg.id}
                        trigger={
                          <Button className="w-full" variant={pkg.is_popular ? "default" : "outline"} size="lg">
                            <Building2 className="h-4 w-4 mr-2" />
                            {t("servicesPage.corporate.inquire")}
                          </Button>
                        }
                      />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-muted-foreground">
                  {t("servicesPage.corporate.noPackages")}
                </div>
              )}
            </div>

            {/* Corporate Benefits */}
            <div className="mt-12 bg-card rounded-2xl p-6 md:p-8 border shadow-sm">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {t("servicesPage.corporate.benefitsTitle")}
                  </h3>
                  <ul className="space-y-3">
                    {corporateBenefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-hero rounded-xl p-6 text-center text-white">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <h4 className="text-xl font-bold mb-2">{t("servicesPage.corporate.customTitle")}</h4>
                  <p className="text-white/80 mb-4 text-sm">
                    {t("servicesPage.corporate.customSubtitle")}
                  </p>
                  <CorporateInquiryForm 
                    trigger={
                      <Button variant="secondary" size="lg">
                        <Building2 className="h-4 w-4 mr-2" />
                        {t("servicesPage.corporate.inquire")}
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-display-sm font-bold text-foreground mb-4">
                {t("servicesPage.whyChoose.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("servicesPage.whyChoose.subtitle")}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseItems.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-elevated transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{t(item.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(item.descKey)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-display-sm font-bold text-foreground mb-4">
                  {t("servicesPage.faq.title")}
                </h2>
                <p className="text-muted-foreground">
                  {t("servicesPage.faq.subtitle")}
                </p>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-card rounded-xl px-6 border shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <TestimonialsSection />

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t("servicesPage.ctaTitle")}
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                {t("servicesPage.ctaSubtitle")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/book-test">
                  <Button size="lg" variant="secondary">
                    {t("servicesPage.ctaBookTest")}
                  </Button>
                </Link>
                <a href="tel:+8801345580203">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20">
                    {t("servicesPage.ctaCall")}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Services;
