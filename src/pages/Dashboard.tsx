import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeCollectionRequests, CollectionStatus } from "@/hooks/useHomeCollectionRequests";
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
  CheckCircle2, AlertCircle, Users, ClipboardList, RefreshCw
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { format } from "date-fns";

const statusColors: Record<CollectionStatus, string> = {
  requested: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  collected: "bg-purple-100 text-purple-800",
  processing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
};

const Dashboard = () => {
  const { user, isLoading: authLoading, isAdmin, isStaff } = useAuth();
  const { requests, isLoading, updateRequestStatus, assignStaff, reschedule } = useHomeCollectionRequests();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" });
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-padding">
          <div className="container-custom">
            <Skeleton className="h-10 w-64 mb-8" />
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

  const filteredRequests = requests.filter((r) => 
    statusFilter === "all" || r.status === statusFilter
  );

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "requested").length,
    assigned: requests.filter((r) => r.status === "assigned").length,
    collected: requests.filter((r) => r.status === "collected").length,
    processing: requests.filter((r) => r.status === "processing").length,
    ready: requests.filter((r) => r.status === "ready").length,
  };

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 section-padding">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-display-sm font-bold text-foreground">
                {isAdmin ? "Admin Dashboard" : "Staff Dashboard"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isAdmin 
                  ? "Manage all home collection requests" 
                  : "View and update your assigned tasks"}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          {isAdmin && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.pending}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.assigned}</p>
                      <p className="text-xs text-muted-foreground">Assigned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FlaskConical className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.collected}</p>
                      <p className="text-xs text-muted-foreground">Collected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.processing}</p>
                      <p className="text-xs text-muted-foreground">Processing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.ready}</p>
                      <p className="text-xs text-muted-foreground">Ready</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filter */}
          <div className="flex items-center gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="collected">Collected</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>
          </div>

          {/* Requests List */}
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
                <h3 className="text-lg font-semibold text-foreground mb-2">No requests found</h3>
                <p className="text-muted-foreground">
                  {statusFilter !== "all" 
                    ? "Try changing the filter to see more requests" 
                    : "No home collection requests have been made yet"}
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
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:w-48">
                        {/* Status Update */}
                        <Select
                          value={request.status}
                          onValueChange={(value) => handleStatusUpdate(request.id, value as CollectionStatus)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="requested">Requested</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="collected">Collected</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                          </SelectContent>
                        </Select>

                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openReschedule(request.id)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Reschedule
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Request</DialogTitle>
            <DialogDescription>
              Select a new date and time for the home collection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">New Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleData.date}
                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-time">New Time</Label>
              <Select
                value={rescheduleData.time}
                onValueChange={(value) => setRescheduleData({ ...rescheduleData, time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
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
              Confirm Reschedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Dashboard;
