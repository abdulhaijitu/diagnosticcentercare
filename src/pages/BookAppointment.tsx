import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SEOHead } from "@/components/seo/SEOHead";
import { AppointmentBookingForm } from "@/components/appointments/AppointmentBookingForm";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarCheck, LogIn } from "lucide-react";

const BookAppointment = () => {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="Book Doctor Appointment"
        titleBn="ডক্টর অ্যাপয়েন্টমেন্ট বুক করুন"
        description="Book online appointment with experienced specialist doctors. Cardiology, medicine, orthopedics, gynecology and more. Same day appointments available."
        descriptionBn="অভিজ্ঞ বিশেষজ্ঞ ডাক্তারদের সাথে অনলাইন অ্যাপয়েন্টমেন্ট বুক করুন। কার্ডিওলজি, মেডিসিন, অর্থোপেডিক্স, গাইনি এবং আরও। একই দিনে অ্যাপয়েন্টমেন্ট পাওয়া যায়।"
        keywords="book doctor appointment dhaka, online doctor booking, specialist doctor, cardiologist, gynecologist, orthopedic, same day appointment"
        url="https://diagnosticcentercare.lovable.app/book-appointment"
      />
      <Header />
      <main className="flex-1 section-padding">
        <div className="container-custom">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CalendarCheck className="h-4 w-4" />
              Doctor Consultation
            </div>
            <h1 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              Book an Appointment
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Schedule a consultation with our experienced doctors. Choose your preferred date and time.
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
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-6">
                Please log in or create an account to book an appointment with our doctors.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/register">Create Account</Link>
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
