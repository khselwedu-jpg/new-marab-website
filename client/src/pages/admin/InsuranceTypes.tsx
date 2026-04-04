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
import type { InsuranceType } from "../../../../drizzle/schema";

const defaultForm = {
  slug: "",
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  imageUrl: "",
  icon: "",
  featuresAr: "",
  featuresEn: "",
  displayOrder: 0,
  isActive: true,
};

export default function InsuranceTypesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InsuranceType | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const { data: items, isLoading, refetch } = trpc.admin.insuranceTypes.list.useQuery();
  const createMutation = trpc.admin.insuranceTypes.create.useMutation();
  const updateMutation = trpc.admin.insuranceTypes.update.useMutation();
  const deleteMutation = trpc.admin.insuranceTypes.delete.useMutation();

  const handleEdit = (item: InsuranceType) => {
    setEditingItem(item);
    setFormData({
      slug: item.slug,
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      descriptionAr: item.descriptionAr,
      descriptionEn: item.descriptionEn,
      imageUrl: item.imageUrl,
      icon: item.icon || "",
      featuresAr: item.featuresAr || "",
      featuresEn: item.featuresEn || "",
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: InsuranceType) => {
    if (!confirm("هل أنت متأكد من حذف هذا النوع؟")) return;
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
    { key: "slug", label: "Slug" },
    { key: "titleAr", label: "الاسم (عربي)" },
    { key: "titleEn", label: "الاسم (إنجليزي)" },
    {
      key: "imageUrl",
      label: "الصورة",
      render: (item: InsuranceType) => (
        <img src={item.imageUrl} alt="Preview" className="h-12 w-20 object-cover rounded" />
      ),
    },
    {
      key: "isActive",
      label: "الحالة",
      render: (item: InsuranceType) => (
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
            <h1 className="text-3xl font-bold text-primary">أنواع التأمين</h1>
            <p className="text-foreground/70 mt-2">إدارة أنواع التأمين المعروضة في الموقع</p>
          </div>
          <Button onClick={() => { setEditingItem(null); setFormData(defaultForm); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة نوع
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "تعديل نوع التأمين" : "إضافة نوع تأمين جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Slug (رابط فريد بالإنجليزية)</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="health, car, marine..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الاسم (عربي)</label>
                <Input value={formData.titleAr} onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الاسم (إنجليزي)</label>
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
              <label className="block text-sm font-medium mb-2">رابط الصورة</label>
              <Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الأيقونة (اسم Lucide)</label>
                <Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Shield, Car, Anchor..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الترتيب</label>
                <Input type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">المميزات (عربي) - JSON</label>
                <Textarea value={formData.featuresAr} onChange={(e) => setFormData({ ...formData, featuresAr: e.target.value })} rows={3} placeholder='["ميزة 1", "ميزة 2"]' />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المميزات (إنجليزي) - JSON</label>
                <Textarea value={formData.featuresEn} onChange={(e) => setFormData({ ...formData, featuresEn: e.target.value })} rows={3} placeholder='["Feature 1", "Feature 2"]' />
              </div>
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
