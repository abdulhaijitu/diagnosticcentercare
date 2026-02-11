import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, UserPlus, Shield, Search, 
  Mail, Phone, CheckCircle2, XCircle, Loader2, Edit, Trash2
} from "lucide-react";

type AppRole = "super_admin" | "admin" | "doctor" | "manager" | "sales" | "staff" | "patient";

interface UserWithRoles {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  roles: AppRole[];
}

const roleLabels: Record<AppRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  doctor: "Doctor",
  manager: "Manager",
  sales: "Sales",
  staff: "Staff",
  patient: "Patient",
};

const roleBadgeColors: Record<AppRole, string> = {
  super_admin: "bg-red-100 text-red-800",
  admin: "bg-purple-100 text-purple-800",
  doctor: "bg-blue-100 text-blue-800",
  manager: "bg-indigo-100 text-indigo-800",
  sales: "bg-pink-100 text-pink-800",
  staff: "bg-green-100 text-green-800",
  patient: "bg-gray-100 text-gray-800",
};

export function StaffManagement() {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoveRoleOpen, setIsRemoveRoleOpen] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState<AppRole | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<AppRole>("staff");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, phone")
        .order("full_name");

      if (profilesError) throw profilesError;

      // Get all roles
      const { data: allRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        ...profile,
        roles: (allRoles || [])
          .filter(r => r.user_id === profile.id)
          .map(r => r.role as AppRole),
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: t("common.error"),
        description: t("staffMgmt.failedLoadUsers"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const filteredUsers = users.filter(u => {
    const searchLower = searchQuery.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower) ||
      u.phone?.includes(searchQuery)
    );
  });

  const openAddRole = (userItem: UserWithRoles) => {
    setSelectedUser(userItem);
    setSelectedRole("");
    setIsAddRoleOpen(true);
  };

  const handleAddRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: selectedUser.id,
          role: selectedRole,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: t("staffMgmt.alreadyExists"),
            description: t("staffMgmt.alreadyHasRole"),
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: t("common.success"),
          description: `${roleLabels[selectedRole]} ${t("staffMgmt.roleAdded")} ${selectedUser.full_name || selectedUser.email}`,
        });
        await fetchUsers();
      }
    } catch (error) {
      console.error("Error adding role:", error);
      toast({
        title: t("common.error"),
        description: t("staffMgmt.failedAddRole"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsAddRoleOpen(false);
    }
  };

  const openRemoveRole = (userItem: UserWithRoles, role: AppRole) => {
    setSelectedUser(userItem);
    setRoleToRemove(role);
    setIsRemoveRoleOpen(true);
  };

  const handleRemoveRole = async () => {
    if (!selectedUser || !roleToRemove) return;

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", selectedUser.id)
        .eq("role", roleToRemove);

      if (error) throw error;

      toast({
        title: t("common.success"),
        description: `${roleLabels[roleToRemove]} ${t("staffMgmt.roleRemoved")} ${selectedUser.full_name || selectedUser.email}`,
      });
      await fetchUsers();
    } catch (error) {
      console.error("Error removing role:", error);
      toast({
        title: t("common.error"),
        description: t("staffMgmt.failedRemoveRole"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsRemoveRoleOpen(false);
    }
  };

  const openEdit = (userItem: UserWithRoles) => {
    setSelectedUser(userItem);
    setEditName(userItem.full_name || "");
    setEditPhone(userItem.phone || "");
    setIsEditOpen(true);
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: editName, phone: editPhone })
        .eq("id", selectedUser.id);
      if (error) throw error;
      toast({ title: t("common.success"), description: t("staffMgmt.userUpdated") });
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({ title: t("common.error"), description: t("staffMgmt.failedUpdateUser"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      setIsEditOpen(false);
    }
  };

  const openDelete = (userItem: UserWithRoles) => {
    setSelectedUser(userItem);
    setIsDeleteOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      // Remove all roles for this user
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", selectedUser.id);
      if (error) throw error;
      toast({ title: t("common.success"), description: t("staffMgmt.userRolesRemoved") });
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user roles:", error);
      toast({ title: t("common.error"), description: t("staffMgmt.failedDeleteUser"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      setIsDeleteOpen(false);
    }
  };

  const handleAddStaff = async () => {
    if (!newStaffEmail || !newStaffPassword || !newStaffRole) return;
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.functions.invoke("add-staff", {
        body: {
          email: newStaffEmail,
          password: newStaffPassword,
          full_name: newStaffName,
          phone: newStaffPhone,
          role: newStaffRole,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: t("common.success"), description: "স্টাফ সফলভাবে যোগ করা হয়েছে" });
      setIsAddStaffOpen(false);
      setNewStaffEmail("");
      setNewStaffPassword("");
      setNewStaffName("");
      setNewStaffPhone("");
      setNewStaffRole("staff");
      await fetchUsers();
    } catch (error: any) {
      console.error("Error adding staff:", error);
      toast({ title: t("common.error"), description: error.message || "স্টাফ যোগ করতে সমস্যা হয়েছে", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get available roles for a user (roles they don't have yet)
  const getAvailableRoles = (userItem: UserWithRoles): AppRole[] => {
    const allRoles: AppRole[] = ["staff", "doctor", "manager", "sales", "admin"];
    return allRoles.filter(role => !userItem.roles.includes(role));
  };

  // Count staff members
  const staffCount = users.filter(u => u.roles.includes("staff")).length;
  const adminCount = users.filter(u => u.roles.some(r => ["admin", "super_admin", "manager"].includes(r))).length;

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t("staffMgmt.noPermission")}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Staff Members</p>
                <p className="text-2xl font-bold">{staffCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">{adminCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>{t("staffMgmt.userManagement")}</CardTitle>
              <CardDescription>{t("staffMgmt.userManagementDesc")}</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("staffMgmt.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setIsAddStaffOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("staffMgmt.userCol")}</TableHead>
                  <TableHead>{t("staffMgmt.contactCol")}</TableHead>
                  <TableHead>{t("staffMgmt.rolesCol")}</TableHead>
                  <TableHead className="text-right">{t("staffMgmt.actionsCol")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {t("staffMgmt.noUsersFound")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((userItem) => (
                    <TableRow key={userItem.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {userItem.full_name?.charAt(0) || userItem.email?.charAt(0) || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{userItem.full_name || t("staffMgmt.noName")}</p>
                            <p className="text-sm text-muted-foreground">{userItem.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {userItem.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">{userItem.email}</span>
                            </div>
                          )}
                          {userItem.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {userItem.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {userItem.roles.map((role) => (
                            <Badge
                              key={role}
                              variant="secondary"
                              className={`${roleBadgeColors[role]} cursor-pointer hover:opacity-80 transition-opacity`}
                              onClick={() => openRemoveRole(userItem, role)}
                              title="Click to remove"
                            >
                              {roleLabels[role]}
                              <XCircle className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                          {userItem.roles.length === 0 && (
                            <span className="text-sm text-muted-foreground">{t("staffMgmt.noRoles")}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAddRole(userItem)}
                            disabled={getAvailableRoles(userItem).length === 0}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            {t("staffMgmt.addRole")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEdit(userItem)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => openDelete(userItem)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("staffMgmt.addRole")}</DialogTitle>
            <DialogDescription>
              {t("staffMgmt.addRoleDesc")} {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as AppRole)}>
              <SelectTrigger>
                <SelectValue placeholder={t("staffMgmt.selectRole")} />
              </SelectTrigger>
              <SelectContent>
                {selectedUser && getAvailableRoles(selectedUser).map((role) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={roleBadgeColors[role]}>
                        {roleLabels[role]}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleAddRole} disabled={!selectedRole || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("staffMgmt.adding")}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t("staffMgmt.addRole")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Role Dialog */}
      <Dialog open={isRemoveRoleOpen} onOpenChange={setIsRemoveRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("staffMgmt.removeRole")}</DialogTitle>
            <DialogDescription>
              {t("staffMgmt.removeRoleDesc")} <strong>{roleToRemove && roleLabels[roleToRemove]}</strong> {t("staffMgmt.roleFrom")} {selectedUser?.full_name || selectedUser?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveRoleOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleRemoveRole} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("staffMgmt.removing")}
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  {t("staffMgmt.removeRole")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("staffMgmt.editUser")}</DialogTitle>
            <DialogDescription>
              {t("staffMgmt.editUserDesc")} {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("staffMgmt.fullName")}</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("staffMgmt.phone")}</label>
              <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleEditUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("common.saving")}</>
              ) : (
                <><CheckCircle2 className="h-4 w-4 mr-2" />{t("common.save")}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Roles Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("staffMgmt.deleteUser")}</DialogTitle>
            <DialogDescription>
              {t("staffMgmt.deleteUserDesc")} {selectedUser?.full_name || selectedUser?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("staffMgmt.removing")}</>
              ) : (
                <><Trash2 className="h-4 w-4 mr-2" />{t("staffMgmt.deleteUser")}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Add Staff Dialog */}
      <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নতুন স্টাফ যোগ করুন</DialogTitle>
            <DialogDescription>নতুন স্টাফ মেম্বারের তথ্য দিন</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>নাম *</Label>
              <Input value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} placeholder="পুরো নাম" />
            </div>
            <div className="space-y-2">
              <Label>ইমেইল *</Label>
              <Input type="email" value={newStaffEmail} onChange={(e) => setNewStaffEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label>পাসওয়ার্ড *</Label>
              <Input type="password" value={newStaffPassword} onChange={(e) => setNewStaffPassword(e.target.value)} placeholder="ন্যূনতম ৬ অক্ষর" />
            </div>
            <div className="space-y-2">
              <Label>ফোন</Label>
              <Input value={newStaffPhone} onChange={(e) => setNewStaffPhone(e.target.value)} placeholder="০১XXXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label>রোল *</Label>
              <Select value={newStaffRole} onValueChange={(val) => setNewStaffRole(val as AppRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStaffOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleAddStaff} disabled={!newStaffEmail || !newStaffPassword || isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />যোগ করা হচ্ছে...</>
              ) : (
                <><UserPlus className="h-4 w-4 mr-2" />যোগ করুন</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
