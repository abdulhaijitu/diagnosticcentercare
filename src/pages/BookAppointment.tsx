import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SEOHead } from "@/components/seo/SEOHead";
import { AppointmentBookingForm } from "@/components/appointments/AppointmentBookingForm";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarCheck, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

const BookAppointment = () => {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="Book Doctor Appointment"
        titleBn="ডক্টর অ্যাপয়েন্টমেন্ট বুক করুন"
        description="Book online appointment with experienced specialist doctors."
        descriptionBn="অভিজ্ঞ বিশেষজ্ঞ ডাক্তারদের সাথে অনলাইন অ্যাপয়েন্টমেন্ট বুক করুন।"
        url="https://diagnosticcentercare.lovable.app/book-appointment"
      />
      <Header />
      <main className="flex-1 section-padding">
        <div className="container-custom">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CalendarCheck className="h-4 w-4" />
              {t("bookAppointmentPage.badge")}
            </div>
            <h1 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              {t("bookAppointmentPage.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("bookAppointmentPage.subtitle")}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : user ? (
            <AppointmentBookingForm />
          ) : (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{t("bookAppointmentPage.loginRequired")}</h2>
              <p className="text-muted-foreground mb-6">
                {t("bookAppointmentPage.loginDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/login">{t("bookAppointmentPage.logIn")}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/register">{t("bookAppointmentPage.createAccount")}</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default BookAppointment;
