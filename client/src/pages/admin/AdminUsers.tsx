import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, KeyRound, UserCheck, UserX } from "lucide-react";

export default function AdminUsers() {
  const utils = trpc.useUtils();
  const { data: users = [], isLoading } = trpc.admin.users.list.useQuery();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [newUser, setNewUser] = useState({ username: "", password: "", name: "" });
  const [editUser, setEditUser] = useState({ id: 0, username: "", name: "", isActive: true });
  const [newPassword, setNewPassword] = useState({ id: 0, newPassword: "", confirm: "" });

  const createMutation = trpc.admin.users.create.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء المستخدم بنجاح");
      utils.admin.users.list.invalidate();
      setShowAddDialog(false);
      setNewUser({ username: "", password: "", name: "" });
    },
    onError: (e) => toast.error(e.message || "حدث خطأ"),
  });

  const updateMutation = trpc.admin.users.update.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث المستخدم");
      utils.admin.users.list.invalidate();
      setShowEditDialog(false);
    },
    onError: (e) => toast.error(e.message || "حدث خطأ"),
  });

  const changePasswordMutation = trpc.admin.users.changePassword.useMutation({
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح");
      setShowPasswordDialog(false);
      setNewPassword({ id: 0, newPassword: "", confirm: "" });
    },
    onError: (e) => toast.error(e.message || "حدث خطأ"),
  });

  const deleteMutation = trpc.admin.users.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف المستخدم");
      utils.admin.users.list.invalidate();
      setShowDeleteDialog(false);
    },
    onError: (e) => toast.error(e.message || "حدث خطأ"),
  });

  const handleCreate = () => {
    if (!newUser.username || !newUser.password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    createMutation.mutate(newUser);
  };

  const handleUpdate = () => {
    updateMutation.mutate(editUser);
  };

  const handleChangePassword = () => {
    if (newPassword.newPassword !== newPassword.confirm) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }
    if (newPassword.newPassword.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    changePasswordMutation.mutate({ id: newPassword.id, newPassword: newPassword.newPassword });
  };

  const handleDelete = () => {
    if (selectedUser) deleteMutation.mutate({ id: selectedUser.id });
  };

  const openEdit = (user: any) => {
    setEditUser({ id: user.id, username: user.username, name: user.name || "", isActive: user.isActive ?? true });
    setShowEditDialog(true);
  };

  const openChangePassword = (user: any) => {
    setNewPassword({ id: user.id, newPassword: "", confirm: "" });
    setShowPasswordDialog(true);
  };

  const openDelete = (user: any) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0A1F3D]">إدارة المستخدمين</h1>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#0A1F3D] hover:bg-[#0A1F3D]/90 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة مستخدم
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">جاري التحميل...</div>
      ) : (
        <div className="grid gap-4">
          {users.map((user: any) => (
            <Card key={user.id} className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0A1F3D] flex items-center justify-center text-white font-bold text-lg">
                      {(user.name || user.username).charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#0A1F3D]">{user.name || user.username}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                      {user.lastSignedIn && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          آخر دخول: {new Date(user.lastSignedIn).toLocaleDateString("ar-YE")}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={user.isActive ? "default" : "secondary"} className={user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}>
                      {user.isActive ? <><UserCheck className="w-3 h-3 ml-1 inline" />نشط</> : <><UserX className="w-3 h-3 ml-1 inline" />معطّل</>}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => openChangePassword(user)} className="gap-1">
                      <KeyRound className="w-3.5 h-3.5" />
                      كلمة المرور
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(user)} className="gap-1">
                      <Pencil className="w-3.5 h-3.5" />
                      تعديل
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openDelete(user)} className="gap-1 text-red-600 hover:text-red-700 hover:border-red-300">
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-400">لا يوجد مستخدمون</div>
          )}
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>الاسم الكامل</Label>
              <Input value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} placeholder="مثال: أحمد محمد" className="mt-1" />
            </div>
            <div>
              <Label>اسم المستخدم <span className="text-red-500">*</span></Label>
              <Input value={newUser.username} onChange={e => setNewUser(p => ({ ...p, username: e.target.value }))} placeholder="مثال: admin2" className="mt-1" />
            </div>
            <div>
              <Label>كلمة المرور <span className="text-red-500">*</span></Label>
              <Input type="password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} placeholder="6 أحرف على الأقل" className="mt-1" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>إلغاء</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending} className="bg-[#0A1F3D] text-white">
              {createMutation.isPending ? "جاري الإنشاء..." : "إنشاء"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>الاسم الكامل</Label>
              <Input value={editUser.name} onChange={e => setEditUser(p => ({ ...p, name: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>اسم المستخدم</Label>
              <Input value={editUser.username} onChange={e => setEditUser(p => ({ ...p, username: e.target.value }))} className="mt-1" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={editUser.isActive} onCheckedChange={v => setEditUser(p => ({ ...p, isActive: v }))} />
              <Label>{editUser.isActive ? "الحساب نشط" : "الحساب معطّل"}</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>إلغاء</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending} className="bg-[#0A1F3D] text-white">
              {updateMutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>تغيير كلمة المرور</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>كلمة المرور الجديدة</Label>
              <Input type="password" value={newPassword.newPassword} onChange={e => setNewPassword(p => ({ ...p, newPassword: e.target.value }))} placeholder="6 أحرف على الأقل" className="mt-1" />
            </div>
            <div>
              <Label>تأكيد كلمة المرور</Label>
              <Input type="password" value={newPassword.confirm} onChange={e => setNewPassword(p => ({ ...p, confirm: e.target.value }))} placeholder="أعد كتابة كلمة المرور" className="mt-1" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>إلغاء</Button>
            <Button onClick={handleChangePassword} disabled={changePasswordMutation.isPending} className="bg-[#0A1F3D] text-white">
              {changePasswordMutation.isPending ? "جاري التغيير..." : "تغيير"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent dir="rtl" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 py-2">هل أنت متأكد من حذف المستخدم <strong>{selectedUser?.name || selectedUser?.username}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>إلغاء</Button>
            <Button onClick={handleDelete} disabled={deleteMutation.isPending} variant="destructive">
              {deleteMutation.isPending ? "جاري الحذف..." : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
