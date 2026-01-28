import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeCollectionRequests } from "@/hooks/useHomeCollectionRequests";
import { StatusTracker } from "@/components/home-collection/StatusTracker";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Phone, FlaskConical, AlertCircle } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const MyRequests = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { requests, isLoading } = useHomeCollectionRequests();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-padding">
          <div className="container-custom max-w-4xl">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "requested":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "collected":
        return "bg-purple-100 text-purple-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 section-padding">
        <div className="container-custom max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-display-sm font-bold text-foreground">My Requests</h1>
              <p className="text-muted-foreground mt-1">
                Track your home sample collection requests
              </p>
            </div>
            <Button asChild>
              <Link to="/book-test">Book New Test</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FlaskConical className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No requests yet</h3>
                <p className="text-muted-foreground mb-6">
                  Book a diagnostic test with home sample collection to get started
                </p>
                <Button asChild>
                  <Link to="/book-test">Book Your First Test</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {request.test_names.join(", ")}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Booked on {format(new Date(request.created_at), "PPP")}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Status Tracker */}
                    <StatusTracker currentStatus={request.status} />

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm font-medium">
                            {format(new Date(request.preferred_date), "PP")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Time</p>
                          <p className="text-sm font-medium">{request.preferred_time}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Contact</p>
                          <p className="text-sm font-medium">{request.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FlaskConical className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="text-sm font-medium">৳{request.total_amount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2 pt-4 border-t border-border">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Collection Address</p>
                        <p className="text-sm">{request.address}</p>
                      </div>
                    </div>

                    {/* Notes */}
                    {request.notes && (
                      <div className="flex items-start gap-2 pt-4 border-t border-border">
                        <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Notes</p>
                          <p className="text-sm">{request.notes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyRequests;
