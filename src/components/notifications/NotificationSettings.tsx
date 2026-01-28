import { useNotificationSettings, NotificationType } from "@/hooks/useNotifications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, MessageSquare, Mail, Smartphone } from "lucide-react";

const typeLabels: Record<NotificationType, { label: string; description: string }> = {
  booking_confirmed: {
    label: "Booking Confirmed",
    description: "When a new booking is successfully created",
  },
  sample_assigned: {
    label: "Staff Assigned",
    description: "When a collection agent is assigned to a booking",
  },
  sample_collected: {
    label: "Sample Collected",
    description: "When samples are collected from the patient",
  },
  processing_started: {
    label: "Processing Started",
    description: "When samples start being processed at the lab",
  },
  report_ready: {
    label: "Report Ready",
    description: "When test reports are ready for download",
  },
};

export function NotificationSettings() {
  const { settings, isLoading, updateSetting } = useNotificationSettings();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Bell className="h-4 w-4" />
        <span>In-App</span>
        <Smartphone className="h-4 w-4 ml-4" />
        <span>SMS</span>
        <MessageSquare className="h-4 w-4 ml-4" />
        <span>WhatsApp</span>
        <Mail className="h-4 w-4 ml-4" />
        <span>Email</span>
      </div>

      {settings.map((setting) => {
        const typeInfo = typeLabels[setting.notification_type];
        return (
          <Card key={setting.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{typeInfo?.label || setting.notification_type}</CardTitle>
              <CardDescription className="text-sm">
                {typeInfo?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${setting.notification_type}-in-app`}
                    checked={setting.in_app_enabled}
                    onCheckedChange={(checked) =>
                      updateSetting(setting.notification_type, { in_app_enabled: checked })
                    }
                  />
                  <Label
                    htmlFor={`${setting.notification_type}-in-app`}
                    className="text-sm flex items-center gap-1.5"
                  >
                    <Bell className="h-4 w-4" />
                    In-App
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${setting.notification_type}-sms`}
                    checked={setting.sms_enabled}
                    onCheckedChange={(checked) =>
                      updateSetting(setting.notification_type, { sms_enabled: checked })
                    }
                  />
                  <Label
                    htmlFor={`${setting.notification_type}-sms`}
                    className="text-sm flex items-center gap-1.5 text-muted-foreground"
                  >
                    <Smartphone className="h-4 w-4" />
                    SMS
                    <span className="text-xs">(Coming Soon)</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${setting.notification_type}-whatsapp`}
                    checked={setting.whatsapp_enabled}
                    onCheckedChange={(checked) =>
                      updateSetting(setting.notification_type, { whatsapp_enabled: checked })
                    }
                  />
                  <Label
                    htmlFor={`${setting.notification_type}-whatsapp`}
                    className="text-sm flex items-center gap-1.5 text-muted-foreground"
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                    <span className="text-xs">(Coming Soon)</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${setting.notification_type}-email`}
                    checked={setting.email_enabled}
                    onCheckedChange={(checked) =>
                      updateSetting(setting.notification_type, { email_enabled: checked })
                    }
                  />
                  <Label
                    htmlFor={`${setting.notification_type}-email`}
                    className="text-sm flex items-center gap-1.5 text-muted-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                    <span className="text-xs">(Coming Soon)</span>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
