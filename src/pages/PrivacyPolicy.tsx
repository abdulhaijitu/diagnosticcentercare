import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Shield, Lock, Eye, UserCheck, Bell, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: Shield,
      title: t("privacyPage.infoCollect"),
      content: t("privacyPage.infoCollectDesc"),
      items: [
        t("privacyPage.infoItem1"),
        t("privacyPage.infoItem2"),
        t("privacyPage.infoItem3"),
        t("privacyPage.infoItem4"),
      ],
    },
    {
      icon: Eye,
      title: t("privacyPage.howUse"),
      content: t("privacyPage.howUseDesc"),
      items: [
        t("privacyPage.useItem1"),
        t("privacyPage.useItem2"),
        t("privacyPage.useItem3"),
        t("privacyPage.useItem4"),
      ],
    },
    {
      icon: Lock,
      title: t("privacyPage.dataSecurity"),
      content: t("privacyPage.dataSecurityDesc"),
      items: [
        t("privacyPage.securityItem1"),
        t("privacyPage.securityItem2"),
        t("privacyPage.securityItem3"),
      ],
    },
    {
      icon: UserCheck,
      title: t("privacyPage.dataSharing"),
      content: t("privacyPage.dataSharingDesc"),
      items: [
        t("privacyPage.sharingItem1"),
        t("privacyPage.sharingItem2"),
        t("privacyPage.sharingItem3"),
      ],
    },
    {
      icon: Bell,
      title: t("privacyPage.yourRights"),
      content: t("privacyPage.yourRightsDesc"),
      items: [
        t("privacyPage.rightsItem1"),
        t("privacyPage.rightsItem2"),
        t("privacyPage.rightsItem3"),
        t("privacyPage.rightsItem4"),
      ],
    },
    {
      icon: Mail,
      title: t("privacyPage.contact"),
      content: t("privacyPage.contactDesc"),
      items: [],
    },
  ];

  return (
    <MainLayout>
      <SEOHead
        title="Privacy Policy"
        titleBn="গোপনীয়তা নীতি"
        description="TrustCare Diagnostic Center privacy policy — how we collect, use, and protect your personal and medical information."
        descriptionBn="ট্রাস্ট কেয়ার ডায়াগনোস্টিক সেন্টারের গোপনীয়তা নীতি — আমরা কীভাবে আপনার ব্যক্তিগত ও চিকিৎসা তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।"
        url="https://diagnosticcentercare.lovable.app/privacy"
      />

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-display-sm md:text-display-lg font-bold text-foreground mb-4">
              {t("privacyPage.title")}
            </h1>
            <p className="text-muted-foreground">{t("privacyPage.lastUpdated")}</p>
          </div>

          <div className="prose-custom space-y-10">
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("privacyPage.intro")}
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

export default PrivacyPolicy;
