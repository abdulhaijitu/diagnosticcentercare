import { useState, useMemo } from "react";
import { useContactMessages, ContactMessage } from "@/hooks/useContactMessages";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Mail, Phone, Calendar, User, MessageSquare,
  CheckCircle2, Clock, Trash2, Eye, RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const statusColors: Record<string, string> = {
  unread: "bg-yellow-100 text-yellow-800",
  read: "bg-blue-100 text-blue-800",
  responded: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  unread: "অপঠিত",
  read: "পঠিত",
  responded: "উত্তর দেওয়া হয়েছে",
};

export function ContactMessagesManagement() {
  const { messages, isLoading, updateMessageStatus, deleteMessage, refetch } = useContactMessages();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  // Stats
  const stats = useMemo(() => ({
    total: messages.length,
    unread: messages.filter(m => m.status === "unread").length,
    read: messages.filter(m => m.status === "read").length,
    responded: messages.filter(m => m.status === "responded").length,
  }), [messages]);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    if (statusFilter === "all") return messages;
    return messages.filter(m => m.status === statusFilter);
  }, [messages, statusFilter]);

  const handleView = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewOpen(true);
    
    // Mark as read if unread
    if (message.status === "unread") {
      await updateMessageStatus(message.id, "read");
    }
  };

  const handleStatusUpdate = async (messageId: string, status: string) => {
    await updateMessageStatus(messageId, status);
  };

  const handleDeleteConfirm = async () => {
    if (messageToDelete) {
      await deleteMessage(messageToDelete);
      setIsDeleteOpen(false);
      setMessageToDelete(null);
    }
  };

  const openDelete = (messageId: string) => {
    setMessageToDelete(messageId);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট মেসেজ</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">অপঠিত</p>
                <p className="text-2xl font-bold">{stats.unread}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">পঠিত</p>
                <p className="text-2xl font-bold">{stats.read}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">উত্তর দেওয়া</p>
                <p className="text-2xl font-bold">{stats.responded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                যোগাযোগ বার্তা
              </CardTitle>
              <CardDescription>
                গ্রাহকদের কাছ থেকে আসা সব বার্তা
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="ফিল্টার করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                  <SelectItem value="unread">অপঠিত</SelectItem>
                  <SelectItem value="read">পঠিত</SelectItem>
                  <SelectItem value="responded">উত্তর দেওয়া</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                কোনো বার্তা নেই
              </h3>
              <p className="text-sm text-muted-foreground">
                এখনো কোনো যোগাযোগ বার্তা আসেনি।
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`border-l-4 hover:shadow-md transition-shadow cursor-pointer ${
                    message.status === "unread" ? "border-l-yellow-500 bg-yellow-50/50" : "border-l-primary"
                  }`}
                  onClick={() => handleView(message)}
                >
                  <CardContent className="pt-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Message Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{message.name}</span>
                          </div>
                          <Badge className={statusColors[message.status]}>
                            {statusLabels[message.status]}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {message.email}
                          </div>
                          {message.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {message.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(message.created_at), "dd MMM yyyy, hh:mm a", { locale: bn })}
                          </div>
                        </div>

                        <p className="text-sm font-medium text-foreground">
                          বিষয়: {message.subject}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Select 
                          value={message.status} 
                          onValueChange={(value) => handleStatusUpdate(message.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unread">অপঠিত</SelectItem>
                            <SelectItem value="read">পঠিত</SelectItem>
                            <SelectItem value="responded">উত্তর দেওয়া</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => openDelete(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>বার্তার বিস্তারিত</DialogTitle>
            <DialogDescription>
              গ্রাহকের পাঠানো বার্তা
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">নাম</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ইমেইল</p>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ফোন</p>
                  <p className="font-medium">{selectedMessage.phone || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">তারিখ</p>
                  <p className="font-medium">
                    {format(new Date(selectedMessage.created_at), "dd MMM yyyy, hh:mm a", { locale: bn })}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">বিষয়</p>
                <p className="font-medium">{selectedMessage.subject}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">বার্তা</p>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleStatusUpdate(selectedMessage.id, "responded")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  উত্তর দেওয়া হয়েছে
                </Button>
                <Button
                  variant="outline"
                  asChild
                >
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    ইমেইল পাঠান
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>মেসেজ ডিলিট করবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              এই মেসেজটি স্থায়ীভাবে ডিলিট হয়ে যাবে। এটি আর ফেরত আনা যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              ডিলিট করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
