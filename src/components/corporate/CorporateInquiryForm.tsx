import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Loader2, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  company_name: z.string().trim().min(2, "কোম্পানির নাম দিন").max(100),
  contact_person: z.string().trim().min(2, "যোগাযোগকারীর নাম দিন").max(100),
  email: z.string().trim().email("সঠিক ইমেইল দিন").max(255),
  phone: z.string().trim().min(11, "সঠিক ফোন নম্বর দিন").max(15),
  employee_count: z.string().min(1, "কর্মী সংখ্যা নির্বাচন করুন"),
  preferred_package: z.string().min(1, "প্যাকেজ নির্বাচন করুন"),
  message: z.string().trim().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CorporateInquiryFormProps {
  defaultPackage?: string;
  trigger?: React.ReactNode;
}

export function CorporateInquiryForm({ defaultPackage, trigger }: CorporateInquiryFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      employee_count: "",
      preferred_package: defaultPackage || "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("corporate_inquiries" as any)
        .insert({
          company_name: data.company_name,
          contact_person: data.contact_person,
          email: data.email,
          phone: data.phone,
          employee_count: data.employee_count,
          preferred_package: data.preferred_package,
          message: data.message || null,
        });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "অনুসন্ধান সফল!",
        description: "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
      });

      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        reset();
      }, 2000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "সমস্যা হয়েছে",
        description: "অনুগ্রহ করে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const employeeCounts = [
    { value: "20-50", label: "২০-৫০ জন" },
    { value: "51-100", label: "৫১-১০০ জন" },
    { value: "101-200", label: "১০১-২০০ জন" },
    { value: "201-500", label: "২০১-৫০০ জন" },
    { value: "500+", label: "৫০০+ জন" },
  ];

  const packages = [
    { value: "basic", label: "বেসিক প্যাকেজ (৳১,৫০০/জন)" },
    { value: "standard", label: "স্ট্যান্ডার্ড প্যাকেজ (৳২,৫০০/জন)" },
    { value: "premium", label: "প্রিমিয়াম প্যাকেজ (৳৪,৫০০/জন)" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Building2 className="h-4 w-4 mr-2" />
            অনুসন্ধান করুন
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            কর্পোরেট প্যাকেজ অনুসন্ধান
          </DialogTitle>
          <DialogDescription>
            আপনার প্রতিষ্ঠানের তথ্য দিন, আমরা শীঘ্রই যোগাযোগ করব।
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">ধন্যবাদ!</h3>
            <p className="text-muted-foreground">
              আপনার অনুসন্ধান সফলভাবে জমা হয়েছে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">প্রতিষ্ঠানের নাম *</Label>
                <Input
                  id="company_name"
                  placeholder="কোম্পানি লিমিটেড"
                  {...register("company_name")}
                />
                {errors.company_name && (
                  <p className="text-sm text-destructive">{errors.company_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_person">যোগাযোগকারীর নাম *</Label>
                <Input
                  id="contact_person"
                  placeholder="মোহাম্মদ করিম"
                  {...register("contact_person")}
                />
                {errors.contact_person && (
                  <p className="text-sm text-destructive">{errors.contact_person.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@company.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">ফোন নম্বর *</Label>
                <Input
                  id="phone"
                  placeholder="০১৭XXXXXXXX"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>কর্মী সংখ্যা *</Label>
                <Select
                  value={watch("employee_count")}
                  onValueChange={(value) => setValue("employee_count", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeCounts.map((count) => (
                      <SelectItem key={count.value} value={count.value}>
                        {count.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employee_count && (
                  <p className="text-sm text-destructive">{errors.employee_count.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>পছন্দের প্যাকেজ *</Label>
                <Select
                  value={watch("preferred_package")}
                  onValueChange={(value) => setValue("preferred_package", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="প্যাকেজ নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.value} value={pkg.value}>
                        {pkg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.preferred_package && (
                  <p className="text-sm text-destructive">{errors.preferred_package.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">অতিরিক্ত তথ্য (ঐচ্ছিক)</Label>
              <Textarea
                id="message"
                placeholder="আপনার বিশেষ প্রয়োজনীয়তা বা প্রশ্ন থাকলে জানান..."
                rows={3}
                {...register("message")}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  জমা হচ্ছে...
                </>
              ) : (
                "অনুসন্ধান জমা দিন"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}