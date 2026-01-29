import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, isSunday } from "date-fns";
import { CalendarIcon, Clock, User, Phone, Mail, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctors, useAppointments, generateTimeSlots, Doctor } from "@/hooks/useAppointments";

const formSchema = z.object({
  doctor_id: z.string().min(1, "Please select a doctor"),
  appointment_date: z.date({
    required_error: "Please select a date",
  }),
  appointment_time: z.string().min(1, "Please select a time slot"),
  patient_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  patient_phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15),
  patient_email: z.string().email("Invalid email").optional().or(z.literal("")),
  reason: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AppointmentBookingFormProps {
  onSuccess?: () => void;
}

export function AppointmentBookingForm({ onSuccess }: AppointmentBookingFormProps) {
  const { user, profile } = useAuth();
  const { doctors, isLoading: doctorsLoading } = useDoctors();
  const { createAppointment, getBookedSlots } = useAppointments();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctor_id: "",
      appointment_time: "",
      patient_name: profile?.full_name || "",
      patient_phone: profile?.phone || "",
      patient_email: profile?.email || user?.email || "",
      reason: "",
    },
  });

  const watchDoctorId = form.watch("doctor_id");
  const watchDate = form.watch("appointment_date");

  // Update selected doctor when doctor_id changes
  useEffect(() => {
    if (watchDoctorId) {
      const doctor = doctors.find((d) => d.id === watchDoctorId);
      setSelectedDoctor(doctor || null);
      form.setValue("appointment_time", "");
    }
  }, [watchDoctorId, doctors, form]);

  // Generate available slots when date changes
  useEffect(() => {
    const updateSlots = async () => {
      if (!selectedDoctor || !watchDate) {
        setAvailableSlots([]);
        return;
      }

      const dayName = format(watchDate, "EEEE").toLowerCase();
      if (!selectedDoctor.available_days.includes(dayName)) {
        setAvailableSlots([]);
        return;
      }

      const slots = generateTimeSlots(
        selectedDoctor.available_from,
        selectedDoctor.available_to,
        selectedDoctor.slot_duration
      );

      const dateStr = format(watchDate, "yyyy-MM-dd");
      const booked = await getBookedSlots(selectedDoctor.id, dateStr);
      setBookedSlots(booked);
      setAvailableSlots(slots);
    };

    updateSlots();
  }, [selectedDoctor, watchDate, getBookedSlots]);

  // Check if date is available for selected doctor
  const isDateAvailable = (date: Date) => {
    if (!selectedDoctor) return false;
    const dayName = format(date, "EEEE").toLowerCase();
    return selectedDoctor.available_days.includes(dayName);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await createAppointment({
        doctor_id: values.doctor_id,
        appointment_date: format(values.appointment_date, "yyyy-MM-dd"),
        appointment_time: values.appointment_time,
        patient_name: values.patient_name,
        patient_phone: values.patient_phone,
        patient_email: values.patient_email || undefined,
        reason: values.reason || undefined,
      });

      if (!error) {
        setBookingSuccess(true);
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Appointment Booked Successfully!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your appointment has been confirmed. You will receive a notification with the details.
          </p>
          <div className="bg-muted rounded-lg p-4 text-left max-w-sm mx-auto space-y-2">
            <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
            <p><strong>Date:</strong> {watchDate && format(watchDate, "PPP")}</p>
            <p><strong>Time:</strong> {form.getValues("appointment_time")}</p>
            <p><strong>Fee:</strong> ৳{selectedDoctor?.consultation_fee}</p>
          </div>
          <Button className="mt-6" onClick={() => setBookingSuccess(false)}>
            Book Another Appointment
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (doctorsLoading) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>
          Select a doctor, date, and time to schedule your consultation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Doctor Selection */}
            <FormField
              control={form.control}
              name="doctor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Doctor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex flex-col">
                            <span>{doctor.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {doctor.specialty} • ৳{doctor.consultation_fee}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Doctor Info Card */}
            {selectedDoctor && (
              <div className="bg-muted/50 rounded-lg p-4 border">
                <h4 className="font-medium">{selectedDoctor.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDoctor.specialty} • {selectedDoctor.qualification}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDoctor.experience_years} years experience
                </p>
                <p className="text-sm font-medium text-primary mt-2">
                  Consultation Fee: ৳{selectedDoctor.consultation_fee}
                </p>
              </div>
            )}

            {/* Date Picker */}
            <FormField
              control={form.control}
              name="appointment_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Appointment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={!selectedDoctor}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() ||
                          date > addDays(new Date(), 30) ||
                          (selectedDoctor ? !isDateAvailable(date) : true)
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  {selectedDoctor && (
                    <p className="text-xs text-muted-foreground">
                      Available: {selectedDoctor.available_days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Slots */}
            <FormField
              control={form.control}
              name="appointment_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Time Slot</FormLabel>
                  {availableSlots.length > 0 ? (
                    <div className="space-y-3">
                      {/* Legend */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500" />
                          <span>Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500" />
                          <span>Booked</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span>Selected</span>
                        </div>
                      </div>
                      
                      {/* Slots Grid */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {availableSlots.map((slot) => {
                          const isBooked = bookedSlots.includes(slot);
                          const isSelected = field.value === slot;
                          return (
                            <Button
                              key={slot}
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isBooked}
                              className={cn(
                                "relative text-xs transition-all duration-200",
                                isBooked && "bg-red-50 border-red-200 text-red-400 cursor-not-allowed hover:bg-red-50 dark:bg-red-950/20 dark:border-red-800 dark:text-red-500",
                                !isBooked && !isSelected && "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/40",
                                isSelected && "bg-primary border-primary text-primary-foreground hover:bg-primary/90 hover:border-primary ring-2 ring-primary/20"
                              )}
                              onClick={() => field.onChange(slot)}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {slot}
                              {isBooked && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                  <span className="text-[8px] text-white font-bold">✕</span>
                                </span>
                              )}
                              {isSelected && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                                </span>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                      
                      {/* Summary */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                        <span>
                          {availableSlots.length - bookedSlots.length} slots available
                        </span>
                        <span>
                          {bookedSlots.length} slots booked
                        </span>
                      </div>
                    </div>
                  ) : watchDate && selectedDoctor ? (
                    <div className="text-center py-6 bg-muted/50 rounded-lg border border-dashed">
                      <Clock className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No available slots for this date.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Please select another date.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted/50 rounded-lg border border-dashed">
                      <CalendarIcon className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Select a doctor and date to see available slots
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Patient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patient_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input {...field} placeholder="Full name" className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patient_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input {...field} placeholder="01XXXXXXXXX" className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="patient_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input {...field} placeholder="your@email.com" className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Visit (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        {...field}
                        placeholder="Briefly describe your symptoms or reason for consultation"
                        className="pl-10 min-h-[80px]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : "Confirm Appointment"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
