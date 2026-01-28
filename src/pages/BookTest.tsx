import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  Search, 
  FlaskConical, 
  Clock, 
  Home, 
  Building2,
  CheckCircle2,
  X,
  CalendarIcon,
  User,
  Phone,
  Mail,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeCollectionRequests } from "@/hooks/useHomeCollectionRequests";
import { useToast } from "@/hooks/use-toast";

// Mock data for diagnostic tests
const testCategories = [
  { id: "all", name: "All Tests" },
  { id: "blood", name: "Blood Tests" },
  { id: "diabetes", name: "Diabetes" },
  { id: "thyroid", name: "Thyroid" },
  { id: "liver", name: "Liver Function" },
  { id: "kidney", name: "Kidney Function" },
  { id: "cardiac", name: "Cardiac" },
  { id: "vitamin", name: "Vitamins" },
];

const diagnosticTests = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    category: "blood",
    price: 350,
    originalPrice: 500,
    duration: "Same Day",
    description: "Measures red blood cells, white blood cells, hemoglobin, hematocrit, and platelets.",
    includes: ["RBC Count", "WBC Count", "Hemoglobin", "Platelet Count", "Hematocrit"],
    popular: true,
    homeCollection: true,
  },
  {
    id: 2,
    name: "Fasting Blood Sugar (FBS)",
    category: "diabetes",
    price: 150,
    originalPrice: 200,
    duration: "Same Day",
    description: "Measures blood glucose levels after fasting to screen for diabetes.",
    includes: ["Glucose Level"],
    popular: true,
    homeCollection: true,
  },
  {
    id: 3,
    name: "HbA1c (Glycated Hemoglobin)",
    category: "diabetes",
    price: 600,
    originalPrice: 800,
    duration: "Same Day",
    description: "Measures average blood sugar levels over the past 2-3 months.",
    includes: ["HbA1c Percentage", "Estimated Average Glucose"],
    popular: true,
    homeCollection: true,
  },
  {
    id: 4,
    name: "Thyroid Profile (T3, T4, TSH)",
    category: "thyroid",
    price: 750,
    originalPrice: 1000,
    duration: "Same Day",
    description: "Complete thyroid function test to assess thyroid health.",
    includes: ["T3", "T4", "TSH"],
    popular: true,
    homeCollection: true,
  },
  {
    id: 5,
    name: "Liver Function Test (LFT)",
    category: "liver",
    price: 800,
    originalPrice: 1100,
    duration: "Same Day",
    description: "Comprehensive test to evaluate liver health and function.",
    includes: ["SGPT", "SGOT", "Bilirubin", "Albumin", "Alkaline Phosphatase"],
    popular: false,
    homeCollection: true,
  },
  {
    id: 6,
    name: "Kidney Function Test (KFT)",
    category: "kidney",
    price: 700,
    originalPrice: 950,
    duration: "Same Day",
    description: "Evaluates kidney health by measuring waste products in blood.",
    includes: ["Creatinine", "BUN", "Uric Acid", "Electrolytes"],
    popular: false,
    homeCollection: true,
  },
  {
    id: 7,
    name: "Lipid Profile",
    category: "cardiac",
    price: 550,
    originalPrice: 750,
    duration: "Same Day",
    description: "Measures cholesterol levels to assess cardiovascular risk.",
    includes: ["Total Cholesterol", "HDL", "LDL", "Triglycerides", "VLDL"],
    popular: true,
    homeCollection: true,
  },
  {
    id: 8,
    name: "Vitamin D Test",
    category: "vitamin",
    price: 900,
    originalPrice: 1200,
    duration: "Next Day",
    description: "Measures Vitamin D levels to assess bone health and immunity.",
    includes: ["25-Hydroxy Vitamin D"],
    popular: true,
    homeCollection: true,
  },
  {
    id: 9,
    name: "Vitamin B12 Test",
    category: "vitamin",
    price: 700,
    originalPrice: 900,
    duration: "Same Day",
    description: "Measures Vitamin B12 levels important for nerve and blood cell health.",
    includes: ["Vitamin B12 Level"],
    popular: false,
    homeCollection: true,
  },
  {
    id: 10,
    name: "Iron Studies",
    category: "blood",
    price: 850,
    originalPrice: 1100,
    duration: "Same Day",
    description: "Comprehensive iron panel to diagnose anemia and iron disorders.",
    includes: ["Serum Iron", "TIBC", "Ferritin", "Transferrin Saturation"],
    popular: false,
    homeCollection: true,
  },
];

interface SelectedTest {
  id: number;
  name: string;
  price: number;
}

