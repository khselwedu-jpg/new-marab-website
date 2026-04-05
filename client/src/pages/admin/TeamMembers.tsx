import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

const emptyForm = {
  nameAr: "",
  nameEn: "",
  positionAr: "",
  positionEn: "",
  bioAr: "",
  bioEn: "",
  imageUrl: "",
  displayOrder: 0,
  isActive: true,
};

export default function TeamMembersAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const utils = trpc.useUtils();
  const { data: members, isLoading } = trpc.admin.team.list.useQuery();

  const createMutation = trpc.admin.team.create.useMutation({
    onSuccess: () => { toast.success("تم إضافة العضو"); utils.admin.team.list.invalidate(); setIsDialogOpen(false); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.admin.team.update.useMutation({
    onSuccess: () => { toast.success("تم التحديث"); utils.admin.team.list.invalidate(); setIsDialogOpen(false); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.admin.team.delete.useMutation({
    onSuccess: () => { toast.success("تم الحذف"); utils.admin.team.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setIsDialogOpen(true); };
  const openEdit = (m: any) => {
    setForm({ nameAr: m.nameAr, nameEn: m.nameEn, positionAr: m.positionAr || "", positionEn: m.positionEn || "", bioAr: m.bioAr || "", bioEn: m.bioEn || "", imageUrl: m.imageUrl || "", displayOrder: m.displayOrder, isActive: m.isActive });
    setEditingId(m.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.nameAr) { toast.error("الاسم بالعربي مطلوب"); return; }
    if (editingId) updateMutation.mutate({ id: editingId, ...form });
    else createMutation.mutate(form);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">فريق العمل</h1>
            <p className="text-muted-foreground text-sm mt-1">إدارة أعضاء فريق الشركة</p>
          </div>
          <Button onClick={openCreate}><Plus className="w-4 h-4 ml-2" />إضافة عضو</Button>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>
        ) : !members || members.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا يوجد أعضاء بعد.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الصورة</TableHead>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">المنصب</TableHead>
                <TableHead className="text-right">الترتيب</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    {m.imageUrl ? <img src={m.imageUrl} alt={m.nameAr} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"><Users className="w-5 h-5 text-muted-foreground" /></div>}
                  </TableCell>
                  <TableCell className="font-medium">{m.nameAr}</TableCell>
                  <TableCell className="text-muted-foreground">{m.positionAr}</TableCell>
                  <TableCell>{m.displayOrder}</TableCell>
                  <TableCell><Badge variant={m.isActive ? "default" : "secondary"}>{m.isActive ? "نشط" : "مخفي"}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(m)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate({ id: m.id })}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? "تعديل عضو" : "إضافة عضو جديد"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>الاسم بالعربي *</Label><Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></div>
                <div><Label>الاسم بالإنجليزي</Label><Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>المنصب بالعربي</Label><Input value={form.positionAr} onChange={(e) => setForm({ ...form, positionAr: e.target.value })} /></div>
                <div><Label>المنصب بالإنجليزي</Label><Input value={form.positionEn} onChange={(e) => setForm({ ...form, positionEn: e.target.value })} /></div>
              </div>
              <div><Label>نبذة بالعربي</Label><Textarea value={form.bioAr} onChange={(e) => setForm({ ...form, bioAr: e.target.value })} rows={3} /></div>
              <div><Label>نبذة بالإنجليزي</Label><Textarea value={form.bioEn} onChange={(e) => setForm({ ...form, bioEn: e.target.value })} rows={3} /></div>
              <div><Label>الصورة</Label><ImageUpload value={form.imageUrl} onChange={(url: string) => setForm({ ...form, imageUrl: url })} /></div>
              <div><Label>الترتيب</Label><Input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} /><Label>نشط</Label></div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>{(createMutation.isPending || updateMutation.isPending) ? "جاري الحفظ..." : "حفظ"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
