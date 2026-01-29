import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { 
  Microscope, 
  Stethoscope, 
  Home, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  Shield,
  Award,
  Users,
  FileText,
  CalendarCheck,
  Truck,
  FlaskConical,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Eye,
  Activity,
  Building2,
  BadgeCheck,
  Star,
  Phone
} from "lucide-react";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

const corporatePackages = [
  {
    id: "basic",
    name: "বেসিক প্যাকেজ",
    nameEn: "Basic Package",
    price: 1500,
    pricePerPerson: "প্রতি জন",
    minEmployees: 20,
    popular: false,
    description: "ছোট প্রতিষ্ঠানের জন্য আদর্শ প্রাথমিক স্বাস্থ্য পরীক্ষা",
    tests: [
      "CBC (Complete Blood Count)",
      "Blood Sugar (Fasting)",
      "Lipid Profile",
      "Urine Routine",
      "Blood Pressure Check",
      "BMI Assessment",
    ],
    features: [
      "অন-সাইট কালেকশন",
      "৪৮ ঘন্টায় রিপোর্ট",
      "ডিজিটাল রিপোর্ট",
    ],
    color: "border-muted",
  },
  {
    id: "standard",
    name: "স্ট্যান্ডার্ড প্যাকেজ",
    nameEn: "Standard Package",
    price: 2500,
    pricePerPerson: "প্রতি জন",
    minEmployees: 30,
    popular: true,
    description: "মাঝারি প্রতিষ্ঠানের জন্য সম্পূর্ণ স্বাস্থ্য চেকআপ",
    tests: [
      "CBC (Complete Blood Count)",
      "Blood Sugar (Fasting & PP)",
      "HbA1c",
      "Lipid Profile",
      "Liver Function Test (LFT)",
      "Kidney Function Test (KFT)",
      "Thyroid Profile (TSH, T3, T4)",
      "Urine Routine",
      "ECG",
      "Chest X-Ray",
    ],
    features: [
      "অন-সাইট কালেকশন",
      "২৪ ঘন্টায় রিপোর্ট",
      "ডিজিটাল রিপোর্ট",
      "ফ্রি ডক্টর কনসালটেশন",
      "হেলথ সামারি রিপোর্ট",
    ],
    color: "border-primary ring-2 ring-primary/20",
  },
  {
    id: "premium",
    name: "প্রিমিয়াম প্যাকেজ",
    nameEn: "Premium Package",
    price: 4500,
    pricePerPerson: "প্রতি জন",
    minEmployees: 50,
    popular: false,
    description: "বড় প্রতিষ্ঠানের জন্য এক্সিকিউটিভ হেলথ চেকআপ",
    tests: [
      "CBC (Complete Blood Count)",
      "Blood Sugar (Fasting, PP, HbA1c)",
      "Complete Lipid Profile",
      "Liver Function Test (LFT)",
      "Kidney Function Test (KFT)",
      "Complete Thyroid Profile",
      "Vitamin D & B12",
      "Uric Acid",
      "Urine Routine & Culture",
      "ECG",
      "Chest X-Ray",
      "Ultrasound Abdomen",
      "Eye Checkup",
      "Dental Checkup",
    ],
    features: [
      "অন-সাইট কালেকশন",
      "২৪ ঘন্টায় রিপোর্ট",
      "ডিজিটাল রিপোর্ট",
      "ফ্রি স্পেশালিস্ট কনসালটেশন",
      "ডিটেইলড হেলথ সামারি",
      "ফলো-আপ কনসালটেশন",
      "ডেডিকেটেড কোঅর্ডিনেটর",
    ],
    color: "border-accent",
  },
];

