import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { DoctorsSection } from "@/components/home/DoctorsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SEOHead } from "@/components/seo/SEOHead";

const Index = () => {
  return (
    <>
      <SEOHead
        title="Fast & Accurate Lab Service"
        titleBn="দ্রুত ও নির্ভুল ল্যাব সার্ভিস"
        description="TrustCare Diagnostic Center - Your trusted partner for blood tests, X-ray, Ultrasound, ECG & Health Checkups in Dhaka. Home sample collection available."
        descriptionBn="ট্রাস্ট কেয়ার ডায়াগনোস্টিক সেন্টার - রক্ত পরীক্ষা, এক্স-রে, আল্ট্রাসাউন্ড, ইসিজি ও হেলথ চেকআপ। হোম স্যাম্পল কালেকশন সুবিধা আছে।"
        url="https://diagnosticcentercare.lovable.app"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <ServicesSection />
          <DoctorsSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </>
  );
};

export default Index;
