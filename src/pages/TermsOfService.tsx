import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { FileText, AlertTriangle, CreditCard, Clock, Ban, Scale } from "lucide-react";

const TermsOfService = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: FileText,
      title: t("termsPage.servicesTitle"),
      content: t("termsPage.servicesDesc"),
      items: [
        t("termsPage.servicesItem1"),
        t("termsPage.servicesItem2"),
        t("termsPage.servicesItem3"),
        t("termsPage.servicesItem4"),
      ],
    },
    {
      icon: CreditCard,
      title: t("termsPage.paymentTitle"),
      content: t("termsPage.paymentDesc"),
      items: [
        t("termsPage.paymentItem1"),
        t("termsPage.paymentItem2"),
        t("termsPage.paymentItem3"),
      ],
    },
    {
      icon: Clock,
      title: t("termsPage.appointmentTitle"),
      content: t("termsPage.appointmentDesc"),
      items: [
        t("termsPage.appointmentItem1"),
        t("termsPage.appointmentItem2"),
        t("termsPage.appointmentItem3"),
      ],
    },
    {
      icon: AlertTriangle,
      title: t("termsPage.disclaimerTitle"),
      content: t("termsPage.disclaimerDesc"),
      items: [
        t("termsPage.disclaimerItem1"),
        t("termsPage.disclaimerItem2"),
      ],
    },
    {
      icon: Ban,
      title: t("termsPage.prohibitedTitle"),
      content: t("termsPage.prohibitedDesc"),
      items: [
        t("termsPage.prohibitedItem1"),
        t("termsPage.prohibitedItem2"),
        t("termsPage.prohibitedItem3"),
      ],
    },
    {
      icon: Scale,
      title: t("termsPage.governingTitle"),
      content: t("termsPage.governingDesc"),
      items: [],
    },
  ];

  return (
    <MainLayout>
      <SEOHead
        title="Terms of Service"
        titleBn="সেবার শর্তাবলী"
        description="TrustCare Diagnostic Center terms of service — rules and guidelines for using our diagnostic and healthcare services."
        descriptionBn="ট্রাস্ট কেয়ার ডায়াগনোস্টিক সেন্টারের সেবার শর্তাবলী — আমাদের ডায়াগনস্টিক ও স্বাস্থ্যসেবা ব্যবহারের নিয়মাবলী।"
        url="https://diagnosticcentercare.lovable.app/terms"
      />

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-display-sm md:text-display-lg font-bold text-foreground mb-4">
              {t("termsPage.title")}
            </h1>
            <p className="text-muted-foreground">{t("termsPage.lastUpdated")}</p>
          </div>

          <div className="space-y-10">
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("termsPage.intro")}
            </p>

            {sections.map((section, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">{section.content}</p>
                {section.items.length > 0 && (
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default TermsOfService;
