import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, Target, Eye, Shield, Users, Award, 
  Clock, CheckCircle2, Building2, Microscope,
  Linkedin, Mail, Trophy, Medal, BadgeCheck, Star
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

const teamMembers = [
  {
    name: "ডা. আহমেদ করিম",
    role: "প্রতিষ্ঠাতা ও ব্যবস্থাপনা পরিচালক",
    qualification: "MBBS, FCPS (Pathology)",
    bio: "২০+ বছরের অভিজ্ঞতাসম্পন্ন প্যাথলজিস্ট। সঠিক রোগ নির্ণয়ের মাধ্যমে রোগীদের সুস্থতায় অবদান রাখা তাঁর জীবনের লক্ষ্য।",
    avatar: null,
    email: "ahmed.karim@trustcaredc.com",
    linkedin: "#",
  },
  {
    name: "ডা. ফাতেমা নাসরিন",
    role: "প্রধান প্যাথলজিস্ট",
    qualification: "MBBS, MD (Clinical Pathology)",
    bio: "১৫ বছরের অভিজ্ঞতা। ক্লিনিক্যাল প্যাথলজিতে বিশেষজ্ঞ এবং কোয়ালিটি কন্ট্রোল বিভাগের প্রধান।",
    avatar: null,
    email: "fatema.nasrin@trustcaredc.com",
    linkedin: "#",
  },
  {
    name: "মোহাম্মদ রাফি",
    role: "অপারেশনস ম্যানেজার",
    qualification: "MBA, Healthcare Management",
    bio: "১০ বছরের হেলথকেয়ার অপারেশনস অভিজ্ঞতা। হোম কালেকশন সার্ভিস ও ডিজিটাল ট্রান্সফর্মেশনের নেতৃত্ব দিচ্ছেন।",
    avatar: null,
    email: "rafi@trustcaredc.com",
    linkedin: "#",
  },
  {
    name: "সাবরিনা আক্তার",
    role: "প্রধান ল্যাব টেকনোলজিস্ট",
    qualification: "BSc MLT, Diploma in Lab Medicine",
    bio: "১২ বছরের ল্যাবরেটরি অভিজ্ঞতা। আধুনিক যন্ত্রপাতি পরিচালনা ও টিম ট্রেনিংয়ে বিশেষজ্ঞ।",
    avatar: null,
    email: "sabrina@trustcaredc.com",
    linkedin: "#",
  },
  {
    name: "ডা. তানভীর হাসান",
    role: "কনসালট্যান্ট রেডিওলজিস্ট",
    qualification: "MBBS, MD (Radiology)",
    bio: "১৮ বছরের রেডিওলজি অভিজ্ঞতা। আল্ট্রাসাউন্ড, এক্স-রে ও ডায়াগনস্টিক ইমেজিংয়ে বিশেষজ্ঞ।",
    avatar: null,
    email: "tanvir@trustcaredc.com",
    linkedin: "#",
  },
  {
    name: "নাজমা বেগম",
    role: "কাস্টমার কেয়ার প্রধান",
    qualification: "BA, Customer Service Certified",
    bio: "৮ বছরের কাস্টমার সার্ভিস অভিজ্ঞতা। রোগীদের সন্তুষ্টি নিশ্চিত করা তাঁর প্রধান দায়িত্ব।",
    avatar: null,
    email: "nazma@trustcaredc.com",
    linkedin: "#",
  },
];

const achievements = [
  {
    icon: Trophy,
    year: "২০২৩",
    title: "সেরা ডায়াগনস্টিক সেন্টার পুরস্কার",
    organization: "বাংলাদেশ মেডিকেল অ্যাসোসিয়েশন",
    description: "মোহাম্মদপুর এলাকায় সেরা ডায়াগনস্টিক সেবা প্রদানের জন্য।",
  },
  {
    icon: Medal,
    year: "২০২২",
    title: "ISO 15189:2012 সার্টিফিকেশন",
    organization: "International Accreditation Forum",
    description: "মেডিকেল ল্যাবরেটরির জন্য আন্তর্জাতিক মান অর্জন।",
  },
  {
    icon: BadgeCheck,
    year: "২০২২",
    title: "NABL অ্যাক্রিডিটেশন",
    organization: "National Accreditation Board for Testing",
    description: "ল্যাবরেটরি টেস্টিংয়ে জাতীয় মানদণ্ড পূরণ।",
  },
  {
    icon: Star,
    year: "২০২১",
    title: "কাস্টমার এক্সিলেন্স অ্যাওয়ার্ড",
    organization: "ঢাকা চেম্বার অফ কমার্স",
    description: "৯৯% কাস্টমার সন্তুষ্টি অর্জনের স্বীকৃতি।",
  },
  {
    icon: Award,
    year: "২০২০",
    title: "ডিজিটাল ইনোভেশন অ্যাওয়ার্ড",
    organization: "বাংলাদেশ আইসিটি মন্ত্রণালয়",
    description: "অনলাইন রিপোর্ট ও বুকিং সিস্টেম চালুর জন্য।",
  },
  {
    icon: Heart,
    year: "২০১৯",
    title: "কমিউনিটি হেলথ চ্যাম্পিয়ন",
    organization: "মোহাম্মদপুর সিটি কর্পোরেশন",
    description: "বিনামূল্যে স্বাস্থ্য ক্যাম্প আয়োজনের স্বীকৃতি।",
  },
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

        {/* Team Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">আমাদের টিম</span>
              </div>
              <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
                অভিজ্ঞ পেশাদার দল
              </h2>
              <p className="text-muted-foreground">
                আমাদের দক্ষ ও অভিজ্ঞ টিম আপনার সেবায় সর্বদা প্রস্তুত
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.name} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="pt-8 pb-6">
                    <div className="text-center">
                      <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all">
                        <AvatarImage src={member.avatar || undefined} alt={member.name} />
                        <AvatarFallback className="text-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                          {member.name.split(" ").slice(-1)[0].charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                      <p className="text-sm font-medium text-primary mb-1">{member.role}</p>
                      <p className="text-xs text-muted-foreground mb-3">{member.qualification}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{member.bio}</p>
                      
                      <div className="flex items-center justify-center gap-3 pt-4 border-t border-border">
                        <a 
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                          title="ইমেইল করুন"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        <a 
                          href={member.linkedin}
                          className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                          title="LinkedIn প্রোফাইল"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">অর্জন ও পুরস্কার</span>
              </div>
              <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
                আমাদের সাফল্যের স্বীকৃতি
              </h2>
              <p className="text-muted-foreground">
                মানসম্মত সেবা প্রদানের জন্য আমরা যে সম্মান ও স্বীকৃতি অর্জন করেছি
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="group relative overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <achievement.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
                          {achievement.year}
                        </span>
                        <h3 className="text-lg font-semibold text-foreground mb-1 leading-tight">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-primary/80 font-medium mb-2">
                          {achievement.organization}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="section-padding bg-muted/30">
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
