import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { 
  Phone, Mail, MapPin, Clock, Send, MessageSquare,
  Building2, ArrowRight, Facebook, MessageCircle
} from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Dynamic validation schema using translations
  const contactSchema = z.object({
    name: z.string().trim().min(1, t("validation.nameRequired")).max(100, t("validation.nameMax")),
    email: z.string().trim().email(t("validation.emailInvalid")).max(255, t("validation.emailMax")),
    phone: z.string().trim().max(20, t("validation.phoneMax")).optional().or(z.literal("")),
    subject: z.string().trim().min(1, t("validation.subjectRequired")).max(200, t("validation.subjectMax")),
    message: z.string().trim().min(1, t("validation.messageRequired")).max(2000, t("validation.messageMax")),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone || null,
          subject: result.data.subject,
          message: result.data.message,
        });

      if (error) throw error;

      try {
        await supabase.functions.invoke("send-contact-notification", {
          body: {
            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone || null,
            subject: result.data.subject,
            message: result.data.message,
            adminEmail: "trustcaredc@gmail.com",
          },
        });
      } catch (emailError) {
        console.error("Failed to send admin notification email:", emailError);
      }

      toast({
        title: t("contactPage.messageSent"),
        description: t("contactPage.messageSentDesc"),
      });

      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: t("contactPage.errorOccurred"),
        description: t("contactPage.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t("contactPage.phone"),
      details: ["+880 1345-580203"],
      action: "tel:+8801345580203",
      actionText: t("contactPage.callNow"),
    },
    {
      icon: Mail,
      title: t("contactPage.email"),
      details: ["trustcaredc@gmail.com"],
      action: "mailto:trustcaredc@gmail.com",
      actionText: t("contactPage.sendEmail"),
    },
    {
      icon: MapPin,
      title: t("contactPage.address"),
      details: [
        t("contactPage.addressLine1"),
        t("contactPage.addressLine2"),
        t("contactPage.addressLine3"),
        t("contactPage.addressLine4"),
      ],
      action: "https://maps.google.com/?q=23.7595,90.3600",
      actionText: t("contactPage.getDirections"),
    },
    {
      icon: Clock,
      title: t("contactPage.workingHours"),
      details: [
        t("contactPage.workingHoursLine1"),
        t("contactPage.workingHoursLine2"),
      ],
      action: null,
      actionText: null,
    },
  ];

  return (
    <>
      <SEOHead
        title="Contact Us"
        titleBn="যোগাযোগ করুন"
        description="Contact TrustCare Diagnostic Center. Phone: 01345580203. Email: trustcaredc@gmail.com. Address: Mohammadpur, Dhaka-1207."
        descriptionBn="ট্রাস্ট কেয়ার ডায়াগনোস্টিক সেন্টারে যোগাযোগ করুন। ফোন: ০১৩৪৫৫৮০২০৩। ইমেইল: trustcaredc@gmail.com। মোহাম্মদপুর, ঢাকা।"
        url="https://diagnosticcentercare.lovable.app/contact"
      />
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-16 md:py-20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                {t("contactPage.badge")}
              </span>
              <h1 className="text-display-sm md:text-display-md font-bold mb-4">
                {t("contactPage.title")}
              </h1>
              <p className="text-white/80 text-lg">
                {t("contactPage.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16">
              {contactInfo.map((info, index) => (
                <Card key={index} className="bg-card shadow-card hover:shadow-elevated transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-3">{info.title}</h3>
                    <div className="space-y-1 mb-4">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                      ))}
                    </div>
                    {info.action && (
                      <a
                        href={info.action}
                        target={info.action.startsWith("http") ? "_blank" : undefined}
                        rel={info.action.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        {info.actionText}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Map & Contact Form */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Map */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{t("contactPage.ourLocation")}</h2>
                    <p className="text-sm text-muted-foreground">{t("contactPage.findOnMap")}</p>
                  </div>
                </div>
                
                <div className="rounded-2xl overflow-hidden shadow-card bg-card">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8978509129093!2d90.35817427536584!3d23.75956388912784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf4f7a800001%3A0x7b62c7a5fb2b7e8d!2sMohammadpur%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="TrustCare Location Map"
                    className="w-full"
                  />
                </div>

                <div className="mt-6 p-6 bg-primary/5 rounded-2xl">
                  <h3 className="font-semibold text-foreground mb-4">{t("contactPage.visitUs")}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        {t("contactPage.fullAddress")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <a href="tel:+8801345580203" className="text-foreground hover:text-primary font-medium">
                        +880 1345-580203
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <a href="mailto:trustcaredc@gmail.com" className="text-foreground hover:text-primary">
                        trustcaredc@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-foreground mb-4">{t("contactPage.socialMedia")}</h3>
                  <div className="flex gap-3">
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a 
                      href="https://wa.me/8801345580203" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{t("contactPage.sendMessage")}</h2>
                    <p className="text-sm text-muted-foreground">{t("contactPage.replyIn24")}</p>
                  </div>
                </div>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>{t("contactPage.contactForm")}</CardTitle>
                    <CardDescription>{t("contactPage.contactFormDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t("contactPage.fullName")}</Label>
                          <Input
                            id="name"
                            placeholder={t("contactPage.namePlaceholder")}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={errors.name ? "border-destructive" : ""}
                          />
                          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("contactPage.emailLabel")}</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t("contactPage.emailPlaceholder")}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={errors.email ? "border-destructive" : ""}
                          />
                          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t("contactPage.phoneLabel")}</Label>
                          <Input
                            id="phone"
                            placeholder={t("contactPage.phonePlaceholder")}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={errors.phone ? "border-destructive" : ""}
                          />
                          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">{t("contactPage.subject")}</Label>
                          <Input
                            id="subject"
                            placeholder={t("contactPage.subjectPlaceholder")}
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className={errors.subject ? "border-destructive" : ""}
                          />
                          {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t("contactPage.message")}</Label>
                        <Textarea
                          id="message"
                          placeholder={t("contactPage.messagePlaceholder")}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={5}
                          className={errors.message ? "border-destructive" : ""}
                        />
                        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>{t("contactPage.sending")}</>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            {t("contactPage.send")}
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </div>
    </>
  );
};

export default Contact;
