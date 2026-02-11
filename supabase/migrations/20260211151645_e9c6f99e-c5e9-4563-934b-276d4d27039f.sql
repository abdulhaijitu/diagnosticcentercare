
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  location TEXT NOT NULL,
  location_bn TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  text TEXT NOT NULL,
  text_bn TEXT,
  service TEXT NOT NULL,
  service_bn TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active testimonials"
ON public.testimonials FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials FOR ALL
USING (is_admin_or_manager(auth.uid()));

-- Seed with initial data
INSERT INTO public.testimonials (name, name_bn, location, location_bn, rating, text, text_bn, service, service_bn, sort_order) VALUES
('Rashida Begum', 'রশিদা বেগম', 'Mohammadpur, Dhaka', 'মোহাম্মদপুর, ঢাকা', 5, 'The home sample collection service was incredibly convenient. The staff was professional and my reports were ready the next day. Highly recommended!', 'হোম স্যাম্পল কালেকশন সার্ভিস অত্যন্ত সুবিধাজনক ছিল। স্টাফরা পেশাদার ছিলেন এবং আমার রিপোর্ট পরের দিনই তৈরি হয়ে গেছে।', 'Home Sample Collection', 'হোম স্যাম্পল কালেকশন', 1),
('Kamrul Islam', 'কামরুল ইসলাম', 'Mirpur, Dhaka', 'মিরপুর, ঢাকা', 5, 'Dr. Rahman provided excellent care during my consultation. The diagnostic tests were accurate and helped identify my condition quickly.', 'ডাঃ রহমান আমার পরামর্শের সময় চমৎকার সেবা দিয়েছেন। ডায়াগনস্টিক পরীক্ষাগুলো নির্ভুল ছিল।', 'Doctor Consultation', 'ডক্টর কনসালটেশন', 2),
('Nasreen Akter', 'নাসরীন আক্তার', 'Dhanmondi, Dhaka', 'ধানমণ্ডি, ঢাকা', 5, 'Very impressed with the cleanliness and organization of the center. The staff is friendly and the reports are always on time. Best diagnostic center!', 'সেন্টারের পরিচ্ছন্নতা ও সংগঠনে খুবই মুগ্ধ। স্টাফরা বন্ধুসুলভ এবং রিপোর্ট সবসময় সময়মতো পাওয়া যায়।', 'Diagnostic Tests', 'ডায়াগনস্টিক টেস্ট', 3),
('Rahim Uddin', 'রহিম উদ্দিন', 'Uttara, Dhaka', 'উত্তরা, ঢাকা', 5, 'I have been coming here for years. The quality of service and accuracy of test results is unmatched. Truly a trustworthy diagnostic center.', 'আমি বছরের পর বছর এখানে আসছি। সেবার মান এবং পরীক্ষার ফলাফলের নির্ভুলতা অতুলনীয়।', 'Diagnostic Tests', 'ডায়াগনস্টিক টেস্ট', 4),
('Fatema Khatun', 'ফাতেমা খাতুন', 'Gulshan, Dhaka', 'গুলশান, ঢাকা', 5, 'The health checkup package was comprehensive and affordable. Got all my tests done in one visit. Very satisfied with the service!', 'হেলথ চেকআপ প্যাকেজটি ব্যাপক এবং সাশ্রয়ী ছিল। এক ভিজিটে সব পরীক্ষা হয়ে গেছে।', 'Health Checkup', 'হেলথ চেকআপ', 5),
('Shahed Alam', 'শাহেদ আলম', 'Banani, Dhaka', 'বনানী, ঢাকা', 4, 'Quick and efficient service. The online report delivery system is very convenient. Would definitely recommend to friends and family.', 'দ্রুত এবং কার্যকর সেবা। অনলাইন রিপোর্ট ডেলিভারি সিস্টেম খুবই সুবিধাজনক।', 'Online Reports', 'অনলাইন রিপোর্ট', 6);
