import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppointments, useDoctors, Appointment } from "@/hooks/useAppointments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Calendar, Clock, Phone, User, Mail, FileText,
  CheckCircle2, XCircle, AlertCircle, CalendarCheck,
  Stethoscope, Filter, RefreshCw
} from "lucide-react";
import { format, isToday, isThisWeek, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function AppointmentsManagement() {
  const { t } = useTranslation();
  const { appointments, isLoading, refetch } = useAppointments();
  const { doctors } = useDoctors();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const statusLabels: Record<string, string> = {
    pending: t("appointmentsMgmt.pending"),
    confirmed: t("appointmentsMgmt.confirmed"),
    completed: t("appointmentsMgmt.completed"),
    cancelled: t("appointmentsMgmt.cancelled"),
  };

  // Stats
  const stats = useMemo(() => {
    const today = appointments.filter(a => isToday(parseISO(a.appointment_date)));
    const thisWeek = appointments.filter(a => isThisWeek(parseISO(a.appointment_date)));
    
    return {
      total: appointments.length,
      today: today.length,
      thisWeek: thisWeek.length,
      pending: appointments.filter(a => a.status === "pending").length,
      confirmed: appointments.filter(a => a.status === "confirmed").length,
      completed: appointments.filter(a => a.status === "completed").length,
      cancelled: appointments.filter(a => a.status === "cancelled").length,
    };
  }, [appointments]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesDoctor = doctorFilter === "all" || a.doctor_id === doctorFilter;
      
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = isToday(parseISO(a.appointment_date));
      } else if (dateFilter === "week") {
        matchesDate = isThisWeek(parseISO(a.appointment_date));
      }
      
      return matchesStatus && matchesDate && matchesDoctor;
    });
  }, [appointments, statusFilter, dateFilter, doctorFilter]);

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("appointments" as any)
        .update({ 
          status, 
          notes: notes || undefined,
          ...(status === "cancelled" ? { cancelled_at: new Date().toISOString() } : {})
        })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: t("appointmentsMgmt.updateStatus"),
        description: t("appointmentsMgmt.updateStatusDesc", { status: statusLabels[status] }),
      });

      refetch();
      setIsUpdateDialogOpen(false);
      setIsCancelDialogOpen(false);
      setSelectedAppointment(null);
      setNotes("");
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        title: t("common.error"),
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openUpdateDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNotes(appointment.notes || "");
    setIsUpdateDialogOpen(true);
  };

  const openCancelDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNotes("");
    setIsCancelDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("appointmentsMgmt.todayAppointments")}</p>
                <p className="text-3xl font-bold text-foreground">{stats.today}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("appointmentsMgmt.pending")}</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("appointmentsMgmt.confirmed")}</p>
                <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("appointmentsMgmt.completed")}</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              {t("appointmentsMgmt.title")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-1" />
                {t("common.tryAgain")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("appointmentsMgmt.filter")}</span>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("appointmentsMgmt.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("dashboard.allStatus")}</SelectItem>
                <SelectItem value="pending">{t("appointmentsMgmt.pending")}</SelectItem>
                <SelectItem value="confirmed">{t("appointmentsMgmt.confirmed")}</SelectItem>
                <SelectItem value="completed">{t("appointmentsMgmt.completed")}</SelectItem>
                <SelectItem value="cancelled">{t("appointmentsMgmt.cancelled")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("appointmentsMgmt.date")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("dashboard.allTime")}</SelectItem>
                <SelectItem value="today">{t("dashboard.today")}</SelectItem>
                <SelectItem value="week">{t("dashboard.thisWeekFilter")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("appointmentsMgmt.doctor")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("appointmentsMgmt.allDoctors")}</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">{t("appointmentsMgmt.noAppointments")}</h3>
              <p className="text-muted-foreground">
                {statusFilter !== "all" || dateFilter !== "all" || doctorFilter !== "all"
                  ? t("appointmentsMgmt.tryFilter")
                  : t("appointmentsMgmt.noAppointmentsYet")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-xl p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">
                          {appointment.patient_name}
                        </h3>
                        <Badge className={statusColors[appointment.status]}>
                          {statusLabels[appointment.status]}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Stethoscope className="h-4 w-4" />
                          <span>{appointment.doctor?.name || "Unknown Doctor"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{format(parseISO(appointment.appointment_date), "PP")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.appointment_time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4" />
                          <span>{appointment.patient_phone}</span>
                        </div>
                        {appointment.patient_email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-4 w-4" />
                            <span>{appointment.patient_email}</span>
                          </div>
                        )}
                      </div>

                      {appointment.reason && (
                        <div className="flex items-start gap-1.5 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground">{appointment.reason}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {appointment.status !== "cancelled" && appointment.status !== "completed" && (
                      <div className="flex items-center gap-2">
                        {appointment.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                            disabled={isUpdating}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            {t("appointmentsMgmt.confirm")}
                          </Button>
                        )}
                        {appointment.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => openUpdateDialog(appointment)}
                            disabled={isUpdating}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            {t("appointmentsMgmt.complete")}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => openCancelDialog(appointment)}
                          disabled={isUpdating}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {t("appointmentsMgmt.cancel")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complete Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("appointmentsMgmt.completeTitle")}</DialogTitle>
            <DialogDescription>
              {selectedAppointment?.patient_name} - {selectedAppointment?.doctor?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">{t("appointmentsMgmt.notes")}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("appointmentsMgmt.notesPlaceholder")}
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={() => selectedAppointment && updateAppointmentStatus(selectedAppointment.id, "completed")}
              disabled={isUpdating}
            >
              {isUpdating ? t("common.loading") : t("appointmentsMgmt.complete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("appointmentsMgmt.cancelTitle")}</DialogTitle>
            <DialogDescription>
              {t("appointmentsMgmt.cancelDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancel-reason">{t("appointmentsMgmt.reason")}</Label>
              <Textarea
                id="cancel-reason"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("appointmentsMgmt.reasonPlaceholder")}
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedAppointment && updateAppointmentStatus(selectedAppointment.id, "cancelled")}
              disabled={isUpdating}
            >
              {isUpdating ? t("common.loading") : t("appointmentsMgmt.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
