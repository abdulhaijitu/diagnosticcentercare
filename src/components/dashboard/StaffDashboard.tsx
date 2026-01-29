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
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          👋 স্বাগতম! আজকের কাজের সারসংক্ষেপ
        </h2>
        <p className="text-muted-foreground">
          আপনার উপর অ্যাসাইন করা সব হোম কালেকশন রিকোয়েস্ট এখানে দেখুন এবং স্ট্যাটাস আপডেট করুন।
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট অ্যাসাইনমেন্ট</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">আজকের কালেকশন</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">পেন্ডিং</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">সম্পন্ন</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                আমার অ্যাসাইনমেন্ট
              </CardTitle>
              <CardDescription>
                আপনার উপর অ্যাসাইন করা সব হোম কালেকশন রিকোয়েস্ট
              </CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Patient Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{request.full_name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {request.phone}
                            </div>
                          </div>
                          <Badge className={statusColors[request.status]}>
                            {statusLabels[request.status]}
                          </Badge>
                        </div>

                        {/* Tests */}
                        <div className="flex items-start gap-2">
                          <FlaskConical className="h-4 w-4 text-primary mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {request.test_names.map((test, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {test}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Schedule & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(request.preferred_date), "dd MMM yyyy")}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{request.preferred_time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{request.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 min-w-[180px]">
                        {/* Status Update Buttons */}
                        {getNextStatuses(request.status).map((nextStatus) => (
                          <Button
                            key={nextStatus}
                            size="sm"
                            onClick={() => handleStatusUpdate(request.id, nextStatus)}
                            className="w-full"
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            {nextStatus === "collected" && "স্যাম্পল সংগ্রহ করা হয়েছে"}
                            {nextStatus === "processing" && "প্রসেসিং শুরু করুন"}
                            {nextStatus === "ready" && "রিপোর্ট রেডি"}
                          </Button>
                        ))}

                        {/* Upload Report */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUploadReport(request.id, request.patient_id, request.full_name)}
                          className="w-full"
                        >
                          <FileUp className="h-4 w-4 mr-2" />
                          রিপোর্ট আপলোড
                        </Button>

                        {/* Report Count */}
                        {getReportsForRequest(request.id).length > 0 && (
                          <Badge variant="secondary" className="justify-center gap-1">
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
