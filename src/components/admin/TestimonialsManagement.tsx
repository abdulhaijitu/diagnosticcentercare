import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useTestimonials, Testimonial } from "@/hooks/useTestimonials";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Star, Loader2, MessageSquareQuote, Upload, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TestimonialForm {
  name: string;
  name_bn: string;
  location: string;
  location_bn: string;
  rating: number;
  text: string;
  text_bn: string;
  service: string;
  service_bn: string;
  is_active: boolean;
  sort_order: number;
  image_url: string;
}

const emptyForm: TestimonialForm = {
  name: "", name_bn: "", location: "", location_bn: "",
  rating: 5, text: "", text_bn: "", service: "", service_bn: "",
  is_active: true, sort_order: 0, image_url: "",
};

export function TestimonialsManagement() {
  const { t } = useTranslation();
  const { data: testimonials, isLoading } = useTestimonials();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const ext = file.name.split(".").pop();
      const path = `testimonials/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      setForm((prev) => ({ ...prev, image_url: publicUrl }));
      toast({ title: "সফল", description: "ছবি আপলোড হয়েছে" });
    } catch (error: any) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      name: item.name, name_bn: item.name_bn || "", location: item.location,
      location_bn: item.location_bn || "", rating: item.rating, text: item.text,
      text_bn: item.text_bn || "", service: item.service, service_bn: item.service_bn || "",
      is_active: item.is_active, sort_order: item.sort_order, image_url: item.image_url || "",
    });
    setIsFormOpen(true);
  };

  const openDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.text || !form.service) {
      toast({ title: "ত্রুটি", description: "নাম, রিভিউ এবং সার্ভিস আবশ্যক", variant: "destructive" });
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = { ...form, image_url: form.image_url || null };
      if (editingId) {
        const { error } = await supabase.from("testimonials").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "সফল", description: "রিভিউ আপডেট হয়েছে" });
      } else {
        const { error } = await supabase.from("testimonials").insert(payload);
        if (error) throw error;
        toast({ title: "সফল", description: "নতুন রিভিউ যোগ হয়েছে" });
      }
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setIsFormOpen(false);
    } catch (error: any) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("testimonials").delete().eq("id", deleteId);
      if (error) throw error;
      toast({ title: "সফল", description: "রিভিউ মুছে ফেলা হয়েছে" });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    } catch (error: any) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      setIsDeleteOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareQuote className="h-5 w-5" />
                টেস্টিমোনিয়াল ম্যানেজমেন্ট
              </CardTitle>
              <CardDescription>রিভিউ যোগ, সম্পাদনা ও মুছে ফেলুন</CardDescription>
            </div>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              নতুন রিভিউ যোগ করুন
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম</TableHead>
                  <TableHead>সার্ভিস</TableHead>
                  <TableHead>রেটিং</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!testimonials || testimonials.length === 0) ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      কোনো রিভিউ নেই
                    </TableCell>
                  </TableRow>
                ) : (
                  testimonials.map((item) => (
                    <TableRow key={item.id}>
                       <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {item.image_url && <AvatarImage src={item.image_url} alt={item.name} />}
                            <AvatarFallback className="text-xs">{item.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.name_bn && <p className="text-xs text-muted-foreground">{item.name_bn}</p>}
                            <p className="text-xs text-muted-foreground">{item.location}</p>
                          </div>
                        </div>
                       </TableCell>
                      <TableCell className="text-sm">{item.service}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-care-amber text-care-amber" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${item.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {item.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => openDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "রিভিউ সম্পাদনা" : "নতুন রিভিউ যোগ"}</DialogTitle>
            <DialogDescription>রিভিউয়ারের তথ্য এবং মতামত দিন</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>নাম (ইংরেজি) *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>নাম (বাংলা)</Label>
              <Input value={form.name_bn} onChange={(e) => setForm({ ...form, name_bn: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>লোকেশন (ইংরেজি) *</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>লোকেশন (বাংলা)</Label>
              <Input value={form.location_bn} onChange={(e) => setForm({ ...form, location_bn: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>সার্ভিস (ইংরেজি) *</Label>
              <Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>সার্ভিস (বাংলা)</Label>
              <Input value={form.service_bn} onChange={(e) => setForm({ ...form, service_bn: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>রেটিং (১-৫)</Label>
              <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} />
            </div>
            <div className="space-y-2">
              <Label>ক্রম</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>রিভিউ (ইংরেজি) *</Label>
              <Textarea rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>রিভিউ (বাংলা)</Label>
              <Textarea rows={3} value={form.text_bn} onChange={(e) => setForm({ ...form, text_bn: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>ছবি</Label>
              {form.image_url ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={form.image_url} alt="Preview" />
                    <AvatarFallback>IMG</AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, image_url: "" })}>
                    <X className="h-4 w-4 mr-1" /> সরান
                  </Button>
                </div>
              ) : (
                <div>
                  <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {isUploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>সক্রিয়</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />সেভ হচ্ছে...</> : editingId ? "আপডেট করুন" : "যোগ করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>রিভিউ মুছে ফেলুন?</AlertDialogTitle>
            <AlertDialogDescription>এই রিভিউটি স্থায়ীভাবে মুছে ফেলা হবে। এটি পূর্বাবস্থায় ফেরানো যাবে না।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "মুছে ফেলুন"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
