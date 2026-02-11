import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeCollectionRequests, CollectionStatus } from "@/hooks/useHomeCollectionRequests";
import { useStaffMembers } from "@/hooks/useStaffMembers";
import { useReports } from "@/hooks/useReports";
import { ReportUploadDialog } from "@/components/reports/ReportUploadDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, Clock, MapPin, Phone, FlaskConical, User, 
  CheckCircle2, ClipboardList,
  FileUp, UserPlus, Filter,
  FileText, Users, CalendarCheck, Stethoscope, Mail,
  Menu, ChevronLeft
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { StaffManagement } from "@/components/admin/StaffManagement";
import { AppointmentsManagement } from "@/components/admin/AppointmentsManagement";
import { DoctorManagement } from "@/components/admin/DoctorManagement";
import { ContactMessagesManagement } from "@/components/admin/ContactMessagesManagement";
import { StaffDashboard } from "@/components/dashboard/StaffDashboard";
import { format, isToday, isThisWeek, isThisMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const statusColors: Record<CollectionStatus, string> = {
  requested: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  collected: "bg-purple-100 text-purple-800",
  processing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
};

type AdminSection = "bookings" | "appointments" | "doctors" | "staff" | "messages";

interface SidebarNavItem {
  id: AdminSection;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, isLoading: authLoading, isAdmin, isStaff, roles } = useAuth();
  const { requests, isLoading, updateRequestStatus, reschedule, assignStaff } = useHomeCollectionRequests();
  const { staffMembers, isLoading: staffLoading } = useStaffMembers();
  const { getReportsForRequest } = useReports();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" });
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isAssignStaffOpen, setIsAssignStaffOpen] = useState(false);
  const [isUploadReportOpen, setIsUploadReportOpen] = useState(false);
  const [uploadRequestData, setUploadRequestData] = useState<{ requestId: string; patientId: string; patientName: string } | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<AdminSection>("bookings");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems: SidebarNavItem[] = [
    { id: "bookings", label: t("dashboard.bookings"), icon: ClipboardList },
    { id: "appointments", label: t("dashboard.appointments"), icon: CalendarCheck, adminOnly: true },
    { id: "doctors", label: t("dashboard.doctors"), icon: Stethoscope, adminOnly: true },
    { id: "staff", label: t("dashboard.staffManagement"), icon: Users, adminOnly: true },
    { id: "messages", label: t("dashboard.messages"), icon: Mail, adminOnly: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  // Filtered requests based on all filters
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      let matchesDate = true;
      if (dateFilter === "today") matchesDate = isToday(new Date(r.created_at));
      else if (dateFilter === "week") matchesDate = isThisWeek(new Date(r.created_at));
      else if (dateFilter === "month") matchesDate = isThisMonth(new Date(r.created_at));
      return matchesStatus && matchesDate;
    });
  }, [requests, statusFilter, dateFilter]);

  // Role display
  const roleDisplay = useMemo(() => {
    if (roles.includes("super_admin")) return t("dashboard.superAdmin");
    if (roles.includes("admin")) return t("dashboard.admin");
    if (roles.includes("manager")) return t("dashboard.manager");
    if (roles.includes("staff")) return t("dashboard.staff");
    return t("dashboard.user");
  }, [roles, t]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-padding">
          <div className="container-custom">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || (!isAdmin && !isStaff)) {
    return <Navigate to="/" replace />;
  }

  // Show Staff-specific dashboard for staff-only users
  if (isStaff && !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <SEOHead 
          title="Staff Dashboard"
          titleBn="স্টাফ ড্যাশবোর্ড"
          description="Manage assigned sample collections and update request status."
          descriptionBn="নির্ধারিত স্যাম্পল কালেকশন ম্যানেজ করুন এবং রিকোয়েস্ট স্ট্যাটাস আপডেট করুন।"
          noIndex={true}
        />
        <Header />
        <main className="flex-1 section-padding">
          <div className="container-custom">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-display-sm font-bold text-foreground">{t("dashboard.title")}</h1>
              <Badge variant="secondary" className="font-medium">{t("dashboard.staff")}</Badge>
            </div>
            <StaffDashboard />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleStatusUpdate = async (requestId: string, newStatus: CollectionStatus) => {
    await updateRequestStatus(requestId, newStatus);
  };

  const handleReschedule = async () => {
    if (selectedRequest && rescheduleData.date && rescheduleData.time) {
      await reschedule(selectedRequest, rescheduleData.date, rescheduleData.time);
      setIsRescheduleOpen(false);
      setSelectedRequest(null);
      setRescheduleData({ date: "", time: "" });
    }
  };

  const openReschedule = (requestId: string) => {
    setSelectedRequest(requestId);
    setIsRescheduleOpen(true);
  };

  const openAssignStaff = (requestId: string) => {
    setSelectedRequest(requestId);
    setSelectedStaffId("");
    setIsAssignStaffOpen(true);
  };

  const handleAssignStaff = async () => {
    if (selectedRequest && selectedStaffId) {
      await assignStaff(selectedRequest, selectedStaffId);
      setIsAssignStaffOpen(false);
      setSelectedRequest(null);
      setSelectedStaffId("");
    }
  };

  const getAssignedStaffName = (staffId: string | null) => {
    if (!staffId) return null;
    const staff = staffMembers.find((s) => s.id === staffId);
    return staff?.full_name || staff?.email || "Unknown Staff";
  };

  const openUploadReport = (requestId: string, patientId: string, patientName: string) => {
    setUploadRequestData({ requestId, patientId, patientName });
    setIsUploadReportOpen(true);
  };

  const handleNavClick = (sectionId: AdminSection) => {
    setActiveSection(sectionId);
    if (isMobile) setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <SEOHead 
        title="Admin Dashboard"
        titleBn="অ্যাডমিন ড্যাশবোর্ড"
        description="Manage bookings, staff assignments, doctors and messages."
        descriptionBn="বুকিং, স্টাফ অ্যাসাইনমেন্ট, ডাক্তার এবং মেসেজ ম্যানেজ করুন।"
        noIndex={true}
      />
      <Header />
      
      <div className="flex-1 flex">
        {/* Mobile sidebar overlay */}
        {isMobile && mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-sidebar-background border-r border-sidebar-border flex flex-col shrink-0 transition-all duration-300 ease-in-out",
            isMobile 
              ? cn(
                  "fixed inset-y-0 left-0 z-50 w-72 shadow-xl",
                  mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )
              : cn(
                  "sticky top-0 h-screen",
                  sidebarCollapsed ? "w-[68px]" : "w-64"
                )
          )}
        >
          {/* Sidebar Header */}
          <div className={cn(
            "h-16 flex items-center border-b border-sidebar-border px-4",
            sidebarCollapsed && !isMobile ? "justify-center" : "justify-between"
          )}>
            {(!sidebarCollapsed || isMobile) && (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
                  <Stethoscope className="h-4 w-4 text-sidebar-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-sidebar-foreground truncate">
                    {t("dashboard.title")}
                  </h2>
                  <p className="text-[10px] text-muted-foreground truncate">{roleDisplay}</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => isMobile ? setMobileSidebarOpen(false) : setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform",
                sidebarCollapsed && !isMobile && "rotate-180"
              )} />
            </Button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
            {visibleNavItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    sidebarCollapsed && !isMobile && "justify-center px-2"
                  )}
                  title={sidebarCollapsed && !isMobile ? item.label : undefined}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary-foreground")} />
                  {(!sidebarCollapsed || isMobile) && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          {(!sidebarCollapsed || isMobile) && (
            <div className="p-4 border-t border-sidebar-border">
              <div className="bg-sidebar-accent rounded-lg p-3">
                <p className="text-xs text-sidebar-accent-foreground font-medium">
                  {t("dashboard.welcomeBack")}
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-auto">
          {/* Top bar with mobile menu trigger */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg font-semibold text-foreground truncate">
              {visibleNavItems.find(i => i.id === activeSection)?.label}
            </h1>
            <Badge variant="secondary" className="ml-auto font-medium text-xs shrink-0">
              {roleDisplay}
            </Badge>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Bookings Section */}
            {activeSection === "bookings" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t("dashboard.filters")}:</span>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t("status.pending")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("dashboard.allStatus")}</SelectItem>
                      <SelectItem value="requested">{t("status.requested")}</SelectItem>
                      <SelectItem value="assigned">{t("status.assigned")}</SelectItem>
                      <SelectItem value="collected">{t("status.collected")}</SelectItem>
                      <SelectItem value="processing">{t("status.processing")}</SelectItem>
                      <SelectItem value="ready">{t("status.ready")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t("dashboard.allTime")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("dashboard.allTime")}</SelectItem>
                      <SelectItem value="today">{t("dashboard.today")}</SelectItem>
                      <SelectItem value="week">{t("dashboard.thisWeekFilter")}</SelectItem>
                      <SelectItem value="month">{t("dashboard.thisMonthFilter")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground ml-auto">
                    {t("dashboard.bookings")}: {filteredRequests.length} / {requests.length}
                  </p>
                </div>

                {/* Bookings List */}
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                    ))}
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <ClipboardList className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">{t("dashboard.noBookingsFound")}</h3>
                      <p className="text-muted-foreground">
                        {statusFilter !== "all" || dateFilter !== "all"
                          ? t("dashboard.noBookingsFilterHint")
                          : t("dashboard.noBookingsYet")}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredRequests.map((request) => (
                      <Card key={request.id}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                            {/* Request Info */}
                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">{request.full_name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {request.test_names.join(", ")}
                                  </p>
                                </div>
                                <Badge className={statusColors[request.status]}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{format(new Date(request.preferred_date), "PP")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{request.preferred_time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{request.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FlaskConical className="h-4 w-4 text-muted-foreground" />
                                  <span>৳{request.total_amount}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span className="text-muted-foreground">{request.address}</span>
                              </div>

                              {/* Assigned Staff Info */}
                              {request.assigned_staff_id && (
                                <div className="flex items-center gap-2 text-sm bg-primary/5 rounded-lg px-3 py-2">
                                  <User className="h-4 w-4 text-primary" />
                                  <span className="text-foreground">
                                    {t("dashboard.assigned")}: <span className="font-medium">{getAssignedStaffName(request.assigned_staff_id)}</span>
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 lg:w-48">
                              <Select
                                value={request.status}
                                onValueChange={(value) => handleStatusUpdate(request.id, value as CollectionStatus)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={t("dashboard.updateStatus")} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="requested">{t("status.requested")}</SelectItem>
                                  <SelectItem value="assigned">{t("status.assigned")}</SelectItem>
                                  <SelectItem value="collected">{t("status.collected")}</SelectItem>
                                  <SelectItem value="processing">{t("status.processing")}</SelectItem>
                                  <SelectItem value="ready">{t("status.ready")}</SelectItem>
                                </SelectContent>
                              </Select>

                              {(isAdmin || isStaff) && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => openUploadReport(request.id, request.patient_id, request.full_name)}
                                  >
                                    <FileUp className="h-4 w-4 mr-2" />
                                    {t("dashboard.uploadReport")}
                                  </Button>
                                  {getReportsForRequest(request.id).length > 0 && (
                                    <Badge variant="secondary" className="gap-1">
                                      <FileText className="h-3 w-3" />
                                      {getReportsForRequest(request.id).length} {t("dashboard.reportCount")}
                                    </Badge>
                                  )}
                                </>
                              )}

                              {isAdmin && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openAssignStaff(request.id)}
                                    className={request.assigned_staff_id ? "border-primary/50" : ""}
                                  >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    {request.assigned_staff_id ? t("dashboard.reassignStaff") : t("dashboard.assignStaff")}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openReschedule(request.id)}
                                  >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {t("dashboard.reschedule")}
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Appointments Section */}
            {activeSection === "appointments" && isAdmin && <AppointmentsManagement />}

            {/* Doctors Section */}
            {activeSection === "doctors" && isAdmin && <DoctorManagement />}

            {/* Staff Section */}
            {activeSection === "staff" && isAdmin && <StaffManagement />}

            {/* Messages Section */}
            {activeSection === "messages" && isAdmin && <ContactMessagesManagement />}
          </div>
        </main>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dashboard.rescheduleRequest")}</DialogTitle>
            <DialogDescription>{t("dashboard.rescheduleDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">{t("dashboard.newDate")}</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleData.date}
                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-time">{t("dashboard.newTime")}</Label>
              <Select
                value={rescheduleData.time}
                onValueChange={(value) => setRescheduleData({ ...rescheduleData, time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("dashboard.selectTime")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00 AM">8:00 AM</SelectItem>
                  <SelectItem value="09:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                  <SelectItem value="02:00 PM">2:00 PM</SelectItem>
                  <SelectItem value="03:00 PM">3:00 PM</SelectItem>
                  <SelectItem value="04:00 PM">4:00 PM</SelectItem>
                  <SelectItem value="05:00 PM">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleReschedule} className="w-full">
              {t("dashboard.confirmReschedule")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Staff Dialog */}
      <Dialog open={isAssignStaffOpen} onOpenChange={setIsAssignStaffOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dashboard.assignStaffTitle")}</DialogTitle>
            <DialogDescription>{t("dashboard.assignStaffDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="staff-select">{t("dashboard.selectStaff")}</Label>
              {staffLoading ? (
                <div className="text-sm text-muted-foreground">{t("dashboard.loadingStaff")}</div>
              ) : staffMembers.length === 0 ? (
                <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg text-center">
                  {t("dashboard.noStaffAvailable")}
                </div>
              ) : (
                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("dashboard.selectStaffMember")} />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        <div className="flex flex-col">
                          <span>{staff.full_name || "Unnamed Staff"}</span>
                          <span className="text-xs text-muted-foreground">{staff.email || staff.phone}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button 
              onClick={handleAssignStaff} 
              className="w-full"
              disabled={!selectedStaffId || staffMembers.length === 0}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {t("dashboard.confirmAssignment")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Report Dialog */}
      {uploadRequestData && (
        <ReportUploadDialog
          open={isUploadReportOpen}
          onOpenChange={setIsUploadReportOpen}
          requestId={uploadRequestData.requestId}
          patientId={uploadRequestData.patientId}
          patientName={uploadRequestData.patientName}
        />
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
