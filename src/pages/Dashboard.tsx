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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Clock, MapPin, Phone, FlaskConical, User, 
  CheckCircle2, AlertCircle, ClipboardList, RefreshCw,
  TrendingUp, FileUp, UserPlus, Activity, Filter,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight, FileText, Users, CalendarCheck, Stethoscope, Mail
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { StaffManagement } from "@/components/admin/StaffManagement";
import { AppointmentsManagement } from "@/components/admin/AppointmentsManagement";
import { DoctorManagement } from "@/components/admin/DoctorManagement";
import { ContactMessagesManagement } from "@/components/admin/ContactMessagesManagement";
import { StaffDashboard } from "@/components/dashboard/StaffDashboard";
import { format, isToday, isThisWeek, isThisMonth, subDays, startOfDay, endOfDay } from "date-fns";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, LineChart, Line, Area, AreaChart
} from "recharts";

const statusColors: Record<CollectionStatus, string> = {
  requested: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  collected: "bg-purple-100 text-purple-800",
  processing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
};

const CHART_COLORS = {
  primary: "hsl(170, 55%, 45%)",
  accent: "hsl(35, 92%, 55%)",
  success: "hsl(142, 76%, 36%)",
  warning: "hsl(38, 92%, 50%)",
  purple: "hsl(262, 83%, 58%)",
};

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
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Memoized calculations for performance
  const stats = useMemo(() => {
    const now = new Date();
    const todayRequests = requests.filter(r => isToday(new Date(r.created_at)));
    const weekRequests = requests.filter(r => isThisWeek(new Date(r.created_at)));
    const monthRequests = requests.filter(r => isThisMonth(new Date(r.created_at)));

    return {
      total: requests.length,
      today: todayRequests.length,
      thisWeek: weekRequests.length,
      thisMonth: monthRequests.length,
      pending: requests.filter(r => r.status === "requested").length,
      assigned: requests.filter(r => r.status === "assigned").length,
      collected: requests.filter(r => r.status === "collected").length,
      processing: requests.filter(r => r.status === "processing").length,
      ready: requests.filter(r => r.status === "ready").length,
      completed: requests.filter(r => r.status === "ready").length,
      inProgress: requests.filter(r => ["assigned", "collected", "processing"].includes(r.status)).length,
    };
  }, [requests]);

  // Service breakdown data for charts
  const serviceBreakdown = useMemo(() => {
    // Since we only have home collection for now, simulate breakdown
    return [
      { name: t("dashboard.homeCollection"), value: requests.length, color: CHART_COLORS.primary },
      { name: t("dashboard.diagnosticTests"), value: Math.floor(requests.length * 0.6), color: CHART_COLORS.accent },
      { name: t("dashboard.consultancy"), value: Math.floor(requests.length * 0.3), color: CHART_COLORS.purple },
    ];
  }, [requests]);

  // Status breakdown for pie chart
  const statusBreakdown = useMemo(() => [
    { name: t("status.pending"), value: stats.pending, color: CHART_COLORS.warning },
    { name: t("status.inProgress"), value: stats.inProgress, color: CHART_COLORS.primary },
    { name: t("status.completed"), value: stats.completed, color: CHART_COLORS.success },
  ], [stats]);

  // Weekly trend data
  const weeklyTrend = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayRequests = requests.filter(r => {
        const reqDate = new Date(r.created_at);
        return reqDate >= startOfDay(date) && reqDate <= endOfDay(date);
      });
      days.push({
        day: format(date, "EEE"),
        bookings: dayRequests.length,
        completed: dayRequests.filter(r => r.status === "ready").length,
      });
    }
    return days;
  }, [requests]);

  // Recent activity feed
  const recentActivity = useMemo(() => {
    return requests
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        name: r.full_name,
        action: r.status === "requested" ? t("dashboard.newBooking") : `${t("status." + r.status)}`,
        time: format(new Date(r.created_at), "p"),
        date: format(new Date(r.created_at), "PP"),
        status: r.status,
      }));
  }, [requests]);

  // Filtered requests based on all filters
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = isToday(new Date(r.created_at));
      } else if (dateFilter === "week") {
        matchesDate = isThisWeek(new Date(r.created_at));
      } else if (dateFilter === "month") {
        matchesDate = isThisMonth(new Date(r.created_at));
      }
      
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

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <SEOHead 
        title="Admin Dashboard"
        titleBn="অ্যাডমিন ড্যাশবোর্ড"
        description="Manage bookings, staff assignments, doctors and view analytics."
        descriptionBn="বুকিং, স্টাফ অ্যাসাইনমেন্ট, ডাক্তার ম্যানেজ করুন এবং অ্যানালিটিক্স দেখুন।"
        noIndex={true}
      />
      <Header />
      <main className="flex-1 section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-display-sm font-bold text-foreground">{t("dashboard.title")}</h1>
                <Badge variant="secondary" className="font-medium">{roleDisplay}</Badge>
              </div>
              <p className="text-muted-foreground">
                {t("dashboard.welcomeBack")}
              </p>
            </div>

            {/* Quick Actions */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FileUp className="h-4 w-4 mr-2" />
                  {t("dashboard.uploadReport")}
                </Button>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t("dashboard.assignStaff")}
                </Button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                {t("dashboard.overview")}
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                {t("dashboard.bookings")}
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="appointments" className="gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  {t("dashboard.appointments")}
                </TabsTrigger>
              )}
              <TabsTrigger value="analytics" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                {t("dashboard.analytics")}
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="doctors" className="gap-2">
                  <Stethoscope className="h-4 w-4" />
                  {t("dashboard.doctors")}
                </TabsTrigger>
              )}
              {isAdmin && (
                <TabsTrigger value="staff" className="gap-2">
                  <Users className="h-4 w-4" />
                  {t("dashboard.staffManagement")}
                </TabsTrigger>
              )}
              {isAdmin && (
                <TabsTrigger value="messages" className="gap-2">
                  <Mail className="h-4 w-4" />
                  {t("dashboard.messages")}
                </TabsTrigger>
              )}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{t("dashboard.todayBookings")}</p>
                        <p className="text-3xl font-bold text-foreground">{stats.today}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3 text-success" />
                          <span className="text-success">+12%</span> {t("dashboard.fromYesterday")}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{t("dashboard.thisWeek")}</p>
                        <p className="text-3xl font-bold text-foreground">{stats.thisWeek}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3 text-success" />
                          <span className="text-success">+8%</span> {t("dashboard.fromLastWeek")}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{t("dashboard.thisMonth")}</p>
                        <p className="text-3xl font-bold text-foreground">{stats.thisMonth}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3 text-success" />
                          <span className="text-success">+15%</span> {t("dashboard.fromLastMonth")}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-success" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{t("dashboard.completionRate")}</p>
                        <p className="text-3xl font-bold text-foreground">
                          {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stats.completed} {t("dashboard.of")} {stats.total} {t("dashboard.completed")}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Weekly Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("dashboard.weeklyTrend")}</CardTitle>
                    <CardDescription>{t("dashboard.weeklyTrendDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyTrend}>
                          <defs>
                            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="day" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="bookings" 
                            stroke={CHART_COLORS.primary} 
                            fillOpacity={1} 
                            fill="url(#colorBookings)" 
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("dashboard.statusDistribution")}</CardTitle>
                    <CardDescription>{t("dashboard.statusDistributionDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={statusBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {statusBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      {statusBreakdown.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-muted-foreground">{item.name}</span>
                          <span className="text-sm font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Row */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Status Cards */}
                <div className="md:col-span-2 grid grid-cols-5 gap-3">
                  <Card className="text-center">
                    <CardContent className="pt-4 pb-4">
                      <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <p className="text-2xl font-bold">{stats.pending}</p>
                      <p className="text-xs text-muted-foreground">{t("status.pending")}</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-4 pb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-2">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold">{stats.assigned}</p>
                      <p className="text-xs text-muted-foreground">{t("status.assigned")}</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-4 pb-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-2">
                        <FlaskConical className="h-5 w-5 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold">{stats.collected}</p>
                      <p className="text-xs text-muted-foreground">{t("status.collected")}</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-4 pb-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mx-auto mb-2">
                        <RefreshCw className="h-5 w-5 text-orange-600" />
                      </div>
                      <p className="text-2xl font-bold">{stats.processing}</p>
                      <p className="text-xs text-muted-foreground">{t("status.processing")}</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-4 pb-4">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold">{stats.ready}</p>
                      <p className="text-xs text-muted-foreground">{t("status.ready")}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      {t("dashboard.recentActivity")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivity.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {t("dashboard.noRecentActivity")}
                      </p>
                    ) : (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 text-sm">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.status === "requested" ? "bg-yellow-500" :
                            activity.status === "ready" ? "bg-green-500" : "bg-primary"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{activity.name}</p>
                            <p className="text-muted-foreground text-xs">{activity.action}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {activity.time}
                          </span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
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

                            {/* Upload Report - available for both Admin and Staff */}
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

                            {/* Admin-only actions */}
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
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Service Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("dashboard.serviceBreakdown")}</CardTitle>
                    <CardDescription>{t("dashboard.serviceBreakdownDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={serviceBreakdown} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" className="text-xs" />
                          <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {serviceBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Completion Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("dashboard.completionMetrics")}</CardTitle>
                    <CardDescription>{t("dashboard.completionMetricsDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{t("status.completed")}</span>
                          <span className="font-medium">{stats.completed} / {stats.total}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success rounded-full transition-all"
                            style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{t("dashboard.inProgress")}</span>
                          <span className="font-medium">{stats.inProgress} / {stats.total}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{t("status.pending")}</span>
                          <span className="font-medium">{stats.pending} / {stats.total}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("dashboard.avgProcessingTime")}</span>
                        <span className="font-medium">{t("dashboard.avgProcessingTimeVal")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("dashboard.customerSatisfaction")}</span>
                        <span className="font-medium text-success">98%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("dashboard.onTimeDelivery")}</span>
                        <span className="font-medium">95%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Appointments Management Tab */}
            {isAdmin && (
              <TabsContent value="appointments" className="space-y-6">
                <AppointmentsManagement />
              </TabsContent>
            )}

            {/* Doctors Management Tab */}
            {isAdmin && (
              <TabsContent value="doctors" className="space-y-6">
                <DoctorManagement />
              </TabsContent>
            )}

            {/* Staff Management Tab */}
            {isAdmin && (
              <TabsContent value="staff" className="space-y-6">
                <StaffManagement />
              </TabsContent>
            )}

            {/* Contact Messages Tab */}
            {isAdmin && (
              <TabsContent value="messages" className="space-y-6">
                <ContactMessagesManagement />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dashboard.rescheduleRequest")}</DialogTitle>
            <DialogDescription>
              {t("dashboard.rescheduleDesc")}
            </DialogDescription>
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
            <DialogDescription>
              {t("dashboard.assignStaffDesc")}
            </DialogDescription>
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
