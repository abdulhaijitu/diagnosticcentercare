import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Stethoscope,
  GraduationCap,
  Briefcase,
  X,
} from "lucide-react";
import { z } from "zod";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string | null;
  experience_years: number | null;
  consultation_fee: number;
  available_days: string[];
  available_from: string;
  available_to: string;
  slot_duration: number;
  max_patients_per_slot: number;
  avatar_url: string | null;
  bio: string | null;
  is_active: boolean;
}

interface Education {
  id?: string;
  degree: string;
  institution: string;
  year: number | null;
  description: string;
}

interface Experience {
  id?: string;
  position: string;
  organization: string;
  start_year: number;
  end_year: number | null;
  is_current: boolean;
  description: string;
}

const doctorSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক").max(100),
  specialty: z.string().min(1, "বিশেষত্ব আবশ্যক").max(100),
  qualification: z.string().max(200).optional(),
  experience_years: z.number().min(0).max(60).optional(),
  consultation_fee: z.number().min(0).max(100000),
  bio: z.string().max(1000).optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
  available_from: z.string(),
  available_to: z.string(),
  slot_duration: z.number().min(10).max(120),
  max_patients_per_slot: z.number().min(1).max(10),
});

const DAYS_OF_WEEK = [
  "saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday",
];

const SPECIALTIES = [
  "General Physician",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Gynecology",
  "Pediatrics",
  "Neurology",
  "Gastroenterology",
  "ENT",
  "Ophthalmology",
  "Psychiatry",
  "Urology",
];

