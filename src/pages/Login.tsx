import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import trustCareLogo from "@/assets/trust-care-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: t("login.loginFailed"),
        description: error.message || t("login.invalidCredentials"),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: t("login.welcomeBackSuccess"),
      description: t("login.loginSuccess"),
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="Login"
        titleBn="লগইন"
        description="Sign in to your TrustCare account. Access your health reports, track sample collections and manage doctor appointments."
        descriptionBn="আপনার TrustCare একাউন্টে সাইন ইন করুন। হেলথ রিপোর্ট দেখুন, স্যাম্পল কালেকশন ট্র্যাক করুন এবং ডাক্তার অ্যাপয়েন্টমেন্ট ম্যানেজ করুন।"
        noIndex={true}
      />
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl shadow-elevated p-8 md:p-10 border border-border">
            <div className="text-center mb-8">
              <img 
                src={trustCareLogo} 
                alt="TrustCare Logo" 
                className="h-16 w-auto mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t("login.welcomeBack")}
              </h1>
              <p className="text-muted-foreground">
                {t("login.signInDesc")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("login.emailAddress")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("login.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t("login.password")}
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 rounded-xl"
                    required
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
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("login.signingIn")}
                  </>
                ) : (
                  <>
                    {t("login.signIn")}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">{t("login.or")}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <p className="text-center text-muted-foreground">
              {t("login.noAccount")}{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                {t("login.createAccount")}
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>{t("login.secureLogin")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>{t("login.sslEncryption")}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