const BookTest = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    time: "",
    collectionType: "home",
    address: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { user, profile } = useAuth();
  const { createRequest } = useHomeCollectionRequests();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auto-fill from profile when booking dialog opens
  const handleOpenBooking = () => {
    if (profile) {
      setBookingData({
        ...bookingData,
        name: profile.full_name || "",
        phone: profile.phone || "",
        email: profile.email || user?.email || "",
        address: profile.address || "",
      });
    }
    setIsBookingOpen(true);
  };

  const filteredTests = diagnosticTests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddTest = (test: typeof diagnosticTests[0]) => {
    if (!selectedTests.find((t) => t.id === test.id)) {
      setSelectedTests([...selectedTests, { id: test.id, name: test.name, price: test.price }]);
    }
  };

  const handleRemoveTest = (testId: number) => {
    setSelectedTests(selectedTests.filter((t) => t.id !== testId));
  };

  const totalPrice = selectedTests.reduce((sum, test) => sum + test.price, 0);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a test",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (bookingData.collectionType === "home") {
      setIsSubmitting(true);
      
      const { error } = await createRequest({
        test_names: selectedTests.map((t) => t.name),
        total_amount: totalPrice,
        full_name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email,
        address: bookingData.address,
        preferred_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        preferred_time: bookingData.time,
      });

      setIsSubmitting(false);

      if (!error) {
        setIsBookingOpen(false);
        setSelectedTests([]);
        setSelectedDate(undefined);
        setBookingData({
          name: "",
          phone: "",
          email: "",
          time: "",
          collectionType: "home",
          address: "",
        });
        navigate("/my-requests");
      }
    } else {
      // For center visits, just show confirmation
      toast({
        title: "Booking Confirmed!",
        description: "Please visit our center on the selected date and time.",
      });
      setIsBookingOpen(false);
      setSelectedTests([]);
    }
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
                100+ Tests Available
              </span>
              <h1 className="text-display-sm md:text-display-md font-bold mb-4">
                Book Your Diagnostic Test
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Browse our comprehensive range of diagnostic tests and book online. 
                Get accurate results with fast turnaround times.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for tests... (e.g., CBC, Thyroid, Diabetes)"
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
              {/* Sidebar - Categories */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24">
                  <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {testCategories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Test Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredTests.length}</span> tests
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {filteredTests.map((test) => (
                    <div
                      key={test.id}
                      className="bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FlaskConical className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{test.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{test.duration}</span>
                              {test.homeCollection && (
                                <>
                                  <Home className="h-3.5 w-3.5 text-success ml-2" />
                                  <span className="text-xs text-success">Home Collection</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {test.popular && (
                          <Badge variant="secondary" className="bg-accent/10 text-accent">
                            Popular
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{test.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {test.includes.slice(0, 3).map((item) => (
                          <Badge key={item} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                        {test.includes.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{test.includes.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <span className="text-2xl font-bold text-foreground">৳{test.price}</span>
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            ৳{test.originalPrice}
                          </span>
                        </div>
                        {selectedTests.find((t) => t.id === test.id) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveTest(test.id)}
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleAddTest(test)}>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Add Test
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTests.length === 0 && (
                  <div className="text-center py-16">
                    <FlaskConical className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No tests found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Floating Cart */}
        {selectedTests.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50">
            <div className="container-custom py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 overflow-x-auto">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {selectedTests.length} test{selectedTests.length > 1 ? "s" : ""} selected
                  </span>
                  <div className="flex gap-2">
                    {selectedTests.map((test) => (
                      <Badge key={test.id} variant="secondary" className="whitespace-nowrap">
                        {test.name}
                        <button
                          onClick={() => handleRemoveTest(test.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-foreground">৳{totalPrice}</p>
                  </div>
                  <Button size="lg" onClick={handleOpenBooking}>
                    Book Now
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Dialog */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Complete Your Booking</DialogTitle>
              <DialogDescription>
                Fill in your details to book the selected tests
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="booking-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="booking-name"
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
                  <Label htmlFor="booking-phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="booking-phone"
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
                  <Label htmlFor="booking-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="booking-email"
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
                  <Label>Preferred Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="booking-time">Preferred Time</Label>
                  <Select
                    value={bookingData.time}
                    onValueChange={(value) => setBookingData({ ...bookingData, time: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sample Collection</Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setBookingData({ ...bookingData, collectionType: "center" })}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                      bookingData.collectionType === "center"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Building2 className={`h-5 w-5 ${bookingData.collectionType === "center" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={bookingData.collectionType === "center" ? "text-primary font-medium" : "text-muted-foreground"}>
                      Visit Center
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingData({ ...bookingData, collectionType: "home" })}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                      bookingData.collectionType === "home"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Home className={`h-5 w-5 ${bookingData.collectionType === "home" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={bookingData.collectionType === "home" ? "text-primary font-medium" : "text-muted-foreground"}>
                      Home Collection
                    </span>
                  </button>
                </div>
              </div>

              {bookingData.collectionType === "home" && (
                <div className="space-y-2">
                  <Label htmlFor="booking-address">Home Address</Label>
                  <Input
                    id="booking-address"
                    placeholder="Enter your full address"
                    value={bookingData.address}
                    onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                    required
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <p className="font-medium text-foreground">Order Summary</p>
                {selectedTests.map((test) => (
                  <div key={test.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{test.name}</span>
                    <span className="text-foreground">৳{test.price}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-border font-semibold">
                  <span>Total</span>
                  <span className="text-primary">৳{totalPrice}</span>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default BookTest;
