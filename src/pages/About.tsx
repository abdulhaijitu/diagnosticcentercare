import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, Target, Eye, Shield, Users, Award, 
  Clock, CheckCircle2, Building2, Microscope 
} from "lucide-react";

const stats = [
  { value: "10,000+", label: "রোগী সেবা", icon: Users },
  { value: "50+", label: "ডায়াগনস্টিক টেস্ট", icon: Microscope },
  { value: "20+", label: "বিশেষজ্ঞ ডাক্তার", icon: Award },
  { value: "99%", label: "সন্তুষ্টির হার", icon: Heart },
];

const values = [
  {
    icon: Shield,
    title: "বিশ্বাসযোগ্যতা",
    description: "প্রতিটি রিপোর্টে সঠিকতা এবং স্বচ্ছতা নিশ্চিত করি।",
  },
  {
    icon: Heart,
    title: "যত্নশীলতা",
    description: "রোগীদের প্রতি সহানুভূতিশীল এবং মানবিক সেবা প্রদান করি।",
  },
  {
    icon: Clock,
    title: "সময়নিষ্ঠা",
    description: "দ্রুত এবং সময়মতো রিপোর্ট ডেলিভারি নিশ্চিত করি।",
  },
  {
    icon: CheckCircle2,
    title: "গুণমান",
    description: "আন্তর্জাতিক মানের যন্ত্রপাতি ও প্রযুক্তি ব্যবহার করি।",
  },
];

const milestones = [
  { year: "২০১৮", event: "TrustCare ডায়াগনস্টিক সেন্টার প্রতিষ্ঠা" },
  { year: "২০১৯", event: "হোম স্যাম্পল কালেকশন সার্ভিস চালু" },
  { year: "২০২০", event: "ডিজিটাল রিপোর্ট সিস্টেম চালু" },
  { year: "২০২১", event: "বিশেষজ্ঞ ডাক্তার কনসালটেশন সার্ভিস চালু" },
  { year: "২০২২", event: "অনলাইন অ্যাপয়েন্টমেন্ট বুকিং সিস্টেম চালু" },
  { year: "২০২৩", event: "১০,০০০+ রোগী সেবার মাইলফলক অর্জন" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-display-md md:text-display-lg font-bold text-foreground mb-6">
                আমাদের সম্পর্কে
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                TrustCare ডায়াগনস্টিক এন্ড কনসালটেশন সেন্টার লিমিটেড - আপনার বিশ্বস্ত স্বাস্থ্য সেবা প্রদানকারী। 
                আমরা দ্রুত, সঠিক এবং সাশ্রয়ী মূল্যে ল্যাব টেস্ট ও ডাক্তার কনসালটেশন সেবা প্রদান করি।
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-card border-y border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">আমাদের ইতিহাস</span>
                </div>
                <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-6">
                  বিশ্বস্ত সেবার যাত্রা
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    ২০১৮ সালে ঢাকার মোহাম্মদপুরে TrustCare ডায়াগনস্টিক সেন্টার প্রতিষ্ঠিত হয়। 
                    শুরু থেকেই আমাদের লক্ষ্য ছিল সাধারণ মানুষের কাছে মানসম্মত ডায়াগনস্টিক সেবা সহজলভ্য করা।
                  </p>
                  <p>
                    আধুনিক যন্ত্রপাতি, অভিজ্ঞ ল্যাব টেকনিশিয়ান এবং বিশেষজ্ঞ প্যাথলজিস্টদের সমন্বয়ে 
                    আমরা প্রতিদিন শত শত রোগীকে সেবা প্রদান করছি।
                  </p>
                  <p>
                    হোম স্যাম্পল কালেকশন সার্ভিস চালু করে আমরা বয়স্ক ও অসুস্থ রোগীদের ঘরে বসেই 
                    টেস্ট করার সুবিধা দিচ্ছি, যা আমাদের সেবার পরিধি আরও বিস্তৃত করেছে।
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative pl-12">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="bg-card border border-border rounded-lg p-4">
                        <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                        <p className="text-foreground mt-1">{milestone.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission */}
              <Card className="bg-card border-2 border-primary/20">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">আমাদের মিশন</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    বাংলাদেশের প্রতিটি মানুষের কাছে সাশ্রয়ী মূল্যে আন্তর্জাতিক মানের ডায়াগনস্টিক 
                    সেবা পৌঁছে দেওয়া। আমরা বিশ্বাস করি, সঠিক রোগ নির্ণয়ই সুস্থতার প্রথম পদক্ষেপ।
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">দ্রুত ও সঠিক রিপোর্ট প্রদান</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">সাশ্রয়ী মূল্যে সেবা</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">ঘরে বসে স্যাম্পল কালেকশন</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Vision */}
              <Card className="bg-card border-2 border-accent/20">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                    <Eye className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">আমাদের ভিশন</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    বাংলাদেশের সবচেয়ে বিশ্বস্ত এবং প্রযুক্তি-সমৃদ্ধ ডায়াগনস্টিক নেটওয়ার্ক হিসেবে 
                    পরিচিত হওয়া। আমাদের লক্ষ্য প্রতিটি জেলায় মানসম্মত সেবা পৌঁছে দেওয়া।
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">সারাদেশে সেবা নেটওয়ার্ক সম্প্রসারণ</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">AI-ভিত্তিক রোগ নির্ণয় সিস্টেম</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">টেলিমেডিসিন সেবা সম্প্রসারণ</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
                আমাদের মূল্যবোধ
              </h2>
              <p className="text-muted-foreground">
                এই মূল্যবোধগুলো আমাদের প্রতিদিনের কাজে পথ দেখায়
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="text-display-sm font-bold mb-4">
              আপনার স্বাস্থ্য আমাদের অগ্রাধিকার
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              আজই আমাদের সাথে যোগাযোগ করুন এবং বিশ্বস্ত স্বাস্থ্য সেবার অভিজ্ঞতা নিন।
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/book-test"
                className="inline-flex items-center justify-center px-6 py-3 bg-background text-foreground font-medium rounded-lg hover:bg-background/90 transition-colors"
              >
                টেস্ট বুক করুন
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-foreground text-primary-foreground font-medium rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                যোগাযোগ করুন
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
