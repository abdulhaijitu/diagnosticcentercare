import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}

// Local SEO structured data for healthcare
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": "https://diagnosticcentercare.lovable.app",
  name: "TrustCare Diagnostic & Consultation Center Limited",
  alternateName: "ট্রাস্ট কেয়ার ডায়াগনোস্টিক এন্ড কনসালটেশন সেন্টার লিমিটেড",
  description: "Fast & Accurate Lab Service - Your Trust, Your Care",
  url: "https://diagnosticcentercare.lovable.app",
  telephone: "+8801345580203",
  email: "trustcaredc@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot-04, Block-F, Dhaka Uddan Co-operative Housing Society Ltd, Chandrima Model Town, Avenue-1 Gate Chowrasta",
    addressLocality: "Mohammadpur",
    addressRegion: "Dhaka",
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
  image: "https://diagnosticcentercare.lovable.app/favicon.png",
  sameAs: [],
  medicalSpecialty: ["Pathology", "Radiology", "Diagnostic Imaging"],
  availableService: [
    {
      "@type": "MedicalTest",
      name: "Blood Tests",
    },
    {
      "@type": "MedicalTest",
      name: "X-Ray",
    },
    {
      "@type": "MedicalTest",
      name: "Ultrasound",
    },
    {
      "@type": "MedicalTest",
      name: "ECG",
    },
  ],
};

const DEFAULT_TITLE = "TrustCare Diagnostic Center";
const DEFAULT_DESCRIPTION =
  "TrustCare Diagnostic & Consultation Center - Fast & Accurate Lab Service. Blood tests, X-ray, Ultrasound, ECG & Health Checkups in Dhaka.";
const DEFAULT_DESCRIPTION_BN =
  "ট্রাস্ট কেয়ার ডায়াগনোস্টিক সেন্টার - দ্রুত ও নির্ভুল ল্যাব সার্ভিস। রক্ত পরীক্ষা, এক্স-রে, আল্ট্রাসাউন্ড, ইসিজি ও হেলথ চেকআপ।";
const DEFAULT_KEYWORDS =
  "diagnostic center dhaka, blood test dhaka, pathology lab bangladesh, health checkup dhaka, x-ray ultrasound ecg, home sample collection dhaka, ট্রাস্ট কেয়ার, ডায়াগনোস্টিক সেন্টার ঢাকা";
const BASE_URL = "https://diagnosticcentercare.lovable.app";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export function SEOHead({
  title,
  titleBn,
  description = DEFAULT_DESCRIPTION,
  descriptionBn = DEFAULT_DESCRIPTION_BN,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = "website",
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | TrustCare Diagnostic Center` : DEFAULT_TITLE;
  const fullTitleBn = titleBn ? `${titleBn} | ট্রাস্ট কেয়ার` : undefined;

  // Combine English and Bangla descriptions for meta
  const combinedDescription = `${description} ${descriptionBn}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={combinedDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="TrustCare Diagnostic Center" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={url} />

      {/* Language alternates */}
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="bn" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="bn_BD" />
      <meta property="og:site_name" content="TrustCare Diagnostic Center" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Bangla title for accessibility */}
      {fullTitleBn && <meta name="title:bn" content={fullTitleBn} />}

      {/* Local Business Schema */}
      <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>

      {/* Additional Healthcare SEO */}
      <meta name="geo.region" content="BD-13" />
      <meta name="geo.placename" content="Dhaka" />
      <meta name="geo.position" content="23.7644;90.3588" />
      <meta name="ICBM" content="23.7644, 90.3588" />
    </Helmet>
  );
}
