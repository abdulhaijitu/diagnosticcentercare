import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAllCorporatePackages, useCorporatePackageMutations, CorporatePackage } from "@/hooks/useCorporatePackages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Package, GripVertical, Star } from "lucide-react";

type PackageFormData = {
  name: string;
  name_en: string;
  price: number;
  price_label: string;
  min_employees: number;
  description: string;
  tests: string;
  features: string;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
};

const emptyForm: PackageFormData = {
  name: "",
  name_en: "",
  price: 0,
  price_label: "প্রতি জন",
  min_employees: 20,
  description: "",
  tests: "",
  features: "",
  is_popular: false,
  is_active: true,
  sort_order: 0,
};

function packageToForm(pkg: CorporatePackage): PackageFormData {
  return {
    name: pkg.name,
    name_en: pkg.name_en,
    price: pkg.price,
    price_label: pkg.price_label,
    min_employees: pkg.min_employees,
    description: pkg.description || "",
    tests: pkg.tests.join("\n"),
    features: pkg.features.join("\n"),
    is_popular: pkg.is_popular,
    is_active: pkg.is_active,
    sort_order: pkg.sort_order,
  };
}

export function HealthPackagesManagement() {
  const { t } = useTranslation();
  const { data: packages, isLoading } = useAllCorporatePackages();
  const { createPackage, updatePackage, deletePackage } = useCorporatePackageMutations();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageFormData>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: (packages?.length || 0) + 1 });
    setIsFormOpen(true);
  };

  const openEdit = (pkg: CorporatePackage) => {
    setEditingId(pkg.id);
    setForm(packageToForm(pkg));
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      name: form.name,
      name_en: form.name_en,
      price: form.price,
      price_label: form.price_label,
      min_employees: form.min_employees,
      description: form.description || null,
      tests: form.tests.split("\n").map(s => s.trim()).filter(Boolean),
      features: form.features.split("\n").map(s => s.trim()).filter(Boolean),
      is_popular: form.is_popular,
      is_active: form.is_active,
      sort_order: form.sort_order,
    };

    if (editingId) {
      updatePackage.mutate({ id: editingId, ...payload }, {
        onSuccess: () => setIsFormOpen(false),
      });
    } else {
      createPackage.mutate(payload as any, {
        onSuccess: () => setIsFormOpen(false),
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deletePackage.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">হেলথ প্যাকেজ ম্যানেজমেন্ট</h2>
          <p className="text-sm text-muted-foreground">মোট {packages?.length || 0} টি প্যাকেজ</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          নতুন প্যাকেজ
        </Button>
      </div>

      {/* Packages List */}
      {!packages || packages.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">কোনো প্যাকেজ নেই</h3>
            <p className="text-sm text-muted-foreground mb-4">নতুন হেলথ প্যাকেজ যোগ করুন</p>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              প্যাকেজ যোগ করুন
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={!pkg.is_active ? "opacity-60" : ""}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground pt-1">
                    <GripVertical className="h-4 w-4" />
                    <span className="text-xs font-mono w-5 text-center">{pkg.sort_order}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                      <span className="text-sm text-muted-foreground">({pkg.name_en})</span>
                      {pkg.is_popular && <Badge className="bg-accent text-accent-foreground text-xs">জনপ্রিয়</Badge>}
                      {!pkg.is_active && <Badge variant="secondary" className="text-xs">নিষ্ক্রিয়</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">৳{pkg.price.toLocaleString()}/{pkg.price_label}</span>
                      <span>{pkg.tests.length} টি টেস্ট</span>
                      <span>{pkg.features.length} টি সুবিধা</span>
                      <span>ন্যূনতম {pkg.min_employees} জন</span>
                    </div>
                    {pkg.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{pkg.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(pkg)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(pkg.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "প্যাকেজ সম্পাদনা" : "নতুন প্যাকেজ"}</DialogTitle>
            <DialogDescription>
              {editingId ? "প্যাকেজের তথ্য আপডেট করুন" : "নতুন হেলথ প্যাকেজের বিবরণ দিন"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>নাম (বাংলা)</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="বেসিক প্যাকেজ" />
              </div>
              <div>
                <Label>Name (English)</Label>
                <Input value={form.name_en} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))} placeholder="Basic Package" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>মূল্য (৳)</Label>
                <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
              </div>
              <div>
                <Label>মূল্য লেবেল</Label>
                <Input value={form.price_label} onChange={e => setForm(f => ({ ...f, price_label: e.target.value }))} />
              </div>
              <div>
                <Label>ন্যূনতম কর্মী</Label>
                <Input type="number" value={form.min_employees} onChange={e => setForm(f => ({ ...f, min_employees: Number(e.target.value) }))} />
              </div>
            </div>

            <div>
              <Label>বিবরণ</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="প্যাকেজের সংক্ষিপ্ত বিবরণ" rows={2} />
            </div>

            <div>
              <Label>টেস্টসমূহ (প্রতি লাইনে একটি)</Label>
              <Textarea value={form.tests} onChange={e => setForm(f => ({ ...f, tests: e.target.value }))} placeholder={"CBC\nBlood Sugar\nLipid Profile"} rows={5} />
            </div>

            <div>
              <Label>সুবিধাসমূহ (প্রতি লাইনে একটি)</Label>
              <Textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder={"অন-সাইট কালেকশন\n২৪ ঘন্টায় রিপোর্ট"} rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ক্রম নম্বর</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_popular} onCheckedChange={v => setForm(f => ({ ...f, is_popular: v }))} />
                <Label className="cursor-pointer">জনপ্রিয়</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
                <Label className="cursor-pointer">সক্রিয়</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>বাতিল</Button>
              <Button
                onClick={handleSubmit}
                disabled={!form.name || !form.name_en || createPackage.isPending || updatePackage.isPending}
              >
                {(createPackage.isPending || updatePackage.isPending) ? "সেভ হচ্ছে..." : editingId ? "আপডেট করুন" : "যোগ করুন"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>প্যাকেজ মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              এই প্যাকেজটি স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deletePackage.isPending ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
