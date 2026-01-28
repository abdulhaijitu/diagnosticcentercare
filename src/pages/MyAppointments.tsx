import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link, Navigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarCheck, Clock, User, XCircle, Plus } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};

const MyAppointments = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { appointments, isLoading, cancelAppointment } = useAppointments();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-padding">
          <div className="container-custom max-w-4xl">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const upcomingAppointments = appointments.filter(
    (a) => a.status !== "cancelled" && a.status !== "completed"
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === "cancelled" || a.status === "completed"
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 section-padding">
        <div className="container-custom max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-display-sm font-bold text-foreground">
                My Appointments
              </h1>
              <p className="text-muted-foreground">
                View and manage your doctor appointments
              </p>
            </div>
            <Button asChild>
              <Link to="/book-appointment">
                <Plus className="h-4 w-4 mr-2" />
                Book New
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Appointments Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't booked any appointments. Schedule one with our doctors.
                </p>
                <Button asChild>
                  <Link to="/book-appointment">Book an Appointment</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Upcoming Appointments */}
              {upcomingAppointments.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className={statusStyles[appointment.status]}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(appointment.created_at), "MMM d, yyyy")}
                                </span>
                              </div>
                              <h3 className="font-semibold text-lg flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                {appointment.doctor?.name || "Doctor"}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctor?.specialty}
                              </p>
                              <div className="flex items-center gap-4 mt-3 text-sm">
                                <span className="flex items-center gap-1">
                                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                                  {format(new Date(appointment.appointment_date), "EEEE, MMM d, yyyy")}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {appointment.appointment_time}
                                </span>
                              </div>
                              {appointment.reason && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  <strong>Reason:</strong> {appointment.reason}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {appointment.status === "pending" && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-destructive">
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Cancel
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel your appointment with {appointment.doctor?.name} on {format(new Date(appointment.appointment_date), "MMM d, yyyy")} at {appointment.appointment_time}?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => cancelAppointment(appointment.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Cancel Appointment
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Past Appointments */}
              {pastAppointments.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Past Appointments</h2>
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <Card key={appointment.id} className="opacity-75">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className={statusStyles[appointment.status]}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Badge>
                              </div>
                              <h3 className="font-semibold flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {appointment.doctor?.name || "Doctor"}
                              </h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <CalendarCheck className="h-4 w-4" />
                                  {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {appointment.appointment_time}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyAppointments;
