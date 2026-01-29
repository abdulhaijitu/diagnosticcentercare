import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiagnosticTest, useDiagnosticTests } from "@/hooks/useDiagnosticTests";
import { 
  ArrowLeft, 
  Clock, 
  Droplets, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Phone,
  Home,
  Tag,
  Percent
} from "lucide-react";

const TestDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: test, isLoading, error } = useDiagnosticTest(slug || "");
  const { data: allTests } = useDiagnosticTests();

  // Get related tests from same category
  const relatedTests = allTests?.filter(
    t => t.category === test?.category && t.id !== test?.id
  ).slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-padding">
          <div className="container-custom">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-padding">
          <div className="container-custom text-center py-16">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">টেস্ট পাওয়া যায়নি</h1>
            <p className="text-muted-foreground mb-6">
              দুঃখিত, আপনি যে টেস্টটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি।
            </p>
            <Button asChild>
              <Link to="/tests">সব টেস্ট দেখুন</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = test.discounted_price 
    ? Math.round(((test.price - test.discounted_price) / test.price) * 100) 
    : 0;

  return (
    <>
      <SEOHead 
        title={test.name_bn || test.name}
        titleBn={test.name_bn}
        description={`${test.name} - ${test.description || 'Book this test at TrustCare'}. Price: ৳${test.discounted_price || test.price}. ${test.report_time || 'Quick results'}.`}
        descriptionBn={test.description_bn || `${test.name_bn || test.name} - দাম: ৳${test.discounted_price || test.price}।`}
        url={`https://diagnosticcentercare.lovable.app/tests/${test.slug}`}
      />
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border py-4">
          <div className="container-custom">
            <Link 
              to="/tests" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              সব টেস্ট দেখুন
            </Link>
          </div>
        </div>

        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Title & Category */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {test.category_bn || test.category}
                    </Badge>
                    {test.is_popular && (
                      <Badge className="bg-accent text-accent-foreground">জনপ্রিয়</Badge>
                    )}
                  </div>
                  <h1 className="text-display-sm md:text-display-md font-bold text-foreground mb-2">
                    {test.name_bn || test.name}
                  </h1>
                  <p className="text-muted-foreground">{test.name}</p>
                </div>

                {/* Description */}
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      টেস্ট সম্পর্কে
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {test.description_bn || test.description || "এই টেস্ট সম্পর্কে বিস্তারিত তথ্য শীঘ্রই আপডেট করা হবে।"}
                    </p>
                  </CardContent>
                </Card>

                {/* Test Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Sample Type */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Droplets className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">স্যাম্পলের ধরন</h3>
                          <p className="text-muted-foreground">
                            {test.sample_type_bn || test.sample_type || "তথ্য নেই"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Report Time */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">রিপোর্ট সময়</h3>
                          <p className="text-muted-foreground">
                            {test.report_time_bn || test.report_time || "তথ্য নেই"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Preparation */}
                {(test.preparation || test.preparation_bn) && (
                  <Card className="border-2 border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20">
                    <CardContent className="pt-6">
                      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        টেস্টের পূর্ব প্রস্তুতি
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {test.preparation_bn || test.preparation}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Benefits */}
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      TrustCare-এ কেন টেস্ট করাবেন?
                    </h2>
                    <ul className="space-y-3">
                      {[
                        "NABL অ্যাক্রিডিটেড ল্যাবরেটরি",
                        "অভিজ্ঞ প্যাথলজিস্ট দ্বারা রিপোর্ট ভেরিফিকেশন",
                        "সময়মতো রিপোর্ট ডেলিভারি",
                        "অনলাইনে রিপোর্ট ডাউনলোড সুবিধা",
                        "হোম স্যাম্পল কালেকশন সুবিধা",
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Pricing & Booking */}
              <div className="space-y-6">
                <Card className="sticky top-24 shadow-lg border-2 border-primary/20">
                  <CardContent className="pt-6">
                    {/* Price */}
                    <div className="text-center mb-6">
                      {test.discounted_price ? (
                        <>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-lg text-muted-foreground line-through">
                              ৳{test.price}
                            </span>
                            <Badge className="bg-destructive text-destructive-foreground">
                              <Percent className="h-3 w-3 mr-1" />
                              {discount}% ছাড়
                            </Badge>
                          </div>
                          <div className="text-4xl font-bold text-primary">
                            ৳{test.discounted_price}
                          </div>
                        </>
                      ) : (
                        <div className="text-4xl font-bold text-primary">
                          ৳{test.price}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">সব ট্যাক্স অন্তর্ভুক্ত</p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <Button asChild size="lg" className="w-full">
                        <Link to={`/book-test?test=${test.slug}`}>
                          <Tag className="h-4 w-4 mr-2" />
                          এখনই বুক করুন
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="w-full">
                        <Link to={`/book-test?test=${test.slug}&home=true`}>
                          <Home className="h-4 w-4 mr-2" />
                          হোম কালেকশন
                        </Link>
                      </Button>
                    </div>

                    {/* Contact */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground text-center mb-3">
                        প্রশ্ন আছে? আমাদের কল করুন
                      </p>
                      <a 
                        href="tel:01345580203"
                        className="flex items-center justify-center gap-2 text-primary font-medium hover:underline"
                      >
                        <Phone className="h-4 w-4" />
                        01345-580203
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Related Tests */}
            {relatedTests && relatedTests.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  একই ক্যাটাগরির অন্যান্য টেস্ট
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedTests.map((relatedTest) => (
                    <Link key={relatedTest.id} to={`/tests/${relatedTest.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                            {relatedTest.name_bn || relatedTest.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {relatedTest.report_time_bn || relatedTest.report_time}
                          </p>
                          <div className="flex items-center gap-2">
                            {relatedTest.discounted_price ? (
                              <>
                                <span className="text-lg font-bold text-primary">
                                  ৳{relatedTest.discounted_price}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  ৳{relatedTest.price}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-primary">
                                ৳{relatedTest.price}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
    </>
  );
};

export default TestDetail;
