-- Create diagnostic_tests table
CREATE TABLE public.diagnostic_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  category_bn TEXT,
  description TEXT,
  description_bn TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  discounted_price INTEGER,
  sample_type TEXT,
  sample_type_bn TEXT,
  preparation TEXT,
  preparation_bn TEXT,
  report_time TEXT,
  report_time_bn TEXT,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.diagnostic_tests ENABLE ROW LEVEL SECURITY;

-- Anyone can view active tests
CREATE POLICY "Anyone can view active tests"
ON public.diagnostic_tests
FOR SELECT
USING (is_active = true);

-- Admins can manage all tests
CREATE POLICY "Admins can manage all tests"
ON public.diagnostic_tests
FOR ALL
USING (is_admin_or_manager(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_diagnostic_tests_updated_at
BEFORE UPDATE ON public.diagnostic_tests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample diagnostic tests
INSERT INTO public.diagnostic_tests (name, name_bn, slug, category, category_bn, description, description_bn, price, discounted_price, sample_type, sample_type_bn, preparation, preparation_bn, report_time, report_time_bn, is_popular) VALUES
('Complete Blood Count (CBC)', 'কমপ্লিট ব্লাড কাউন্ট (সিবিসি)', 'complete-blood-count', 'Hematology', 'রক্ত পরীক্ষা', 'A complete blood count test measures several components of your blood, including red blood cells, white blood cells, and platelets.', 'কমপ্লিট ব্লাড কাউন্ট টেস্ট আপনার রক্তের বিভিন্ন উপাদান যেমন লাল রক্তকণিকা, সাদা রক্তকণিকা এবং প্লেটলেট পরিমাপ করে।', 500, 400, 'Blood', 'রক্ত', 'No special preparation required. Fasting not necessary.', 'বিশেষ কোনো প্রস্তুতির প্রয়োজন নেই। খালি পেটে থাকতে হবে না।', 'Same Day', 'একই দিন', true),

('Lipid Profile', 'লিপিড প্রোফাইল', 'lipid-profile', 'Biochemistry', 'জৈবরসায়ন', 'Lipid profile measures cholesterol levels including total cholesterol, LDL, HDL, and triglycerides to assess heart disease risk.', 'লিপিড প্রোফাইল কোলেস্টেরল মাত্রা পরিমাপ করে যার মধ্যে মোট কোলেস্টেরল, এলডিএল, এইচডিএল এবং ট্রাইগ্লিসারাইড অন্তর্ভুক্ত।', 800, 650, 'Blood (Fasting)', 'রক্ত (খালি পেটে)', 'Fasting for 10-12 hours required. Water is allowed.', '১০-১২ ঘন্টা খালি পেটে থাকতে হবে। পানি খাওয়া যাবে।', 'Same Day', 'একই দিন', true),

('Blood Sugar (Fasting)', 'ব্লাড সুগার (খালি পেটে)', 'blood-sugar-fasting', 'Diabetes', 'ডায়াবেটিস', 'Fasting blood sugar test measures glucose levels after overnight fasting to diagnose or monitor diabetes.', 'ফাস্টিং ব্লাড সুগার টেস্ট রাতে খালি পেটে থাকার পর গ্লুকোজ মাত্রা পরিমাপ করে ডায়াবেটিস নির্ণয় বা মনিটর করতে।', 150, null, 'Blood', 'রক্ত', 'Fasting for 8-10 hours required. Only water allowed.', '৮-১০ ঘন্টা খালি পেটে থাকতে হবে। শুধু পানি খাওয়া যাবে।', 'Same Day', 'একই দিন', true),

('HbA1c (Glycated Hemoglobin)', 'এইচবিএ১সি', 'hba1c', 'Diabetes', 'ডায়াবেটিস', 'HbA1c test measures average blood sugar levels over the past 2-3 months for diabetes management.', 'এইচবিএ১সি টেস্ট গত ২-৩ মাসের গড় রক্তে শর্করার মাত্রা পরিমাপ করে ডায়াবেটিস নিয়ন্ত্রণে।', 700, 550, 'Blood', 'রক্ত', 'No fasting required.', 'খালি পেটে থাকার প্রয়োজন নেই।', 'Same Day', 'একই দিন', true),

('Thyroid Profile (T3, T4, TSH)', 'থাইরয়েড প্রোফাইল', 'thyroid-profile', 'Hormone', 'হরমোন', 'Thyroid profile measures thyroid hormone levels to detect thyroid disorders.', 'থাইরয়েড প্রোফাইল থাইরয়েড হরমোন মাত্রা পরিমাপ করে থাইরয়েড সমস্যা নির্ণয় করতে।', 1200, 950, 'Blood', 'রক্ত', 'No special preparation. Best done in the morning.', 'বিশেষ কোনো প্রস্তুতির প্রয়োজন নেই। সকালে করা ভালো।', 'Same Day', 'একই দিন', true),

('Liver Function Test (LFT)', 'লিভার ফাংশন টেস্ট', 'liver-function-test', 'Biochemistry', 'জৈবরসায়ন', 'Liver function test assesses overall liver health by measuring various enzymes and proteins.', 'লিভার ফাংশন টেস্ট বিভিন্ন এনজাইম ও প্রোটিন পরিমাপ করে লিভারের সার্বিক স্বাস্থ্য মূল্যায়ন করে।', 900, 750, 'Blood', 'রক্ত', 'Fasting for 8-10 hours recommended.', '৮-১০ ঘন্টা খালি পেটে থাকা বাঞ্ছনীয়।', 'Same Day', 'একই দিন', true),

('Kidney Function Test (KFT)', 'কিডনি ফাংশন টেস্ট', 'kidney-function-test', 'Biochemistry', 'জৈবরসায়ন', 'Kidney function test measures creatinine, urea, and other markers to assess kidney health.', 'কিডনি ফাংশন টেস্ট ক্রিয়েটিনিন, ইউরিয়া এবং অন্যান্য মার্কার পরিমাপ করে কিডনির স্বাস্থ্য মূল্যায়ন করে।', 800, 650, 'Blood', 'রক্ত', 'No special preparation required.', 'বিশেষ কোনো প্রস্তুতির প্রয়োজন নেই।', 'Same Day', 'একই দিন', false),

('Urine Routine Examination', 'ইউরিন রুটিন পরীক্ষা', 'urine-routine', 'Urology', 'মূত্রনালী', 'Urine routine examination checks for infections, kidney problems, and other conditions.', 'ইউরিন রুটিন পরীক্ষা সংক্রমণ, কিডনি সমস্যা এবং অন্যান্য অবস্থা পরীক্ষা করে।', 200, null, 'Urine', 'মূত্র', 'Mid-stream urine sample required. Morning sample preferred.', 'মিড-স্ট্রিম ইউরিন স্যাম্পল প্রয়োজন। সকালের স্যাম্পল ভালো।', 'Same Day', 'একই দিন', false),

('Vitamin D Test', 'ভিটামিন ডি টেস্ট', 'vitamin-d', 'Vitamin', 'ভিটামিন', 'Vitamin D test measures the level of vitamin D in your blood to check for deficiency.', 'ভিটামিন ডি টেস্ট রক্তে ভিটামিন ডি এর মাত্রা পরিমাপ করে অভাব পরীক্ষা করতে।', 1500, 1200, 'Blood', 'রক্ত', 'No fasting required.', 'খালি পেটে থাকার প্রয়োজন নেই।', 'Next Day', 'পরের দিন', true),

('Vitamin B12 Test', 'ভিটামিন বি১২ টেস্ট', 'vitamin-b12', 'Vitamin', 'ভিটামিন', 'Vitamin B12 test checks the level of vitamin B12 to diagnose deficiency or anemia.', 'ভিটামিন বি১২ টেস্ট ভিটামিন বি১২ এর মাত্রা পরীক্ষা করে অভাব বা রক্তস্বল্পতা নির্ণয় করতে।', 1200, 950, 'Blood', 'রক্ত', 'No fasting required.', 'খালি পেটে থাকার প্রয়োজন নেই।', 'Next Day', 'পরের দিন', false),

('Dengue NS1 Antigen', 'ডেঙ্গু এনএস১ এন্টিজেন', 'dengue-ns1', 'Infectious Disease', 'সংক্রামক রোগ', 'Dengue NS1 antigen test detects dengue virus infection in early stages.', 'ডেঙ্গু এনএস১ এন্টিজেন টেস্ট প্রাথমিক পর্যায়ে ডেঙ্গু ভাইরাস সংক্রমণ শনাক্ত করে।', 800, 600, 'Blood', 'রক্ত', 'No special preparation required.', 'বিশেষ কোনো প্রস্তুতির প্রয়োজন নেই।', 'Same Day', 'একই দিন', true),

('COVID-19 RT-PCR', 'কোভিড-১৯ আরটি-পিসিআর', 'covid-rtpcr', 'Infectious Disease', 'সংক্রামক রোগ', 'COVID-19 RT-PCR test detects active coronavirus infection with high accuracy.', 'কোভিড-১৯ আরটি-পিসিআর টেস্ট উচ্চ নির্ভুলতার সাথে সক্রিয় করোনাভাইরাস সংক্রমণ শনাক্ত করে।', 2500, 2000, 'Nasal/Throat Swab', 'নাক/গলার সোয়াব', 'No food or drink 30 minutes before sample collection.', 'স্যাম্পল সংগ্রহের ৩০ মিনিট আগে খাবার বা পানীয় নয়।', '24 Hours', '২৪ ঘন্টা', false),

('ECG (Electrocardiogram)', 'ইসিজি', 'ecg', 'Cardiology', 'হৃদরোগ', 'ECG records the electrical activity of the heart to detect heart conditions.', 'ইসিজি হৃদপিণ্ডের বৈদ্যুতিক কার্যকলাপ রেকর্ড করে হার্টের সমস্যা শনাক্ত করতে।', 400, 300, 'Non-invasive', 'অ-আক্রমণাত্মক', 'Wear loose comfortable clothing. Avoid lotions on chest area.', 'ঢিলেঢালা আরামদায়ক পোশাক পরুন। বুকে লোশন লাগাবেন না।', 'Immediate', 'তাৎক্ষণিক', true),

('X-Ray Chest PA View', 'এক্স-রে চেস্ট পিএ ভিউ', 'xray-chest', 'Radiology', 'রেডিওলজি', 'Chest X-ray provides images of lungs, heart, and chest wall.', 'চেস্ট এক্স-রে ফুসফুস, হার্ট এবং বুকের দেয়ালের ছবি প্রদান করে।', 600, 500, 'Non-invasive', 'অ-আক্রমণাত্মক', 'Remove metal objects. Wear provided gown.', 'ধাতব জিনিস খুলে ফেলুন। দেওয়া গাউন পরুন।', 'Same Day', 'একই দিন', false),

('Ultrasound Whole Abdomen', 'আল্ট্রাসাউন্ড পেট', 'ultrasound-abdomen', 'Radiology', 'রেডিওলজি', 'Ultrasound imaging of the entire abdomen to check organs like liver, kidney, and bladder.', 'পুরো পেটের আল্ট্রাসাউন্ড ইমেজিং লিভার, কিডনি এবং মূত্রাশয়ের মতো অঙ্গগুলো পরীক্ষা করতে।', 1500, 1200, 'Non-invasive', 'অ-আক্রমণাত্মক', 'Fast for 6-8 hours. Full bladder required.', '৬-৮ ঘন্টা খালি পেটে থাকুন। মূত্রাশয় পূর্ণ রাখুন।', 'Same Day', 'একই দিন', true);