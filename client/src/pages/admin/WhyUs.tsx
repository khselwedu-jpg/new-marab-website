import { AdminLayout } from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { WhyUsFeature } from "../../../../drizzle/schema";

const defaultForm = {
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  icon: "",
  displayOrder: 0,
  isActive: true,
};

export default function WhyUsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WhyUsFeature | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const { data: items, isLoading, refetch } = trpc.admin.whyUs.list.useQuery();
  const createMutation = trpc.admin.whyUs.create.useMutation();
  const updateMutation = trpc.admin.whyUs.update.useMutation();
  const deleteMutation = trpc.admin.whyUs.delete.useMutation();

  const handleEdit = (item: WhyUsFeature) => {
    setEditingItem(item);
    setFormData({
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      descriptionAr: item.descriptionAr,
      descriptionEn: item.descriptionEn,
      icon: item.icon,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: WhyUsFeature) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await deleteMutation.mutateAsync({ id: item.id });
      toast.success("تم الحذف بنجاح");
      refetch();
    } catch {
      toast.error("فشل الحذف");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, ...formData });
        toast.success("تم التحديث بنجاح");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("تمت الإضافة بنجاح");
      }
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(defaultForm);
      refetch();
    } catch {
      toast.error("فشل الحفظ");
    }
  };

  const columns = [
    { key: "displayOrder", label: "الترتيب" },
    { key: "icon", label: "الأيقونة" },
    { key: "titleAr", label: "العنوان (عربي)" },
    { key: "titleEn", label: "العنوان (إنجليزي)" },
    {
      key: "isActive",
      label: "الحالة",
      render: (item: WhyUsFeature) => (
        <span className={`px-2 py-1 rounded text-xs ${item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
          {item.isActive ? "نشط" : "غير نشط"}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">لماذا نحن</h1>
            <p className="text-foreground/70 mt-2">إدارة مميزات قسم "لماذا تختارنا"</p>
          </div>
          <Button onClick={() => { setEditingItem(null); setFormData(defaultForm); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة ميزة
          </Button>
        </div>

        <DataTable
          data={items || []}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "تعديل الميزة" : "إضافة ميزة جديدة"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">العنوان (عربي)</label>
                <Input value={formData.titleAr} onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">العنوان (إنجليزي)</label>
                <Input value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الوصف (عربي)</label>
                <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })} rows={3} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الوصف (إنجليزي)</label>
                <Textarea value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} rows={3} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الأيقونة (اسم Lucide)</label>
              <Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Shield, Award, Users, Clock..." required />
              <p className="text-xs text-gray-500 mt-1">أمثلة: Shield, Award, Users, Clock, Star, CheckCircle</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الترتيب</label>
              <Input type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })} />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
              <label className="text-sm font-medium">نشط</label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
