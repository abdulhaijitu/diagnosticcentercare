import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";
import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";

const NotificationSettingsPage = () => {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 section-padding">
          <div className="container-custom max-w-4xl">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 section-padding">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="h-8 w-8 text-primary" />
              <h1 className="text-display-sm font-bold text-foreground">
                Notification Settings
              </h1>
            </div>
            <p className="text-muted-foreground">
              Configure which notifications are sent and through which channels.
              SMS and WhatsApp integrations can be enabled when connected to providers.
            </p>
          </div>

          <NotificationSettings />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationSettingsPage;
