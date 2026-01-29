import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  GraduationCap, 
  MapPin, 
  Calendar,
  Phone,
  Mail,
  Award,
  Briefcase,
  Languages,
  CheckCircle2,
  MessageSquare,
  ThumbsUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/hooks/useAppointments";

// Mock reviews data - in production, this would come from database
const mockReviews = [
  {
    id: 1,
    patientName: "Rahim Khan",
    rating: 5,
    date: "2026-01-15",
    comment: "ডাক্তার সাহেব অত্যন্ত অভিজ্ঞ এবং সহানুভূতিশীল। আমার সমস্যা ভালোভাবে শুনে সঠিক চিকিৎসা দিয়েছেন।",
    helpful: 24,
  },
  {
    id: 2,
    patientName: "Fatima Begum",
    rating: 5,
    date: "2026-01-10",
    comment: "Very professional and thorough. Explained everything clearly and patiently answered all my questions.",
    helpful: 18,
  },
  {
    id: 3,
    patientName: "Kamal Hossain",
    rating: 4,
    date: "2026-01-05",
    comment: "Good experience overall. The doctor was knowledgeable and the treatment was effective.",
    helpful: 12,
  },
  {
    id: 4,
    patientName: "Nasreen Akter",
    rating: 5,
    date: "2025-12-28",
    comment: "চমৎকার ডাক্তার। সময়মতো দেখেছেন এবং সঠিক পরামর্শ দিয়েছেন।",
    helpful: 31,
  },
];

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: number | null;
  description: string | null;
}

