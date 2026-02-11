import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHero } from "@/components/shared/PageHero";
import { 
  Heart, Target, Eye, Shield, Users, Award, 
  Clock, CheckCircle2, Building2, Microscope,
  Linkedin, Mail, Trophy, Medal, BadgeCheck, Star
} from "lucide-react";
import heroAbout1 from "@/assets/hero-about-1.jpg";
import heroAbout2 from "@/assets/hero-about-2.jpg";
import heroServices from "@/assets/hero-services.jpg";

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { value: "10,000+", labelKey: "about.stats.patientsServed", icon: Users },
    { value: "50+", labelKey: "about.stats.diagnosticTests", icon: Microscope },
    { value: "20+", labelKey: "about.stats.expertDoctors", icon: Award },
    { value: "99%", labelKey: "about.stats.satisfactionRate", icon: Heart },
  ];

  const milestones = [
    { year: "২০১৮", eventKey: "about.milestones.m1" },
    { year: "২০১৯", eventKey: "about.milestones.m2" },
    { year: "২০২০", eventKey: "about.milestones.m3" },
    { year: "২০২১", eventKey: "about.milestones.m4" },
    { year: "২০২২", eventKey: "about.milestones.m5" },
    { year: "২০২৩", eventKey: "about.milestones.m6" },
  ];

  const teamMembers = [
    { nameKey: "about.teamMembers.m1Name", roleKey: "about.teamMembers.m1Role", qualification: "MBBS, FCPS (Pathology)", bioKey: "about.teamMembers.m1Bio", email: "ahmed.karim@trustcaredc.com", linkedin: "#" },
    { nameKey: "about.teamMembers.m2Name", roleKey: "about.teamMembers.m2Role", qualification: "MBBS, MD (Clinical Pathology)", bioKey: "about.teamMembers.m2Bio", email: "fatema.nasrin@trustcaredc.com", linkedin: "#" },
    { nameKey: "about.teamMembers.m3Name", roleKey: "about.teamMembers.m3Role", qualification: "MBA, Healthcare Management", bioKey: "about.teamMembers.m3Bio", email: "rafi@trustcaredc.com", linkedin: "#" },
    { nameKey: "about.teamMembers.m4Name", roleKey: "about.teamMembers.m4Role", qualification: "BSc MLT, Diploma in Lab Medicine", bioKey: "about.teamMembers.m4Bio", email: "sabrina@trustcaredc.com", linkedin: "#" },
    { nameKey: "about.teamMembers.m5Name", roleKey: "about.teamMembers.m5Role", qualification: "MBBS, MD (Radiology)", bioKey: "about.teamMembers.m5Bio", email: "tanvir@trustcaredc.com", linkedin: "#" },
    { nameKey: "about.teamMembers.m6Name", roleKey: "about.teamMembers.m6Role", qualification: "BA, Customer Service Certified", bioKey: "about.teamMembers.m6Bio", email: "nazma@trustcaredc.com", linkedin: "#" },
  ];

  const achievements = [
    { icon: Trophy, year: "২০২৩", titleKey: "about.achievementsList.a1Title", orgKey: "about.achievementsList.a1Org", descKey: "about.achievementsList.a1Desc" },
    { icon: Medal, year: "২০২২", titleKey: "about.achievementsList.a2Title", orgKey: "about.achievementsList.a2Org", descKey: "about.achievementsList.a2Desc" },
    { icon: BadgeCheck, year: "২০২২", titleKey: "about.achievementsList.a3Title", orgKey: "about.achievementsList.a3Org", descKey: "about.achievementsList.a3Desc" },
    { icon: Star, year: "২০২১", titleKey: "about.achievementsList.a4Title", orgKey: "about.achievementsList.a4Org", descKey: "about.achievementsList.a4Desc" },
    { icon: Award, year: "২০২০", titleKey: "about.achievementsList.a5Title", orgKey: "about.achievementsList.a5Org", descKey: "about.achievementsList.a5Desc" },
    { icon: Heart, year: "২০১৯", titleKey: "about.achievementsList.a6Title", orgKey: "about.achievementsList.a6Org", descKey: "about.achievementsList.a6Desc" },
  ];

  const values = [
    { icon: Shield, titleKey: "about.values.trust", descKey: "about.values.trustDesc" },
    { icon: Heart, titleKey: "about.values.care", descKey: "about.values.careDesc" },
    { icon: Clock, titleKey: "about.values.punctuality", descKey: "about.values.punctualityDesc" },
    { icon: CheckCircle2, titleKey: "about.values.quality", descKey: "about.values.qualityDesc" },
  ];

  return (
    <>
      <SEOHead
        title="About Us"
        titleBn="আমাদের সম্পর্কে"
        description="Learn about TrustCare Diagnostic Center - our mission, vision, team, and commitment to fast and accurate lab services in Dhaka."
        descriptionBn="ট্রাস্ট কেয়ার ডায়াগনোস্টিক সেন্টার সম্পর্কে জানুন - আমাদের মিশন, ভিশন, টিম এবং দ্রুত ও নির্ভুল ল্যাব সেবার প্রতিশ্রুতি।"
        url="https://diagnosticcentercare.lovable.app/about"
      />
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <PageHero
          badge={t("about.heroTitle")}
          title={t("about.heroTitle")}
          subtitle={t("about.heroSubtitle")}
          images={[heroAbout1, heroAbout2, heroServices]}
          variant="light"
        />

        {/* Stats Section */}
        <section className="py-12 bg-card border-y border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.labelKey} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t(stat.labelKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">{t("about.history.badge")}</span>
                </div>
                <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-6">
                  {t("about.history.title")}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>{t("about.history.p1")}</p>
                  <p>{t("about.history.p2")}</p>
                  <p>{t("about.history.p3")}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative pl-12">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="bg-card border border-border rounded-lg p-4">
                        <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                        <p className="text-foreground mt-1">{t(milestone.eventKey)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card border-2 border-primary/20">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{t("about.mission.title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("about.mission.description")}</p>
                  <ul className="mt-6 space-y-3">
                    {["about.mission.f1", "about.mission.f2", "about.mission.f3"].map((key) => (
                      <li key={key} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-accent/20">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                    <Eye className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{t("about.vision.title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("about.vision.description")}</p>
                  <ul className="mt-6 space-y-3">
                    {["about.vision.f1", "about.vision.f2", "about.vision.f3"].map((key) => (
                      <li key={key} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">{t("about.team.badge")}</span>
              </div>
              <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">{t("about.team.title")}</h2>
              <p className="text-muted-foreground">{t("about.team.subtitle")}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => {
                const name = t(member.nameKey);
                return (
                  <Card key={member.nameKey} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="pt-8 pb-6">
                      <div className="text-center">
                        <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all">
                          <AvatarFallback className="text-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                            {name.split(" ").slice(-1)[0].charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
                        <p className="text-sm font-medium text-primary mb-1">{t(member.roleKey)}</p>
                        <p className="text-xs text-muted-foreground mb-3">{member.qualification}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t(member.bioKey)}</p>
                        <div className="flex items-center justify-center gap-3 pt-4 border-t border-border">
                          <a href={`mailto:${member.email}`} className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors" title={t("about.emailTooltip")}>
                            <Mail className="h-4 w-4" />
                          </a>
                          <a href={member.linkedin} className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors" title={t("about.linkedinTooltip")}>
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">{t("about.achievements.badge")}</span>
              </div>
              <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">{t("about.achievements.title")}</h2>
              <p className="text-muted-foreground">{t("about.achievements.subtitle")}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="group relative overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <achievement.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">{achievement.year}</span>
                        <h3 className="text-lg font-semibold text-foreground mb-1 leading-tight">{t(achievement.titleKey)}</h3>
                        <p className="text-sm text-primary/80 font-medium mb-2">{t(achievement.orgKey)}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{t(achievement.descKey)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">{t("about.values.title")}</h2>
              <p className="text-muted-foreground">{t("about.values.subtitle")}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.titleKey} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{t(value.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(value.descKey)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="text-display-sm font-bold mb-4">{t("about.cta.title")}</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">{t("about.cta.subtitle")}</p>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </div>
    </>
  );
};

export default About;
