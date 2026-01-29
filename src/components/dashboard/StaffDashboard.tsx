import { useState, useMemo } from "react";
import { useHomeCollectionRequests, CollectionStatus } from "@/hooks/useHomeCollectionRequests";
import { useReports } from "@/hooks/useReports";
import { ReportUploadDialog } from "@/components/reports/ReportUploadDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, Clock, MapPin, Phone, FlaskConical,
  CheckCircle2, AlertCircle, ClipboardList, FileUp,
  TrendingUp, User, FileText, Package
} from "lucide-react";
import { format, isToday, isThisWeek } from "date-fns";

const statusColors: Record<CollectionStatus, string> = {
  requested: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  collected: "bg-purple-100 text-purple-800",
  processing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
};

const statusLabels: Record<CollectionStatus, string> = {
  requested: "অনুরোধ করা হয়েছে",
  assigned: "অ্যাসাইন করা হয়েছে",
  collected: "স্যাম্পল সংগ্রহ হয়েছে",
  processing: "প্রসেসিং চলছে",
  ready: "রিপোর্ট রেডি",
};

export function StaffDashboard() {
  const { requests, isLoading, updateRequestStatus } = useHomeCollectionRequests();
  const { getReportsForRequest } = useReports();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUploadReportOpen, setIsUploadReportOpen] = useState(false);
  const [uploadRequestData, setUploadRequestData] = useState<{ 
    requestId: string; 
    patientId: string; 
    patientName: string 
  } | null>(null);

  // Stats for Staff
  const stats = useMemo(() => {
    const todayRequests = requests.filter(r => isToday(new Date(r.preferred_date)));
    const weekRequests = requests.filter(r => isThisWeek(new Date(r.preferred_date)));
    
    return {
      total: requests.length,
      today: todayRequests.length,
      thisWeek: weekRequests.length,
      pending: requests.filter(r => r.status === "assigned").length,
      collected: requests.filter(r => r.status === "collected").length,
      processing: requests.filter(r => r.status === "processing").length,
      completed: requests.filter(r => r.status === "ready").length,
    };
  }, [requests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    if (statusFilter === "all") return requests;
    return requests.filter(r => r.status === statusFilter);
  }, [requests, statusFilter]);

  const handleStatusUpdate = async (requestId: string, newStatus: CollectionStatus) => {
    await updateRequestStatus(requestId, newStatus);
  };

  const openUploadReport = (requestId: string, patientId: string, patientName: string) => {
    setUploadRequestData({ requestId, patientId, patientName });
    setIsUploadReportOpen(true);
  };

  // Get next status options based on current status
  const getNextStatuses = (currentStatus: CollectionStatus): CollectionStatus[] => {
    switch (currentStatus) {
      case "assigned":
        return ["collected"];
      case "collected":
        return ["processing"];
      case "processing":
        return ["ready"];
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
          👋 স্বাগতম! আজকের কাজের সারসংক্ষেপ
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          আপনার উপর অ্যাসাইন করা সব হোম কালেকশন রিকোয়েস্ট এখানে দেখুন এবং স্ট্যাটাস আপডেট করুন।
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">মোট অ্যাসাইনমেন্ট</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">আজকের কালেকশন</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">পেন্ডিং</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">সম্পন্ন</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request List */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                আমার অ্যাসাইনমেন্ট
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                আপনার উপর অ্যাসাইন করা সব হোম কালেকশন রিকোয়েস্ট
              </CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="ফিল্টার করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                <SelectItem value="assigned">অ্যাসাইনড</SelectItem>
                <SelectItem value="collected">কালেক্টেড</SelectItem>
                <SelectItem value="processing">প্রসেসিং</SelectItem>
                <SelectItem value="ready">রেডি</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                কোনো অ্যাসাইনমেন্ট নেই
              </h3>
              <p className="text-sm text-muted-foreground">
                আপনার উপর এখনো কোনো হোম কালেকশন অ্যাসাইন করা হয়নি।
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:pt-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      {/* Patient Info Row */}
                      <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">{request.full_name}</h4>
                            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                              <Phone className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{request.phone}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${statusColors[request.status]} text-[10px] sm:text-xs`}>
                          {statusLabels[request.status]}
                        </Badge>
                      </div>

                      {/* Tests */}
                      <div className="flex items-start gap-2">
                        <FlaskConical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {request.test_names.map((test, idx) => (
                            <Badge key={idx} variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Schedule & Location */}
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground flex-wrap">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{format(new Date(request.preferred_date), "dd MMM yyyy")}</span>
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 sm:ml-2 flex-shrink-0" />
                          <span>{request.preferred_time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{request.address}</span>
                        </div>
                      </div>

                      {/* Actions - Stack on mobile */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
                        {/* Status Update Buttons */}
                        {getNextStatuses(request.status).map((nextStatus) => (
                          <Button
                            key={nextStatus}
                            size="sm"
                            onClick={() => handleStatusUpdate(request.id, nextStatus)}
                            className="flex-1 text-xs sm:text-sm h-9"
                          >
                            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                            {nextStatus === "collected" && "স্যাম্পল সংগ্রহ হয়েছে"}
                            {nextStatus === "processing" && "প্রসেসিং শুরু"}
                            {nextStatus === "ready" && "রিপোর্ট রেডি"}
                          </Button>
                        ))}

                        {/* Upload Report */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUploadReport(request.id, request.patient_id, request.full_name)}
                          className="flex-1 text-xs sm:text-sm h-9"
                        >
                          <FileUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          রিপোর্ট আপলোড
                        </Button>

                        {/* Report Count */}
                        {getReportsForRequest(request.id).length > 0 && (
                          <Badge variant="secondary" className="justify-center gap-1 h-9 px-3">
                            <FileText className="h-3 w-3" />
                            {getReportsForRequest(request.id).length} রিপোর্ট
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  );
}
