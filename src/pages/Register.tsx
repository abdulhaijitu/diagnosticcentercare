import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { 
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, 
  CheckCircle2, Shield, Clock, Award, Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.name,
      formData.phone
    );

    if (error) {
      toast({
        title: t("register.registrationFailed"),
        description: error.message || t("register.failedToCreate"),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: t("register.accountCreated"),
      description: t("register.registerSuccess"),
    });

    navigate("/");
  };

  const benefits = [
    { icon: Shield, text: t("register.secureRecords") },
    { icon: Clock, text: t("register.quickBooking") },
    { icon: Award, text: t("register.easyAccess") },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="Create Account"
        titleBn="একাউন্ট তৈরি করুন"
        description="Register for a free TrustCare account. Book diagnostic tests, schedule doctor appointments and access health reports online."
        descriptionBn="বিনামূল্যে TrustCare একাউন্ট তৈরি করুন। ডায়াগনস্টিক টেস্ট বুক করুন, ডাক্তার অ্যাপয়েন্টমেন্ট নিন এবং অনলাইনে হেলথ রিপোর্ট দেখুন।"
        noIndex={true}
      />
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Benefits Section */}
            <div className="hidden lg:block">
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
                {t("register.joinTrustCare")}
              </span>
              <h1 className="text-display-sm font-bold text-foreground mb-6">
                {t("register.healthJourney")}
              </h1>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                {t("register.healthJourneyDesc")}
              </p>

              <div className="space-y-6">
                {benefits.map((benefit) => (
                  <div key={benefit.text} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-border grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-bold text-primary">10,000+</p>
                  <p className="text-sm text-muted-foreground">{t("register.patients")}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">100+</p>
                  <p className="text-sm text-muted-foreground">{t("register.tests")}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">20+</p>
                  <p className="text-sm text-muted-foreground">{t("doctorsSection.badge")}</p>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="w-full max-w-md mx-auto lg:max-w-none">
              <div className="bg-card rounded-3xl shadow-elevated p-8 md:p-10 border border-border">
                <div className="text-center mb-8 lg:text-left">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {t("register.createAccount")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("register.fillDetails")}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      {t("register.fullName")}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={t("register.fullNamePlaceholder")}
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-12 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t("register.emailAddress")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-12 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      {t("register.phoneNumber")}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder={t("register.phonePlaceholder")}
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-12 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      {t("register.password")}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("register.passwordPlaceholder")}
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-12 pr-12 h-12 rounded-xl"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("register.passwordHint")}
                    </p>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("register.creatingAccount")}
                      </>
                    ) : (
                      <>
                        {t("register.createAccount")}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    {t("register.agreeTerms")}{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      {t("register.termsOfService")}
                    </Link>{" "}
                    {t("register.and")}{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      {t("register.privacyPolicy")}
                    </Link>
                  </p>
                </form>

                <div className="my-8 flex items-center gap-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">{t("register.or")}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <p className="text-center text-muted-foreground">
                  {t("register.haveAccount")}{" "}
                  <Link to="/login" className="text-primary font-semibold hover:underline">
                    {t("register.signIn")}
                  </Link>
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{t("register.freeRegistration")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{t("register.dataProtected")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
