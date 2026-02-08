import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface SEOHeadProps {
  title?: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  keywords?: string;
  keywordsBn?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}

const BASE_URL = "https://diagnosticcentercare.lovable.app";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

const DEFAULT_TITLE_EN = "TrustCare Diagnostic Center";
const DEFAULT_TITLE_BN = "ট্রাস্ট কেয়ার ডায়াগনোস্টিক সেন্টার";

const DEFAULT_DESCRIPTION_EN =
  "TrustCare Diagnostic & Consultation Center - Fast & Accurate Lab Service. Blood tests, X-ray, Ultrasound, ECG & Health Checkups in Dhaka.";
const DEFAULT_DESCRIPTION_BN =
  "ট্রাস্ট কেয়ার ডায়াগনোস্টিক সেন্টার - দ্রুত ও নির্ভুল ল্যাব সার্ভিস। রক্ত পরীক্ষা, এক্স-রে, আল্ট্রাসাউন্ড, ইসিজি ও হেলথ চেকআপ।";

const DEFAULT_KEYWORDS_EN =
  "diagnostic center dhaka, blood test dhaka, pathology lab bangladesh, health checkup dhaka, x-ray ultrasound ecg, home sample collection dhaka";
const DEFAULT_KEYWORDS_BN =
  "ট্রাস্ট কেয়ার, ডায়াগনোস্টিক সেন্টার ঢাকা, রক্ত পরীক্ষা ঢাকা, প্যাথলজি ল্যাব বাংলাদেশ, হেলথ চেকআপ ঢাকা, এক্স-রে আল্ট্রাসাউন্ড ইসিজি";

// Local SEO structured data - language-aware
const getLocalBusinessSchema = (isBn: boolean) => ({
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": BASE_URL,
  name: isBn
    ? "ট্রাস্ট কেয়ার ডায়াগনোস্টিক এন্ড কনসালটেশন সেন্টার লিমিটেড"
    : "TrustCare Diagnostic & Consultation Center Limited",
  alternateName: isBn
    ? "TrustCare Diagnostic & Consultation Center Limited"
    : "ট্রাস্ট কেয়ার ডায়াগনোস্টিক এন্ড কনসালটেশন সেন্টার লিমিটেড",
  description: isBn
    ? "দ্রুত ও নির্ভুল ল্যাব সার্ভিস - আপনার বিশ্বাস, আপনার যত্ন"
    : "Fast & Accurate Lab Service - Your Trust, Your Care",
  url: BASE_URL,
  telephone: "+8801345580203",
  email: "trustcaredc@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: isBn
      ? "প্লট-০৪, ব্লক-এফ, ঢাকা উদ্দান সমবায় আবাসন সমিতি লিমিটেড, চন্দ্রিমা মডেল টাউন, অ্যাভিনিউ-১ গেট চৌরাস্তা"
      : "Plot-04, Block-F, Dhaka Uddan Co-operative Housing Society Ltd, Chandrima Model Town, Avenue-1 Gate Chowrasta",
    addressLocality: isBn ? "মোহাম্মদপুর" : "Mohammadpur",
    addressRegion: isBn ? "ঢাকা" : "Dhaka",
    postalCode: "1207",
    addressCountry: "BD",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.7644,
    longitude: 90.3588,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  priceRange: "৳৳",
  image: `${BASE_URL}/favicon.png`,
  sameAs: [],
  medicalSpecialty: isBn
    ? ["প্যাথলজি", "রেডিওলজি", "ডায়াগনস্টিক ইমেজিং"]
    : ["Pathology", "Radiology", "Diagnostic Imaging"],
  availableService: isBn
    ? [
        { "@type": "MedicalTest", name: "রক্ত পরীক্ষা" },
        { "@type": "MedicalTest", name: "এক্স-রে" },
        { "@type": "MedicalTest", name: "আল্ট্রাসাউন্ড" },
        { "@type": "MedicalTest", name: "ইসিজি" },
      ]
    : [
        { "@type": "MedicalTest", name: "Blood Tests" },
        { "@type": "MedicalTest", name: "X-Ray" },
        { "@type": "MedicalTest", name: "Ultrasound" },
        { "@type": "MedicalTest", name: "ECG" },
      ],
});

export function SEOHead({
  title,
  titleBn,
  description,
  descriptionBn,
  keywords,
  keywordsBn,
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = "website",
  noIndex = false,
}: SEOHeadProps) {
  const { i18n } = useTranslation();
  const isBn = i18n.language === "bn";

  // Select title based on current language
  const activeTitle = isBn
    ? titleBn
      ? `${titleBn} | ট্রাস্ট কেয়ার`
      : DEFAULT_TITLE_BN
    : title
      ? `${title} | TrustCare Diagnostic Center`
      : DEFAULT_TITLE_EN;

  // Select description based on current language
  const activeDescription = isBn
    ? descriptionBn || DEFAULT_DESCRIPTION_BN
    : description || DEFAULT_DESCRIPTION_EN;

  // Select keywords based on current language
  const activeKeywords = isBn
    ? keywordsBn || DEFAULT_KEYWORDS_BN
    : keywords || DEFAULT_KEYWORDS_EN;

  const activeLocale = isBn ? "bn_BD" : "en_US";
  const altLocale = isBn ? "en_US" : "bn_BD";
  const activeSiteName = isBn ? "ট্রাস্ট কেয়ার ডায়াগনোস্টিক সেন্টার" : "TrustCare Diagnostic Center";
  const activeAuthor = isBn ? "ট্রাস্ট কেয়ার ডায়াগনোস্টিক সেন্টার" : "TrustCare Diagnostic Center";
  const activePlacename = isBn ? "ঢাকা" : "Dhaka";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={isBn ? "bn" : "en"} />
      <title>{activeTitle}</title>
      <meta name="title" content={activeTitle} />
      <meta name="description" content={activeDescription} />
      <meta name="keywords" content={activeKeywords} />
      <meta name="author" content={activeAuthor} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={url} />

      {/* Language alternates */}
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="bn" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={activeTitle} />
      <meta property="og:description" content={activeDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={activeLocale} />
      <meta property="og:locale:alternate" content={altLocale} />
      <meta property="og:site_name" content={activeSiteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={activeTitle} />
      <meta name="twitter:description" content={activeDescription} />
      <meta name="twitter:image" content={image} />

      {/* Local Business Schema */}
      <script type="application/ld+json">{JSON.stringify(getLocalBusinessSchema(isBn))}</script>

      {/* Additional Healthcare SEO */}
      <meta name="geo.region" content="BD-13" />
      <meta name="geo.placename" content={activePlacename} />
      <meta name="geo.position" content="23.7644;90.3588" />
      <meta name="ICBM" content="23.7644, 90.3588" />
    </Helmet>
  );
}