interface Experience {
  id: string;
  position: string;
  organization: string;
  start_year: number;
  end_year: number | null;
  is_current: boolean;
  description: string | null;
}

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      
      try {
        // Fetch doctor details
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctors" as any)
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (doctorError) throw doctorError;
        setDoctor(doctorData as unknown as Doctor);

        // Fetch education
        const { data: eduData, error: eduError } = await supabase
          .from("doctor_education" as any)
          .select("*")
          .eq("doctor_id", id)
          .order("year", { ascending: false });

        if (!eduError && eduData) {
          setEducation(eduData as unknown as Education[]);
        }

        // Fetch experience
        const { data: expData, error: expError } = await supabase
          .from("doctor_experience" as any)
          .select("*")
          .eq("doctor_id", id)
          .order("start_year", { ascending: false });

        if (!expError && expData) {
          setExperience(expData as unknown as Experience[]);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBookAppointment = () => {
    navigate(`/book-appointment?doctor=${id}`);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container-custom py-8">
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <div className="grid lg:grid-cols-3 gap-8">
              <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container-custom py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Doctor not found</h2>
            <p className="text-muted-foreground mb-6">The doctor you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/doctors")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Doctors
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const averageRating = mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-12 md:py-16">
          <div className="container-custom">
            <Button 
              variant="ghost" 
              className="text-white/80 hover:text-white hover:bg-white/10 mb-6"
              onClick={() => navigate("/doctors")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Doctors
            </Button>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Doctor Image */}
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white/20 shadow-elevated">
                <AvatarImage src={doctor.avatar_url || undefined} alt={doctor.name} />
                <AvatarFallback className="text-3xl bg-primary-foreground text-primary">
                  {doctor.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>

              {/* Doctor Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-display-sm font-bold">{doctor.name}</h1>
                  <Badge className="bg-success/20 text-success border-success/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <p className="text-xl text-white/90 mb-4">{doctor.specialty}</p>
                
                <div className="flex flex-wrap gap-6 text-sm text-white/80 mb-6">
                  {doctor.qualification && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{doctor.qualification}</span>
                    </div>
                  )}
                  {doctor.experience_years && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{doctor.experience_years}+ years experience</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>TrustCare Diagnostic Center</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded-full">
                    <Star className="h-5 w-5 text-accent fill-accent" />
                    <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                    <span className="text-white/70">({mockReviews.length} reviews)</span>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-full">
                    <span className="text-white/70">Consultation Fee: </span>
                    <span className="font-bold text-lg">৳{doctor.consultation_fee}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                    <TabsTrigger value="education" className="rounded-lg">Education</TabsTrigger>
                    <TabsTrigger value="experience" className="rounded-lg">Experience</TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-6 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          About
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {doctor.bio || 
                            `${doctor.name} is a highly experienced ${doctor.specialty} specialist with over ${doctor.experience_years || 10} years of clinical practice. Known for providing compassionate, patient-centered care and staying current with the latest medical advancements. Committed to delivering accurate diagnoses and effective treatment plans for all patients.`
                          }
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Languages className="h-5 w-5 text-primary" />
                          Languages
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {["Bengali", "English"].map((lang) => (
                            <Badge key={lang} variant="secondary" className="px-3 py-1">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          Specializations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="px-3 py-1">{doctor.specialty}</Badge>
                          <Badge variant="outline" className="px-3 py-1">Preventive Care</Badge>
                          <Badge variant="outline" className="px-3 py-1">Diagnosis</Badge>
                          <Badge variant="outline" className="px-3 py-1">Treatment Planning</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Education Tab */}
                  <TabsContent value="education" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          Education & Qualifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {education.length > 0 ? (
                          <div className="space-y-6">
                            {education.map((edu) => (
                              <div key={edu.id} className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                  <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                                  <p className="text-muted-foreground">{edu.institution}</p>
                                  {edu.year && <p className="text-sm text-muted-foreground">{edu.year}</p>}
                                  {edu.description && <p className="text-sm text-muted-foreground mt-1">{edu.description}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-4">No education information available.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Experience Tab */}
                  <TabsContent value="experience" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          Work Experience
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {experience.length > 0 ? (
                          <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />
                            
                            <div className="space-y-8">
                              {experience.map((exp) => (
                                <div key={exp.id} className="flex gap-4 relative">
                                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                                    exp.is_current ? "bg-primary text-primary-foreground" : "bg-muted"
                                  }`}>
                                    <Briefcase className="h-5 w-5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold text-foreground">{exp.position}</h4>
                                      {exp.is_current && (
                                        <Badge className="bg-success/10 text-success border-success/20">
                                          Current
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-muted-foreground">{exp.organization}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {exp.start_year} - {exp.is_current ? "Present" : exp.end_year}
                                    </p>
                                    {exp.description && <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-4">No experience information available.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="mt-6 space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-primary" />
                            Patient Reviews
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= Math.round(averageRating) ? "text-accent fill-accent" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                            <span className="text-muted-foreground">({mockReviews.length})</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {mockReviews.map((review) => (
                          <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-medium text-foreground">{review.patientName}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                  })}
                                </p>
                              </div>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`h-4 w-4 ${star <= review.rating ? "text-accent fill-accent" : "text-muted-foreground"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-3">{review.comment}</p>
                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              <span>Helpful ({review.helpful})</span>
                            </button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Booking Card */}
              <div className="space-y-6">
                <Card className="sticky top-24 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Book Appointment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Availability */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Available Days</h4>
                      <div className="flex flex-wrap gap-2">
                        {doctor.available_days.map((day) => (
                          <Badge key={day} variant="secondary" className="capitalize">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Timing */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Timing</h4>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(doctor.available_from)} - {formatTime(doctor.available_to)}</span>
                      </div>
                    </div>

                    {/* Fee */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-muted-foreground">Consultation Fee</span>
                        <span className="text-2xl font-bold text-foreground">৳{doctor.consultation_fee}</span>
                      </div>
                      <Button className="w-full" size="lg" onClick={handleBookAppointment}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <a 
                      href="tel:+8801234567890" 
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Call us</p>
                        <p className="font-medium text-foreground">+880 1234-567890</p>
                      </div>
                    </a>
                    <a 
                      href="mailto:info@trustcare.com" 
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email us</p>
                        <p className="font-medium text-foreground">info@trustcare.com</p>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorProfile;
