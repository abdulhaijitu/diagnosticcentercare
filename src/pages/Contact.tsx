import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Building2,
  ArrowRight,
  Facebook,
  MessageCircle
} from "lucide-react";

// Validation schema
const contactSchema = z.object({
  name: z.string().trim().min(1, "নাম আবশ্যক").max(100, "নাম ১০০ অক্ষরের মধ্যে হতে হবে"),
  email: z.string().trim().email("সঠিক ইমেইল দিন").max(255, "ইমেইল ২৫৫ অক্ষরের মধ্যে হতে হবে"),
  phone: z.string().trim().max(20, "ফোন নম্বর ২০ অক্ষরের মধ্যে হতে হবে").optional().or(z.literal("")),
  subject: z.string().trim().min(1, "বিষয় আবশ্যক").max(200, "বিষয় ২০০ অক্ষরের মধ্যে হতে হবে"),
  message: z.string().trim().min(1, "বার্তা আবশ্যক").max(2000, "বার্তা ২০০০ অক্ষরের মধ্যে হতে হবে"),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
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
      // Save to database
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

      toast({
        title: "বার্তা পাঠানো হয়েছে!",
        description: "যোগাযোগ করার জন্য ধন্যবাদ। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "ত্রুটি হয়েছে",
        description: "বার্তা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "ফোন",
      titleEn: "Phone",
      details: ["+880 1345-580203"],
      action: "tel:+8801345580203",
      actionText: "এখনই কল করুন",
    },
    {
      icon: Mail,
      title: "ইমেইল",
      titleEn: "Email",
      details: ["trustcaredc@gmail.com"],
      action: "mailto:trustcaredc@gmail.com",
      actionText: "ইমেইল পাঠান",
    },
    {
      icon: MapPin,
      title: "ঠিকানা",
      titleEn: "Address",
      details: [
        "প্লট-০৪, ব্লক-এফ",
        "ঢাকা উদ্দান সমবায় আবাসন সমিতি লিমিটেড",
        "চন্দ্রিমা মডেল টাউন, অ্যাভিনিউ-১ গেট চৌরাস্তা",
        "মোহাম্মদপুর, ঢাকা-১২০৭",
      ],
      action: "https://maps.google.com/?q=23.7595,90.3600",
      actionText: "দিকনির্দেশনা নিন",
    },
    {
      icon: Clock,
      title: "কাজের সময়",
      titleEn: "Working Hours",
      details: [
        "শনি - বৃহস্পতি: সকাল ৭:০০ - রাত ১০:০০",
        "শুক্রবার: বিকাল ৩:০০ - রাত ১০:০০",
      ],
      action: null,
      actionText: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-16 md:py-20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                যোগাযোগ করুন
              </span>
              <h1 className="text-display-sm md:text-display-md font-bold mb-4">
                আমাদের সাথে যোগাযোগ করুন
              </h1>
              <p className="text-white/80 text-lg">
                কোনো প্রশ্ন বা সহায়তা প্রয়োজন? আমরা সাহায্য করতে এখানে আছি। নিচের যেকোনো 
                মাধ্যমে আমাদের সাথে যোগাযোগ করুন অথবা ফর্ম পূরণ করুন।
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
                    <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{info.titleEn}</p>
                    <div className="space-y-1 mb-4">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
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
                    <h2 className="text-xl font-bold text-foreground">আমাদের অবস্থান</h2>
                    <p className="text-sm text-muted-foreground">মানচিত্রে আমাদের খুঁজুন</p>
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

                {/* Quick Info Below Map */}
                <div className="mt-6 p-6 bg-primary/5 rounded-2xl">
                  <h3 className="font-semibold text-foreground mb-4">আমাদের সেন্টারে আসুন</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        প্লট-০৪, ব্লক-এফ, ঢাকা উদ্দান সমবায় আবাসন সমিতি লিমিটেড,
                        চন্দ্রিমা মডেল টাউন, অ্যাভিনিউ-১ গেট চৌরাস্তা, মোহাম্মদপুর, ঢাকা-১২০৭
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

                {/* Social Links */}
                <div className="mt-6">
                  <h3 className="font-semibold text-foreground mb-4">সোশ্যাল মিডিয়ায় আমরা</h3>
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
                    <h2 className="text-xl font-bold text-foreground">বার্তা পাঠান</h2>
                    <p className="text-sm text-muted-foreground">২৪ ঘন্টার মধ্যে উত্তর দেব</p>
                  </div>
                </div>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>যোগাযোগ ফর্ম</CardTitle>
                    <CardDescription>
                      নিচের ফর্মটি পূরণ করুন এবং আমাদের দল যত তাড়াতাড়ি সম্ভব আপনার সাথে যোগাযোগ করবে।
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">পুরো নাম *</Label>
                          <Input
                            id="name"
                            placeholder="আপনার নাম লিখুন"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={errors.name ? "border-destructive" : ""}
                          />
                          {errors.name && (
                            <p className="text-xs text-destructive">{errors.name}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">ইমেইল *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="আপনার ইমেইল লিখুন"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={errors.email ? "border-destructive" : ""}
                          />
                          {errors.email && (
                            <p className="text-xs text-destructive">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">ফোন নম্বর</Label>
                          <Input
                            id="phone"
                            placeholder="আপনার ফোন নম্বর"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={errors.phone ? "border-destructive" : ""}
                          />
                          {errors.phone && (
                            <p className="text-xs text-destructive">{errors.phone}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">বিষয় *</Label>
                          <Input
                            id="subject"
                            placeholder="কি বিষয়ে জানতে চান?"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className={errors.subject ? "border-destructive" : ""}
                          />
                          {errors.subject && (
                            <p className="text-xs text-destructive">{errors.subject}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">বার্তা *</Label>
                        <Textarea
                          id="message"
                          placeholder="আপনার বার্তা এখানে লিখুন..."
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className={errors.message ? "border-destructive" : ""}
                        />
                        {errors.message && (
                          <p className="text-xs text-destructive">{errors.message}</p>
                        )}
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>পাঠানো হচ্ছে...</>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            বার্তা পাঠান
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* FAQ Teaser */}
                <div className="mt-6 p-6 bg-accent/10 rounded-2xl border border-accent/20">
                  <h3 className="font-semibold text-foreground mb-2">সাধারণ জিজ্ঞাসা</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    হোম কালেকশন, রিপোর্ট সংগ্রহ এবং অ্যাপয়েন্টমেন্ট সম্পর্কে প্রশ্ন আছে?
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      হোম কালেকশন সেবা সকাল ৭টা থেকে রাত ১০টা পর্যন্ত পাওয়া যায়
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      রিপোর্ট সাধারণত ২৪-৪৮ ঘন্টার মধ্যে তৈরি হয়
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      অনলাইনে রিপোর্ট ডাউনলোড করতে পারবেন
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact Banner */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">জরুরি সহায়তা প্রয়োজন?</h2>
                <p className="text-primary-foreground/80">
                  হোম কালেকশন সেবা এবং জরুরি প্রশ্নের জন্য আমাদের দল সবসময় প্রস্তুত।
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a href="tel:+8801345580203">
                  <Button variant="secondary" size="lg">
                    <Phone className="h-5 w-5 mr-2" />
                    কল করুন: ০১৩৪৫-৫৮০২০৩
                  </Button>
                </a>
                <a href="https://wa.me/8801345580203" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="bg-white/10 border-white/20 hover:bg-white/20">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