const services = [
  {
    id: "diagnostic",
    icon: Microscope,
    title: "ডায়াগনস্টিক সার্ভিস",
    titleEn: "Diagnostic Services",
    description: "আধুনিক প্রযুক্তি ও অভিজ্ঞ টেকনিশিয়ানদের মাধ্যমে নির্ভুল ল্যাব টেস্ট সেবা",
    features: [
      "৫০+ ধরনের ল্যাব টেস্ট",
      "২৪-৪৮ ঘন্টায় রিপোর্ট",
      "অনলাইনে রিপোর্ট ডাউনলোড",
      "NABL মানসম্পন্ন ল্যাব",
      "অভিজ্ঞ প্যাথলজিস্ট দ্বারা যাচাই",
    ],
    categories: [
      { name: "রক্ত পরীক্ষা", icon: FlaskConical, tests: ["CBC", "Blood Sugar", "Lipid Profile", "Liver Function", "Kidney Function"] },
      { name: "হরমোন টেস্ট", icon: Activity, tests: ["Thyroid Profile", "Diabetes Panel", "Fertility Hormones"] },
      { name: "ইউরিন টেস্ট", icon: FlaskConical, tests: ["Routine Urine", "Urine Culture", "Microalbumin"] },
      { name: "ইমেজিং", icon: Eye, tests: ["X-Ray", "Ultrasound", "ECG", "Echo"] },
    ],
    cta: { text: "টেস্ট বুক করুন", link: "/book-test" },
    color: "primary",
  },
  {
    id: "consultation",
    icon: Stethoscope,
    title: "ডক্টর কনসালটেশন",
    titleEn: "Doctor Consultation",
    description: "অভিজ্ঞ বিশেষজ্ঞ ডাক্তারদের সাথে অ্যাপয়েন্টমেন্ট নিন সহজেই",
    features: [
      "২০+ বিশেষজ্ঞ ডাক্তার",
      "অনলাইন অ্যাপয়েন্টমেন্ট",
      "একই দিনে অ্যাপয়েন্টমেন্ট",
      "ফলো-আপ কনসালটেশন",
      "প্রেসক্রিপশন ডিজিটালি",
    ],
    categories: [
      { name: "কার্ডিওলজি", icon: HeartPulse, tests: ["হৃদরোগ বিশেষজ্ঞ", "ECG, Echo", "Stress Test"] },
      { name: "মেডিসিন", icon: Stethoscope, tests: ["সাধারণ চিকিৎসা", "ডায়াবেটিস", "উচ্চ রক্তচাপ"] },
      { name: "অর্থোপেডিক্স", icon: Bone, tests: ["হাড় ও জয়েন্ট", "ফিজিওথেরাপি", "স্পোর্টস ইনজুরি"] },
      { name: "গাইনি", icon: Baby, tests: ["প্রসূতি বিদ্যা", "বন্ধ্যাত্ব চিকিৎসা", "মহিলা রোগ"] },
      { name: "নিউরোলজি", icon: Brain, tests: ["মস্তিষ্ক ও স্নায়ু", "মাইগ্রেন", "স্ট্রোক"] },
    ],
    cta: { text: "অ্যাপয়েন্টমেন্ট নিন", link: "/book-appointment" },
    color: "accent",
  },
  {
    id: "home-collection",
    icon: Home,
    title: "হোম স্যাম্পল কালেকশন",
    titleEn: "Home Sample Collection",
    description: "ঘরে বসেই স্যাম্পল দিন, আমাদের প্রশিক্ষিত টিম আপনার দোরগোড়ায়",
    features: [
      "ঢাকা জুড়ে সেবা",
      "প্রশিক্ষিত ফ্লেবোটমিস্ট",
      "সকাল ৭টা - রাত ১০টা",
      "রিয়েল-টাইম ট্র্যাকিং",
      "নিরাপদ স্যাম্পল হ্যান্ডলিং",
    ],
    categories: [
      { name: "বয়স্কদের জন্য", icon: Users, tests: ["বাড়িতেই সব টেস্ট", "বিশেষ যত্ন", "রিপোর্ট বাড়িতে"] },
      { name: "ব্যস্ত পেশাজীবী", icon: Clock, tests: ["সুবিধাজনক সময়", "অফিসে কালেকশন", "দ্রুত সেবা"] },
      { name: "কর্পোরেট", icon: Award, tests: ["গ্রুপ হেলথ চেকআপ", "কর্মী স্বাস্থ্য পরীক্ষা", "বিশেষ ছাড়"] },
    ],
    cta: { text: "হোম কালেকশন বুক করুন", link: "/book-test" },
    color: "success",
  },
];

const processSteps = [
  {
    step: 1,
    title: "অনলাইন বুকিং",
    description: "ওয়েবসাইট বা ফোনে বুকিং করুন",
    icon: CalendarCheck,
  },
  {
    step: 2,
    title: "স্যাম্পল কালেকশন",
    description: "সেন্টারে আসুন বা হোম কালেকশন নিন",
    icon: Truck,
  },
  {
    step: 3,
    title: "ল্যাব প্রসেসিং",
    description: "আধুনিক ল্যাবে টেস্ট সম্পন্ন",
    icon: FlaskConical,
  },
  {
    step: 4,
    title: "রিপোর্ট ডেলিভারি",
    description: "অনলাইনে বা সরাসরি রিপোর্ট নিন",
    icon: FileText,
  },
];