export function DoctorManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [activeSection, setActiveSection] = useState<"basic" | "education" | "experience">("basic");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    qualification: "",
    experience_years: 0,
    consultation_fee: 500,
    bio: "",
    avatar_url: "",
    available_from: "09:00",
    available_to: "17:00",
    slot_duration: 30,
    max_patients_per_slot: 1,
    available_days: ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"],
    is_active: true,
  });

  const [educationList, setEducationList] = useState<Education[]>([]);
  const [experienceList, setExperienceList] = useState<Experience[]>([]);

  // Fetch doctors
  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Doctor[];
    },
  });

  // Create doctor mutation
  const createDoctor = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: doctor, error } = await supabase
        .from("doctors")
        .insert({
          name: data.name,
          specialty: data.specialty,
          qualification: data.qualification || null,
          experience_years: data.experience_years || null,
          consultation_fee: data.consultation_fee,
          bio: data.bio || null,
          avatar_url: data.avatar_url || null,
          available_from: data.available_from,
          available_to: data.available_to,
          slot_duration: data.slot_duration,
          max_patients_per_slot: data.max_patients_per_slot,
          available_days: data.available_days,
          is_active: data.is_active,
        })
        .select()
        .single();

      if (error) throw error;

      // Add education entries
      if (educationList.length > 0) {
        const { error: eduError } = await supabase
          .from("doctor_education")
          .insert(
            educationList.map((edu) => ({
              doctor_id: doctor.id,
              degree: edu.degree,
              institution: edu.institution,
              year: edu.year,
              description: edu.description || null,
            }))
          );
        if (eduError) console.error("Education insert error:", eduError);
      }

      // Add experience entries
      if (experienceList.length > 0) {
        const { error: expError } = await supabase
          .from("doctor_experience")
          .insert(
            experienceList.map((exp) => ({
              doctor_id: doctor.id,
              position: exp.position,
              organization: exp.organization,
              start_year: exp.start_year,
              end_year: exp.end_year,
              is_current: exp.is_current,
              description: exp.description || null,
            }))
          );
        if (expError) console.error("Experience insert error:", expError);
      }

      return doctor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      toast({ title: t("doctorMgmt.successAdd"), description: t("doctorMgmt.successAddDesc") });
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      console.error("Create error:", error);
      toast({
        title: t("doctorMgmt.error"),
        description: t("doctorMgmt.errorAddDesc"),
        variant: "destructive",
      });
    },
  });

  // Update doctor mutation
  const updateDoctor = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("doctors")
        .update({
          name: data.name,
          specialty: data.specialty,
          qualification: data.qualification || null,
          experience_years: data.experience_years || null,
          consultation_fee: data.consultation_fee,
          bio: data.bio || null,
          avatar_url: data.avatar_url || null,
          available_from: data.available_from,
          available_to: data.available_to,
          slot_duration: data.slot_duration,
          max_patients_per_slot: data.max_patients_per_slot,
          available_days: data.available_days,
          is_active: data.is_active,
        })
        .eq("id", id);

      if (error) throw error;

      // Delete existing education and experience, then re-add
      await supabase.from("doctor_education").delete().eq("doctor_id", id);
      await supabase.from("doctor_experience").delete().eq("doctor_id", id);

      if (educationList.length > 0) {
        await supabase.from("doctor_education").insert(
          educationList.map((edu) => ({
            doctor_id: id,
            degree: edu.degree,
            institution: edu.institution,
            year: edu.year,
            description: edu.description || null,
          }))
        );
      }

      if (experienceList.length > 0) {
        await supabase.from("doctor_experience").insert(
          experienceList.map((exp) => ({
            doctor_id: id,
            position: exp.position,
            organization: exp.organization,
            start_year: exp.start_year,
            end_year: exp.end_year,
            is_current: exp.is_current,
            description: exp.description || null,
          }))
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      toast({ title: t("doctorMgmt.successUpdate"), description: t("doctorMgmt.successUpdateDesc") });
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedDoctor(null);
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: t("doctorMgmt.error"),
        description: t("doctorMgmt.errorUpdateDesc"),
        variant: "destructive",
      });
    },
  });

  // Delete doctor mutation
  const deleteDoctor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("doctors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      toast({ title: t("doctorMgmt.successDelete"), description: t("doctorMgmt.successDeleteDesc") });
      setIsDeleteDialogOpen(false);
      setSelectedDoctor(null);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: t("doctorMgmt.error"),
        description: t("doctorMgmt.errorDeleteDesc"),
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      specialty: "",
      qualification: "",
      experience_years: 0,
      consultation_fee: 500,
      bio: "",
      avatar_url: "",
      available_from: "09:00",
      available_to: "17:00",
      slot_duration: 30,
      max_patients_per_slot: 1,
      available_days: ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"],
      is_active: true,
    });
    setEducationList([]);
    setExperienceList([]);
    setActiveSection("basic");
  };

  const handleEdit = async (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      qualification: doctor.qualification || "",
      experience_years: doctor.experience_years || 0,
      consultation_fee: doctor.consultation_fee,
      bio: doctor.bio || "",
      avatar_url: doctor.avatar_url || "",
      available_from: doctor.available_from,
      available_to: doctor.available_to,
      slot_duration: doctor.slot_duration,
      max_patients_per_slot: doctor.max_patients_per_slot,
      available_days: doctor.available_days,
      is_active: doctor.is_active,
    });

    // Fetch education and experience
    const { data: eduData } = await supabase
      .from("doctor_education")
      .select("*")
      .eq("doctor_id", doctor.id);
    
    const { data: expData } = await supabase
      .from("doctor_experience")
      .select("*")
      .eq("doctor_id", doctor.id);

    setEducationList(
      (eduData || []).map((e) => ({
        id: e.id,
        degree: e.degree,
        institution: e.institution,
        year: e.year,
        description: e.description || "",
      }))
    );

    setExperienceList(
      (expData || []).map((e) => ({
        id: e.id,
        position: e.position,
        organization: e.organization,
        start_year: e.start_year,
        end_year: e.end_year,
        is_current: e.is_current,
        description: e.description || "",
      }))
    );

    setActiveSection("basic");
    setIsEditDialogOpen(true);
  };

  const handleDelete = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    try {
      doctorSchema.parse({
        ...formData,
        experience_years: formData.experience_years || undefined,
        qualification: formData.qualification || undefined,
        bio: formData.bio || undefined,
        avatar_url: formData.avatar_url || undefined,
      });

      if (selectedDoctor) {
        updateDoctor.mutate({ id: selectedDoctor.id, data: formData });
      } else {
        createDoctor.mutate(formData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: t("doctorMgmt.validationError"),
          description: error.errors[0]?.message || t("doctorMgmt.validationErrorDesc"),
          variant: "destructive",
        });
      }
    }
  };

  const addEducation = () => {
    setEducationList([
      ...educationList,
      { degree: "", institution: "", year: null, description: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...educationList];
    updated[index] = { ...updated[index], [field]: value };
    setEducationList(updated);
  };

  const addExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        position: "",
        organization: "",
        start_year: new Date().getFullYear(),
        end_year: null,
        is_current: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experienceList];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "is_current" && value) {
      updated[index].end_year = null;
    }
    setExperienceList(updated);
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDay = (dayId: string) => {
    if (formData.available_days.includes(dayId)) {
      setFormData({
        ...formData,
        available_days: formData.available_days.filter((d) => d !== dayId),
      });
    } else {
      setFormData({
        ...formData,
        available_days: [...formData.available_days, dayId],
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("doctorMgmt.title")}</h2>
          <p className="text-muted-foreground">{t("doctorMgmt.totalDoctors", { count: doctors.length })}</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          {t("doctorMgmt.addDoctor")}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("doctorMgmt.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Doctors Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("doctorMgmt.name")}</TableHead>
                <TableHead>{t("doctorMgmt.specialty")}</TableHead>
                <TableHead>{t("doctorMgmt.experience")}</TableHead>
                <TableHead>{t("doctorMgmt.fee")}</TableHead>
                <TableHead>{t("doctorMgmt.status")}</TableHead>
                <TableHead className="text-right">{t("doctorMgmt.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {doctor.avatar_url ? (
                          <img
                            src={doctor.avatar_url}
                            alt={doctor.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <Stethoscope className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doctor.qualification || t("doctorMgmt.na")}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>
                    {doctor.experience_years ? t("doctorMgmt.yearsExp", { count: doctor.experience_years }) : t("doctorMgmt.na")}
                  </TableCell>
                  <TableCell>৳{doctor.consultation_fee}</TableCell>
                  <TableCell>
                    <Badge variant={doctor.is_active ? "default" : "secondary"}>
                      {doctor.is_active ? t("doctorMgmt.active") : t("doctorMgmt.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(doctor)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doctor)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDoctors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t("doctorMgmt.noDoctorsFound")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedDoctor(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDoctor ? t("doctorMgmt.editDoctor") : t("doctorMgmt.addDoctorTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("doctorMgmt.dialogDesc")}
            </DialogDescription>
          </DialogHeader>

          {/* Section Tabs */}
          <div className="flex gap-2 border-b pb-2">
            <Button
              variant={activeSection === "basic" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("basic")}
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              {t("doctorMgmt.basicInfo")}
            </Button>
            <Button
              variant={activeSection === "education" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("education")}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              {t("doctorMgmt.education")} ({educationList.length})
            </Button>
            <Button
              variant={activeSection === "experience" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("experience")}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              {t("doctorMgmt.experienceTab")} ({experienceList.length})
            </Button>
          </div>

          {/* Basic Info Section */}
          {activeSection === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("doctorMgmt.nameLabel")}</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("doctorMgmt.namePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("doctorMgmt.specialtyLabel")}</Label>
                  <Select
                    value={formData.specialty}
                    onValueChange={(v) => setFormData({ ...formData, specialty: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("doctorMgmt.specialtyPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALTIES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("doctorMgmt.qualificationLabel")}</Label>
                  <Input
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="MBBS, MD, FCPS"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("doctorMgmt.experienceYearsLabel")}</Label>
                  <Input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) =>
                      setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })
                    }
                    min={0}
                    max={60}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("doctorMgmt.consultationFeeLabel")}</Label>
                  <Input
                    type="number"
                    value={formData.consultation_fee}
                    onChange={(e) =>
                      setFormData({ ...formData, consultation_fee: parseInt(e.target.value) || 0 })
                    }
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("doctorMgmt.avatarUrlLabel")}</Label>
                  <Input
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("doctorMgmt.bioLabel")}</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder={t("doctorMgmt.bioPlaceholder")}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("doctorMgmt.availableDays")}</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <Badge
                      key={day}
                      variant={formData.available_days.includes(day) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleDay(day)}
                    >
                      {t(`doctorMgmt.days.${day}`)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("doctorMgmt.startTime")}</Label>
                  <Input
                    type="time"
                    value={formData.available_from}
                    onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("doctorMgmt.endTime")}</Label>
                  <Input
                    type="time"
                    value={formData.available_to}
                    onChange={(e) => setFormData({ ...formData, available_to: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("doctorMgmt.slotDuration")}</Label>
                  <Input
                    type="number"
                    value={formData.slot_duration}
                    onChange={(e) =>
                      setFormData({ ...formData, slot_duration: parseInt(e.target.value) || 30 })
                    }
                    min={10}
                    max={120}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("doctorMgmt.maxPatientsPerSlot")}</Label>
                  <Input
                    type="number"
                    value={formData.max_patients_per_slot}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_patients_per_slot: parseInt(e.target.value) || 1,
                      })
                    }
                    min={1}
                    max={10}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>{t("doctorMgmt.activeDoctor")}</Label>
              </div>
            </div>
          )}

          {/* Education Section */}
          {activeSection === "education" && (
            <div className="space-y-4">
              {educationList.map((edu, index) => (
                <Card key={index}>
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{t("doctorMgmt.eduTitle", { num: index + 1 })}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">{t("doctorMgmt.degreeLabel")}</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                          placeholder="MBBS"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("doctorMgmt.yearLabel")}</Label>
                        <Input
                          type="number"
                          value={edu.year || ""}
                          onChange={(e) =>
                            updateEducation(index, "year", parseInt(e.target.value) || null)
                          }
                          placeholder="2010"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t("doctorMgmt.institutionLabel")}</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        placeholder={t("doctorMgmt.institutionPlaceholder")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t("doctorMgmt.descriptionLabel")}</Label>
                      <Input
                        value={edu.description}
                        onChange={(e) => updateEducation(index, "description", e.target.value)}
                        placeholder={t("doctorMgmt.descriptionPlaceholder")}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" onClick={addEducation} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t("doctorMgmt.addEducation")}
              </Button>
            </div>
          )}

          {/* Experience Section */}
          {activeSection === "experience" && (
            <div className="space-y-4">
              {experienceList.map((exp, index) => (
                <Card key={index}>
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{t("doctorMgmt.expTitle", { num: index + 1 })}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">{t("doctorMgmt.positionLabel")}</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(index, "position", e.target.value)}
                          placeholder="Senior Consultant"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("doctorMgmt.organizationLabel")}</Label>
                        <Input
                          value={exp.organization}
                          onChange={(e) => updateExperience(index, "organization", e.target.value)}
                          placeholder="TrustCare Diagnostic"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">{t("doctorMgmt.startYearLabel")}</Label>
                        <Input
                          type="number"
                          value={exp.start_year}
                          onChange={(e) =>
                            updateExperience(index, "start_year", parseInt(e.target.value) || 2020)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("doctorMgmt.endYearLabel")}</Label>
                        <Input
                          type="number"
                          value={exp.end_year || ""}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "end_year",
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          disabled={exp.is_current}
                          placeholder={exp.is_current ? t("doctorMgmt.current") : ""}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={exp.is_current}
                        onCheckedChange={(checked) =>
                          updateExperience(index, "is_current", !!checked)
                        }
                      />
                      <Label className="text-xs">{t("doctorMgmt.currentlyWorking")}</Label>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t("doctorMgmt.descriptionLabel")}</Label>
                      <Input
                        value={exp.description}
                        onChange={(e) => updateExperience(index, "description", e.target.value)}
                        placeholder={t("doctorMgmt.descriptionPlaceholder")}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" onClick={addExperience} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t("doctorMgmt.addExperience")}
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              {t("doctorMgmt.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createDoctor.isPending || updateDoctor.isPending}
            >
              {createDoctor.isPending || updateDoctor.isPending
                ? t("doctorMgmt.saving")
                : t("doctorMgmt.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("doctorMgmt.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("doctorMgmt.deleteConfirmDesc", { name: selectedDoctor?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("doctorMgmt.deleteCancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedDoctor && deleteDoctor.mutate(selectedDoctor.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteDoctor.isPending ? t("doctorMgmt.deleting") : t("doctorMgmt.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
