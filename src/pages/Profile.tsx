import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Loader2, User, Mail, Phone, MapPin, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
  });
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: t("profilePage.invalidFile"),
        description: t("profilePage.selectImage"),
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t("profilePage.fileTooLarge"),
        description: t("profilePage.selectUnder5MB"),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      await refreshProfile();
      toast({
        title: t("profilePage.avatarUpdated"),
        description: t("profilePage.avatarSuccess"),
      });
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: t("profilePage.uploadFailed"),
        description: error.message || t("profilePage.uploadFailed"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
        })
        .eq("id", user.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: t("profilePage.profileUpdated"),
        description: t("profilePage.profileSuccess"),
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: t("profilePage.updateFailed"),
        description: error.message || t("profilePage.updateFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="My Profile"
        titleBn="আমার প্রোফাইল"
        description="Manage your personal information and account settings."
        descriptionBn="আপনার ব্যক্তিগত তথ্য এবং একাউন্ট সেটিংস ম্যানেজ করুন।"
        noIndex={true}
      />
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero text-white py-12 md:py-16">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-display-sm md:text-display-md font-bold mb-2">
                {t("profilePage.title")}
              </h1>
              <p className="text-white/80">
                {t("profilePage.subtitle")}
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-2xl">
            <Card className="shadow-card">
              <CardHeader className="text-center pb-0">
                <div className="relative inline-block mx-auto mb-4">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-elevated">
                    <AvatarImage src={avatarUrl} alt={formData.full_name || "User"} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {getInitials(formData.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handleAvatarClick}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <CardTitle>{formData.full_name || "User"}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {t("profilePage.fullName")}
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      placeholder={t("profilePage.fullNamePlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {t("profilePage.email")}
                    </Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {t("profilePage.phoneNumber")}
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder={t("profilePage.phonePlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {t("profilePage.address")}
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder={t("profilePage.addressPlaceholder")}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t("profilePage.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t("profilePage.saveChanges")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