const faqs = [
  {
    question: "হোম কালেকশনের জন্য কতটুকু আগে বুকিং করতে হবে?",
    answer: "সাধারণত ২-৩ ঘন্টা আগে বুকিং করলেই হয়। তবে সকালের স্লটের জন্য আগের দিন রাতে বুকিং করা ভালো।",
  },
  {
    question: "রিপোর্ট পেতে কত সময় লাগে?",
    answer: "বেশিরভাগ রুটিন টেস্টের রিপোর্ট ২৪-৪৮ ঘন্টায় পাওয়া যায়। কিছু বিশেষ টেস্টে ৩-৫ দিন সময় লাগতে পারে।",
  },
  {
    question: "অনলাইনে রিপোর্ট কিভাবে দেখব?",
    answer: "আপনার অ্যাকাউন্টে লগইন করে 'My Requests' সেকশনে গেলে রিপোর্ট ডাউনলোড করতে পারবেন।",
  },
  {
    question: "ডক্টর অ্যাপয়েন্টমেন্ট কি একই দিনে পাওয়া যায়?",
    answer: "হ্যাঁ, স্লট খালি থাকলে একই দিনে অ্যাপয়েন্টমেন্ট পাওয়া সম্ভব। অনলাইনে রিয়েল-টাইম স্লট দেখতে পারবেন।",
  },
  {
    question: "পেমেন্ট কিভাবে করব?",
    answer: "ক্যাশ, বিকাশ, নগদ, রকেট এবং কার্ড পেমেন্ট সব পদ্ধতিতে পেমেন্ট করতে পারবেন।",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-16 md:py-24">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                আমাদের সেবাসমূহ
              </span>
              <h1 className="text-display-sm md:text-display-lg font-bold mb-6">
                বিশ্বস্ত স্বাস্থ্যসেবা আপনার দোরগোড়ায়
              </h1>
              <p className="text-white/80 text-lg mb-8">
                আধুনিক প্রযুক্তি, অভিজ্ঞ চিকিৎসক এবং প্রশিক্ষিত টিমের মাধ্যমে 
                নির্ভুল ও দ্রুত স্বাস্থ্যসেবা নিশ্চিত করি আমরা।
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/book-test">
                  <Button size="lg" variant="secondary">
                    টেস্ট বুক করুন
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/book-appointment">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20">
                    ডক্টর অ্যাপয়েন্টমেন্ট
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section with Animated Counters */}
        <section className="py-12 bg-card border-b border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter end={50} duration={1500} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">ধরনের টেস্ট</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter end={20} duration={1500} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">বিশেষজ্ঞ ডাক্তার</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter end={10000} duration={2000} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">সন্তুষ্ট রোগী</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter end={99} duration={1500} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">নির্ভুলতা</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Detail */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-display-sm font-bold text-foreground mb-4">
                আমাদের প্রধান সেবাসমূহ
              </h2>
              <p className="text-muted-foreground">
                TrustCare-এ আমরা তিনটি প্রধান সেবা প্রদান করি - প্রতিটি সেবায় 
                সর্বোচ্চ মান ও যত্ন নিশ্চিত করা হয়।
              </p>
            </div>

            <div className="space-y-16">
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        service.color === "primary" ? "bg-primary/10" :
                        service.color === "accent" ? "bg-accent/10" :
                        "bg-success/10"
                      }`}>
                        <service.icon className={`h-7 w-7 ${
                          service.color === "primary" ? "text-primary" :
                          service.color === "accent" ? "text-accent" :
                          "text-success"
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.titleEn}</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 text-lg">
                      {service.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${
                            service.color === "primary" ? "text-primary" :
                            service.color === "accent" ? "text-accent" :
                            "text-success"
                          }`} />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to={service.cta.link}>
                      <Button size="lg">
                        {service.cta.text}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  {/* Categories Grid */}
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {service.categories.map((category, i) => (
                        <Card key={i} className="hover:shadow-elevated transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                service.color === "primary" ? "bg-primary/10" :
                                service.color === "accent" ? "bg-accent/10" :
                                "bg-success/10"
                              }`}>
                                <category.icon className={`h-5 w-5 ${
                                  service.color === "primary" ? "text-primary" :
                                  service.color === "accent" ? "text-accent" :
                                  "text-success"
                                }`} />
                              </div>
                              <CardTitle className="text-base">{category.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-1.5">
                              {category.tests.map((test, j) => (
                                <Badge key={j} variant="secondary" className="text-xs">
                                  {test}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-display-sm font-bold text-foreground mb-4">
                কিভাবে কাজ করে?
              </h2>
              <p className="text-muted-foreground">
                মাত্র ৪টি সহজ ধাপে পান আপনার স্বাস্থ্য পরীক্ষার ফলাফল
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="h-full text-center hover:shadow-elevated transition-shadow">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                        <step.icon className="h-8 w-8 text-primary" />
                        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                          {step.step}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow between steps */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-primary/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Health Checkup Packages */}
        <section className="section-padding bg-gradient-to-b from-background to-muted/30">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Building2 className="h-4 w-4" />
                <span>কর্পোরেট সলিউশন</span>
              </div>
              <h2 className="text-display-sm font-bold text-foreground mb-4">
                কর্পোরেট হেলথ চেকআপ প্যাকেজ
              </h2>
              <p className="text-muted-foreground">
                আপনার প্রতিষ্ঠানের কর্মীদের স্বাস্থ্য সুরক্ষায় আমাদের বিশেষ প্যাকেজ। 
                গ্রুপ বুকিংয়ে বিশেষ ছাড়।
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {corporatePackages.map((pkg) => (
                <Card 
                  key={pkg.id} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-elevated ${pkg.color}`}
                >
                  {pkg.popular && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        জনপ্রিয়
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        pkg.popular ? "bg-primary/10" : "bg-muted"
                      }`}>
                        <Building2 className={`h-6 w-6 ${pkg.popular ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{pkg.nameEn}</p>
                      </div>
                    </div>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Pricing */}
                    <div className="text-center py-4 bg-muted/50 rounded-xl">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-foreground">৳{pkg.price.toLocaleString()}</span>
                        <span className="text-muted-foreground">/{pkg.pricePerPerson}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        ন্যূনতম {pkg.minEmployees} জন
                      </p>
                    </div>

                    {/* Tests Included */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-primary" />
                        অন্তর্ভুক্ত টেস্ট
                      </h4>
                      <ul className="space-y-2">
                        {pkg.tests.map((test, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Features */}
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                        বিশেষ সুবিধা
                      </h4>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Button 
                      className="w-full" 
                      variant={pkg.popular ? "default" : "outline"}
                      size="lg"
                      asChild
                    >
                      <a href="tel:+8801345580203">
                        <Phone className="h-4 w-4 mr-2" />
                        যোগাযোগ করুন
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Corporate Benefits */}
            <div className="mt-12 bg-card rounded-2xl p-6 md:p-8 border shadow-sm">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    কর্পোরেট ক্লায়েন্টদের জন্য বিশেষ সুবিধা
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "অফিসে বা ফ্যাক্টরিতে অন-সাইট স্যাম্পল কালেকশন",
                      "কাস্টমাইজড প্যাকেজ তৈরির সুযোগ",
                      "বার্ষিক চুক্তিতে অতিরিক্ত ১০% ছাড়",
                      "ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার",
                      "প্রতিষ্ঠানের জন্য হেলথ অ্যানালিটিক্স রিপোর্ট",
                      "এমপ্লয়ি হেলথ পোর্টাল অ্যাক্সেস",
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-hero rounded-xl p-6 text-center text-white">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <h4 className="text-xl font-bold mb-2">কাস্টম প্যাকেজ দরকার?</h4>
                  <p className="text-white/80 mb-4 text-sm">
                    আপনার প্রতিষ্ঠানের চাহিদা অনুযায়ী প্যাকেজ ডিজাইন করুন
                  </p>
                  <Button variant="secondary" size="lg" asChild>
                    <a href="tel:+8801345580203">
                      <Phone className="h-4 w-4 mr-2" />
                      ০১৩৪৫-৫৮০২০৩
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-display-sm font-bold text-foreground mb-4">
                কেন TrustCare বেছে নেবেন?
              </h2>
              <p className="text-muted-foreground">
                আমাদের প্রতিশ্রুতি - বিশ্বস্ত সেবা, নির্ভুল ফলাফল
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "নির্ভুল ফলাফল",
                  description: "NABL মানসম্পন্ন ল্যাবে অত্যাধুনিক যন্ত্রপাতি দিয়ে পরীক্ষা",
                },
                {
                  icon: Clock,
                  title: "দ্রুত রিপোর্ট",
                  description: "বেশিরভাগ রিপোর্ট ২৪-৪৮ ঘন্টার মধ্যে ডেলিভারি",
                },
                {
                  icon: Users,
                  title: "অভিজ্ঞ টিম",
                  description: "প্রশিক্ষিত টেকনিশিয়ান ও বিশেষজ্ঞ প্যাথলজিস্ট",
                },
                {
                  icon: Award,
                  title: "সাশ্রয়ী মূল্য",
                  description: "প্রতিযোগিতামূলক মূল্যে সেরা মানের সেবা",
                },
              ].map((item, index) => (
                <Card key={index} className="text-center hover:shadow-elevated transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-display-sm font-bold text-foreground mb-4">
                  সাধারণ জিজ্ঞাসা
                </h2>
                <p className="text-muted-foreground">
                  আমাদের সেবা সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-card rounded-xl px-6 border shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                আজই আপনার স্বাস্থ্য পরীক্ষা করুন
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                অনলাইনে বুকিং করুন অথবা সরাসরি আমাদের সেন্টারে আসুন। 
                প্রশ্ন থাকলে কল করুন।
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/book-test">
                  <Button size="lg" variant="secondary">
                    টেস্ট বুক করুন
                  </Button>
                </Link>
                <a href="tel:+8801345580203">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20">
                    কল করুন: ০১৩৪৫-৫৮০২০৩
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

export default Services;
