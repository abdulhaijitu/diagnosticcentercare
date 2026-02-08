import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SEOHead } from "@/components/seo/SEOHead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Stethoscope, SlidersHorizontal, Mic, MicOff } from "lucide-react";
import { useDoctors } from "@/hooks/useAppointments";
import { DoctorCard, DoctorCardProps } from "@/components/doctors/DoctorCard";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

// Mock data for specialties - kept as IDs for filtering, labels from i18n
const specialtyIds = ["all", "general", "cardiology", "dermatology", "orthopedics", "gynecology", "pediatrics", "neurology", "gastroenterology"];

const availabilityIds = ["all", "today", "tomorrow", "weekend"];

// Mock data for doctors
const doctors = [
  { id: 1, name: "Dr. Mohammad Rahman", specialty: "cardiology", specialtyName: "Cardiology", qualification: "MBBS, MD (Cardiology), FCPS", experience: 15, rating: 4.9, reviews: 234, fee: 1200, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face", availability: ["Sunday", "Tuesday", "Thursday"], nextSlot: "Today, 4:00 PM", languages: ["English", "Bengali"], hospital: "TrustCare Diagnostic Center" },
  { id: 2, name: "Dr. Fatima Akter", specialty: "gynecology", specialtyName: "Gynecology & Obstetrics", qualification: "MBBS, MS (Obs & Gyn)", experience: 12, rating: 4.8, reviews: 189, fee: 1000, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face", availability: ["Saturday", "Monday", "Wednesday"], nextSlot: "Tomorrow, 10:00 AM", languages: ["English", "Bengali"], hospital: "TrustCare Diagnostic Center" },
  { id: 3, name: "Dr. Kamal Hossain", specialty: "orthopedics", specialtyName: "Orthopedics", qualification: "MBBS, MS (Ortho), FRCS", experience: 18, rating: 4.9, reviews: 312, fee: 1500, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face", availability: ["Sunday", "Wednesday", "Friday"], nextSlot: "Today, 6:00 PM", languages: ["English", "Bengali", "Hindi"], hospital: "TrustCare Diagnostic Center" },
  { id: 4, name: "Dr. Nusrat Jahan", specialty: "dermatology", specialtyName: "Dermatology", qualification: "MBBS, DDV, MD (Dermatology)", experience: 10, rating: 4.7, reviews: 156, fee: 800, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face", availability: ["Saturday", "Tuesday", "Thursday"], nextSlot: "Tomorrow, 3:00 PM", languages: ["English", "Bengali"], hospital: "TrustCare Diagnostic Center" },
  { id: 5, name: "Dr. Abdul Karim", specialty: "general", specialtyName: "General Physician", qualification: "MBBS, FCPS (Medicine)", experience: 20, rating: 4.8, reviews: 428, fee: 600, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face", availability: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], nextSlot: "Today, 2:00 PM", languages: ["English", "Bengali"], hospital: "TrustCare Diagnostic Center" },
  { id: 6, name: "Dr. Shamima Begum", specialty: "pediatrics", specialtyName: "Pediatrics", qualification: "MBBS, DCH, MD (Pediatrics)", experience: 14, rating: 4.9, reviews: 267, fee: 900, image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&h=300&fit=crop&crop=face", availability: ["Sunday", "Monday", "Wednesday", "Friday"], nextSlot: "Tomorrow, 11:00 AM", languages: ["English", "Bengali"], hospital: "TrustCare Diagnostic Center" },
  { id: 7, name: "Dr. Rafiq Ahmed", specialty: "neurology", specialtyName: "Neurology", qualification: "MBBS, MD (Neurology), MRCP", experience: 16, rating: 4.8, reviews: 198, fee: 1400, image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face", availability: ["Saturday", "Tuesday", "Thursday"], nextSlot: "Saturday, 10:00 AM", languages: ["English", "Bengali"], hospital: "TrustCare Diagnostic Center" },
  { id: 8, name: "Dr. Tahmina Islam", specialty: "gastroenterology", specialtyName: "Gastroenterology", qualification: "MBBS, MD (Gastro), FCPS", experience: 11, rating: 4.7, reviews: 143, fee: 1100, image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop&crop=face", availability: ["Sunday", "Wednesday", "Friday"], nextSlot: "Today, 5:00 PM", languages: ["English", "Bengali"], hospital: "TrustCare Diagnostic Center" },
];

const specialtyLabels: Record<string, string> = {
  all: "All Specialties", general: "General Physician", cardiology: "Cardiology",
  dermatology: "Dermatology", orthopedics: "Orthopedics", gynecology: "Gynecology",
  pediatrics: "Pediatrics", neurology: "Neurology", gastroenterology: "Gastroenterology",
};

const Doctors = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { doctors: dbDoctors, isLoading } = useDoctors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");

  const { isListening, isSupported, transcript, startListening, stopListening } = useVoiceSearch({
    language: "bn-BD",
    onResult: (text) => {
      setSearchQuery(text);
      toast({ title: t("doctorsPage.voiceSearch"), description: `"${text}" ${t("doctorsPage.searchingFor")}` });
    },
    onError: (error) => {
      toast({ title: t("doctorsPage.voiceSearch"), description: error, variant: "destructive" });
    },
  });

  const allDoctors = [
    ...doctors,
    ...dbDoctors.map((doc) => ({
      id: doc.id, name: doc.name,
      specialty: doc.specialty.toLowerCase().replace(/\s+/g, ""),
      specialtyName: doc.specialty, qualification: doc.qualification || "",
      experience: doc.experience_years || 0, rating: 4.8,
      reviews: Math.floor(Math.random() * 200) + 50, fee: doc.consultation_fee,
      image: doc.avatar_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      availability: doc.available_days.map(d => d.charAt(0).toUpperCase() + d.slice(1)),
      nextSlot: "Available", languages: ["English", "Bengali"],
      hospital: "TrustCare Diagnostic Center", isFromDb: true, dbId: doc.id,
    })),
  ];

  const filteredDoctors = allDoctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || doctor.specialtyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    let matchesAvailability = true;
    if (selectedAvailability === "today") matchesAvailability = doctor.nextSlot.includes("Today") || doctor.nextSlot === "Available";
    else if (selectedAvailability === "tomorrow") matchesAvailability = doctor.nextSlot.includes("Tomorrow") || doctor.nextSlot === "Available";
    else if (selectedAvailability === "weekend") matchesAvailability = doctor.availability.includes("Saturday") || doctor.availability.includes("Friday");
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  const handleBookAppointment = (doctor: DoctorCardProps) => {
    if (doctor.isFromDb && doctor.dbId) navigate(`/book-appointment?doctor=${doctor.dbId}`);
    else navigate("/book-appointment");
  };

  const availabilityLabels: Record<string, string> = {
    all: t("doctorsPage.anyDay"), today: t("doctorsPage.today"),
    tomorrow: t("doctorsPage.tomorrow"), weekend: t("doctorsPage.weekend"),
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-4">{t("doctorsPage.specialty")}</h3>
        <ul className="space-y-2">
          {specialtyIds.map((id) => (
            <li key={id}>
              <button
                onClick={() => setSelectedSpecialty(id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  selectedSpecialty === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {id === "all" ? t("doctorsPage.allSpecialties") : specialtyLabels[id]}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-4 border-t border-border">
        <h3 className="font-semibold text-foreground mb-4">{t("doctorsPage.availability")}</h3>
        <ul className="space-y-2">
          {availabilityIds.map((id) => (
            <li key={id}>
              <button
                onClick={() => setSelectedAvailability(id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  selectedAvailability === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {availabilityLabels[id]}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {(selectedSpecialty !== "all" || selectedAvailability !== "all") && (
        <Button variant="outline" className="w-full" onClick={() => { setSelectedSpecialty("all"); setSelectedAvailability("all"); }}>
          {t("doctorsPage.clearFilters")}
        </Button>
      )}
    </div>
  );

  return (
    <>
      <SEOHead title="Our Doctors" titleBn="আমাদের ডাক্তারগণ" description="Book appointments with experienced specialist doctors at TrustCare." descriptionBn="ট্রাস্ট কেয়ারে অভিজ্ঞ বিশেষজ্ঞ ডাক্তারদের সাথে অ্যাপয়েন্টমেন্ট নিন।" url="https://diagnosticcentercare.lovable.app/doctors" />
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero text-white py-16 md:py-20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                {t("doctorsPage.badge")}
              </span>
              <h1 className="text-display-sm md:text-display-md font-bold mb-4">{t("doctorsPage.title")}</h1>
              <p className="text-white/80 text-lg mb-8">{t("doctorsPage.subtitle")}</p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="text" placeholder={isListening ? t("doctorsPage.listening") : t("doctorsPage.searchPlaceholder")} value={isListening ? transcript || searchQuery : searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 pr-14 h-14 rounded-xl bg-white text-foreground border-0 shadow-elevated" />
                {isSupported && (
                  <Button type="button" size="icon" variant={isListening ? "default" : "ghost"} onClick={isListening ? stopListening : startListening} className={`absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg transition-all ${isListening ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "hover:bg-muted"}`} title={isListening ? t("doctorsPage.stopListening") : t("doctorsPage.voiceSearch")}>
                    {isListening ? <MicOff className="h-5 w-5 text-destructive-foreground" /> : <Mic className="h-5 w-5 text-muted-foreground" />}
                  </Button>
                )}
              </div>
              {isListening && <p className="text-white/80 text-sm mt-3 animate-pulse">🎤 {t("doctorsPage.listening")} "{transcript || "..."}"</p>}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      {t("doctorsPage.filterDoctors")}
                      {(selectedSpecialty !== "all" || selectedAvailability !== "all") && (
                        <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                          {(selectedSpecialty !== "all" ? 1 : 0) + (selectedAvailability !== "all" ? 1 : 0)}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader><SheetTitle>{t("common.filter")}</SheetTitle></SheetHeader>
                    <div className="mt-6"><FilterSidebar /></div>
                  </SheetContent>
                </Sheet>
              </div>

              <aside className="hidden lg:block lg:w-72 flex-shrink-0">
                <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24">
                  <FilterSidebar />
                </div>
              </aside>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    {t("doctorsPage.showing")} <span className="font-semibold text-foreground">{filteredDoctors.length}</span> {t("doctorsPage.doctorsFound")}
                  </p>
                </div>
                <div className="grid gap-6">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} onBookAppointment={handleBookAppointment} />
                  ))}
                </div>
                {filteredDoctors.length === 0 && (
                  <div className="text-center py-16">
                    <Stethoscope className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{t("doctorsPage.noResults")}</h3>
                    <p className="text-muted-foreground">{t("doctorsPage.noResultsDesc")}</p>
                  </div>
                )}
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

export default Doctors;
