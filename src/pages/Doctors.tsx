import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Stethoscope, 
  Clock, 
  Calendar,
  Star,
  GraduationCap,
  MapPin,
  User,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

// Mock data for specialties
const specialties = [
  { id: "all", name: "All Specialties" },
  { id: "general", name: "General Physician" },
  { id: "cardiology", name: "Cardiology" },
  { id: "dermatology", name: "Dermatology" },
  { id: "orthopedics", name: "Orthopedics" },
  { id: "gynecology", name: "Gynecology" },
  { id: "pediatrics", name: "Pediatrics" },
  { id: "neurology", name: "Neurology" },
  { id: "gastroenterology", name: "Gastroenterology" },
];

const availabilityOptions = [
  { id: "all", name: "Any Day" },
  { id: "today", name: "Today" },
  { id: "tomorrow", name: "Tomorrow" },
  { id: "weekend", name: "Weekend" },
];

// Mock data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr. Mohammad Rahman",
    specialty: "cardiology",
    specialtyName: "Cardiology",
    qualification: "MBBS, MD (Cardiology), FCPS",
    experience: 15,
    rating: 4.9,
    reviews: 234,
    fee: 1200,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    availability: ["Sunday", "Tuesday", "Thursday"],
    nextSlot: "Today, 4:00 PM",
    languages: ["English", "Bengali"],
    hospital: "TrustCare Diagnostic Center",
  },
  {
    id: 2,
    name: "Dr. Fatima Akter",
    specialty: "gynecology",
    specialtyName: "Gynecology & Obstetrics",
    qualification: "MBBS, MS (Obs & Gyn)",
    experience: 12,
    rating: 4.8,
    reviews: 189,
    fee: 1000,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face",
    availability: ["Saturday", "Monday", "Wednesday"],
    nextSlot: "Tomorrow, 10:00 AM",
    languages: ["English", "Bengali"],
    hospital: "TrustCare Diagnostic Center",
  },
  {
    id: 3,
    name: "Dr. Kamal Hossain",
    specialty: "orthopedics",
    specialtyName: "Orthopedics",
    qualification: "MBBS, MS (Ortho), FRCS",
    experience: 18,
    rating: 4.9,
    reviews: 312,
    fee: 1500,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
    availability: ["Sunday", "Wednesday", "Friday"],
    nextSlot: "Today, 6:00 PM",
    languages: ["English", "Bengali", "Hindi"],
    hospital: "TrustCare Diagnostic Center",
  },
  {
    id: 4,
    name: "Dr. Nusrat Jahan",
    specialty: "dermatology",
    specialtyName: "Dermatology",
    qualification: "MBBS, DDV, MD (Dermatology)",
    experience: 10,
    rating: 4.7,
    reviews: 156,
    fee: 800,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    availability: ["Saturday", "Tuesday", "Thursday"],
    nextSlot: "Tomorrow, 3:00 PM",
    languages: ["English", "Bengali"],
    hospital: "TrustCare Diagnostic Center",
  },
  {
    id: 5,
    name: "Dr. Abdul Karim",
    specialty: "general",
    specialtyName: "General Physician",
    qualification: "MBBS, FCPS (Medicine)",
    experience: 20,
    rating: 4.8,
    reviews: 428,
    fee: 600,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face",
    availability: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    nextSlot: "Today, 2:00 PM",
    languages: ["English", "Bengali"],
    hospital: "TrustCare Diagnostic Center",
  },
  {
    id: 6,
    name: "Dr. Shamima Begum",
    specialty: "pediatrics",
    specialtyName: "Pediatrics",
    qualification: "MBBS, DCH, MD (Pediatrics)",
    experience: 14,
    rating: 4.9,
    reviews: 267,
    fee: 900,
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&h=300&fit=crop&crop=face",
    availability: ["Sunday", "Monday", "Wednesday", "Friday"],
    nextSlot: "Tomorrow, 11:00 AM",
    languages: ["English", "Bengali"],
    hospital: "TrustCare Diagnostic Center",
  },
  {
    id: 7,
    name: "Dr. Rafiq Ahmed",
    specialty: "neurology",
    specialtyName: "Neurology",
    qualification: "MBBS, MD (Neurology), MRCP",
    experience: 16,
    rating: 4.8,
    reviews: 198,
    fee: 1400,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
    availability: ["Saturday", "Tuesday", "Thursday"],
    nextSlot: "Saturday, 10:00 AM",
    languages: ["English", "Bengali"],
    hospital: "TrustCare Diagnostic Center",
  },
  {
    id: 8,
    name: "Dr. Tahmina Islam",
    specialty: "gastroenterology",
    specialtyName: "Gastroenterology",
    qualification: "MBBS, MD (Gastro), FCPS",
    experience: 11,
    rating: 4.7,
    reviews: 143,
    fee: 1100,
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop&crop=face",
    availability: ["Sunday", "Wednesday", "Friday"],
    nextSlot: "Today, 5:00 PM",
    languages: ["English", "Bengali"],
    hospital: "TrustCare Diagnostic Center",
  },
];

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    reason: "",
  });

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialtyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    
    // Simple availability filter logic
    let matchesAvailability = true;
    if (selectedAvailability === "today") {
      matchesAvailability = doctor.nextSlot.includes("Today");
    } else if (selectedAvailability === "tomorrow") {
      matchesAvailability = doctor.nextSlot.includes("Tomorrow");
    } else if (selectedAvailability === "weekend") {
      matchesAvailability = doctor.availability.includes("Saturday") || doctor.availability.includes("Friday");
    }
    
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  const handleBookAppointment = (doctor: typeof doctors[0]) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking with Lovable Cloud
    console.log("Appointment booked:", { doctor: selectedDoctor, ...bookingData });
    setIsBookingOpen(false);
    setSelectedDoctor(null);
    setBookingData({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      reason: "",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-16 md:py-20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                20+ Expert Doctors
              </span>
              <h1 className="text-display-sm md:text-display-md font-bold mb-4">
                Find Your Doctor
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Book appointments with experienced specialists. Get expert care 
                for all your health concerns.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by doctor name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-xl bg-white text-foreground border-0 shadow-elevated"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Filters */}
              <aside className="lg:w-72 flex-shrink-0">
                <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24 space-y-6">
                  {/* Specialty Filter */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Specialty</h3>
                    <ul className="space-y-2">
                      {specialties.map((specialty) => (
                        <li key={specialty.id}>
                          <button
                            onClick={() => setSelectedSpecialty(specialty.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                              selectedSpecialty === specialty.id
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {specialty.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Availability Filter */}
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-4">Availability</h3>
                    <ul className="space-y-2">
                      {availabilityOptions.map((option) => (
                        <li key={option.id}>
                          <button
                            onClick={() => setSelectedAvailability(option.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                              selectedAvailability === option.id
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {option.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>

              {/* Doctors Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredDoctors.length}</span> doctors
                  </p>
                </div>

                <div className="grid gap-6">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Doctor Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-32 h-32 rounded-2xl object-cover"
                          />
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">{doctor.name}</h3>
                              <p className="text-primary font-medium">{doctor.specialtyName}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-full">
                              <Star className="h-4 w-4 text-accent fill-accent" />
                              <span className="font-semibold text-accent">{doctor.rating}</span>
                              <span className="text-muted-foreground text-sm">({doctor.reviews})</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1.5">
                              <GraduationCap className="h-4 w-4" />
                              <span>{doctor.qualification}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span>{doctor.experience} years exp.</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span>{doctor.hospital}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {doctor.availability.map((day) => (
                              <Badge key={day} variant="outline" className="text-xs">
                                {day}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Consultation Fee</p>
                                <p className="text-xl font-bold text-foreground">৳{doctor.fee}</p>
                              </div>
                              <div className="pl-4 border-l border-border">
                                <p className="text-sm text-muted-foreground">Next Available</p>
                                <p className="text-sm font-medium text-success flex items-center gap-1">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  {doctor.nextSlot}
                                </p>
                              </div>
                            </div>
                            <Button onClick={() => handleBookAppointment(doctor)}>
                              Book Appointment
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredDoctors.length === 0 && (
                  <div className="text-center py-16">
                    <Stethoscope className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No doctors found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Booking Dialog */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Book Appointment</DialogTitle>
              <DialogDescription>
                {selectedDoctor && `Schedule your consultation with ${selectedDoctor.name}`}
              </DialogDescription>
            </DialogHeader>

            {selectedDoctor && (
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl mb-4">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{selectedDoctor.name}</h4>
                  <p className="text-sm text-primary">{selectedDoctor.specialtyName}</p>
                  <p className="text-sm text-muted-foreground">Fee: ৳{selectedDoctor.fee}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apt-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="apt-name"
                    placeholder="Enter your full name"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apt-phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="apt-phone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="apt-email"
                      type="email"
                      placeholder="you@example.com"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apt-date">Preferred Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="apt-date"
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt-time">Preferred Time</Label>
                  <Select
                    value={bookingData.time}
                    onValueChange={(value) => setBookingData({ ...bookingData, time: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apt-reason">Reason for Visit (Optional)</Label>
                <Input
                  id="apt-reason"
                  placeholder="Briefly describe your health concern"
                  value={bookingData.reason}
                  onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Confirm Appointment
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;
