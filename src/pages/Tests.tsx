import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useDiagnosticTests, useTestCategories } from "@/hooks/useDiagnosticTests";
import { 
  Search, 
  Filter, 
  Clock, 
  Percent,
  X,
  Microscope,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const Tests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data: tests, isLoading } = useDiagnosticTests();
  const { data: categories } = useTestCategories();

  const filteredTests = useMemo(() => {
    if (!tests) return [];
    
    return tests.filter((test) => {
      const matchesSearch = 
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.name_bn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || test.category === selectedCategory;
      const matchesPopular = !showPopularOnly || test.is_popular;
      
      return matchesSearch && matchesCategory && matchesPopular;
    });
  }, [tests, searchQuery, selectedCategory, showPopularOnly]);

  const activeFilterCount = (selectedCategory ? 1 : 0) + (showPopularOnly ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory(null);
    setShowPopularOnly(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Popular Filter */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">ফিল্টার</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPopularOnly}
            onChange={(e) => setShowPopularOnly(e.target.checked)}
            className="rounded border-border"
          />
          <span className="text-sm text-muted-foreground">শুধু জনপ্রিয় টেস্ট দেখান</span>
        </label>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">ক্যাটাগরি</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
              !selectedCategory
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            সব ক্যাটাগরি
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                selectedCategory === cat.category
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              {cat.category_bn || cat.category}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          ফিল্টার মুছুন
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-12 md:py-16">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-display-sm md:text-display-md font-bold mb-4">
                ডায়াগনস্টিক টেস্ট সমূহ
              </h1>
              <p className="text-white/80 mb-6">
                আমাদের সব ডায়াগনস্টিক টেস্টের তালিকা দেখুন এবং সরাসরি বুক করুন
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="টেস্ট খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white text-foreground border-0"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="flex gap-8">
              {/* Sidebar - Desktop */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <FilterContent />
                </div>
              </aside>

              {/* Tests Grid */}
              <div className="flex-1">
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredTests.length} টি টেস্ট পাওয়া গেছে
                  </p>
                  <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        ফিল্টার
                        {activeFilterCount > 0 && (
                          <Badge className="ml-2" variant="secondary">
                            {activeFilterCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>ফিল্টার করুন</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Results Count - Desktop */}
                <div className="hidden lg:flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    {filteredTests.length} টি টেস্ট পাওয়া গেছে
                  </p>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      ফিল্টার মুছুন
                    </Button>
                  )}
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className="pt-6">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-8 w-24" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredTests.length === 0 && (
                  <div className="text-center py-16">
                    <Microscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      কোনো টেস্ট পাওয়া যায়নি
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      আপনার সার্চ বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।
                    </p>
                    <Button onClick={clearFilters}>সব ফিল্টার মুছুন</Button>
                  </div>
                )}

                {/* Tests Grid */}
                {!isLoading && filteredTests.length > 0 && (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTests.map((test) => {
                      const discount = test.discounted_price 
                        ? Math.round(((test.price - test.discounted_price) / test.price) * 100) 
                        : 0;

                      return (
                        <Link key={test.id} to={`/tests/${test.slug}`}>
                          <Card className="h-full hover:shadow-lg transition-all duration-200 group">
                            <CardContent className="pt-6">
                              {/* Category & Popular Badge */}
                              <div className="flex items-center justify-between mb-3">
                                <Badge variant="secondary" className="text-xs">
                                  {test.category_bn || test.category}
                                </Badge>
                                {test.is_popular && (
                                  <Badge className="bg-accent text-accent-foreground text-xs">
                                    জনপ্রিয়
                                  </Badge>
                                )}
                              </div>

                              {/* Test Name */}
                              <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                {test.name_bn || test.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                                {test.name}
                              </p>

                              {/* Report Time */}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <Clock className="h-4 w-4" />
                                <span>{test.report_time_bn || test.report_time}</span>
                              </div>

                              {/* Price */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {test.discounted_price ? (
                                    <>
                                      <span className="text-xl font-bold text-primary">
                                        ৳{test.discounted_price}
                                      </span>
                                      <span className="text-sm text-muted-foreground line-through">
                                        ৳{test.price}
                                      </span>
                                      <Badge variant="destructive" className="text-xs">
                                        <Percent className="h-3 w-3 mr-1" />
                                        {discount}%
                                      </Badge>
                                    </>
                                  ) : (
                                    <span className="text-xl font-bold text-primary">
                                      ৳{test.price}
                                    </span>
                                  )}
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="text-display-sm font-bold mb-4">
              হোম স্যাম্পল কালেকশন সুবিধা
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              ঘরে বসেই আপনার টেস্ট করান। আমাদের প্রশিক্ষিত টিম আপনার দোরগোড়ায় এসে স্যাম্পল সংগ্রহ করবে।
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/book-test">
                হোম কালেকশন বুক করুন
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tests;
