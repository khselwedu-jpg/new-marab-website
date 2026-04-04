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
import type { Partner } from "../../../../drizzle/schema";
import { ImageUpload } from "@/components/admin/ImageUpload";

const defaultForm = {
  nameAr: "",
  nameEn: "",
  logoUrl: "",
  websiteUrl: "",
  descriptionAr: "",
  descriptionEn: "",
  category: "other" as "reinsurer" | "broker" | "medical" | "other",
  displayOrder: 0,
  isActive: true,
};

export default function PartnersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const { data: items, isLoading, refetch } = trpc.admin.partners.list.useQuery();
  const createMutation = trpc.admin.partners.create.useMutation();
  const updateMutation = trpc.admin.partners.update.useMutation();
  const deleteMutation = trpc.admin.partners.delete.useMutation();

  const handleEdit = (item: Partner) => {
    setEditingItem(item);
    setFormData({
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      logoUrl: item.logoUrl || "",
      websiteUrl: item.websiteUrl || "",
      descriptionAr: item.descriptionAr || "",
      descriptionEn: item.descriptionEn || "",
      category: item.category,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: Partner) => {
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

  const categoryLabels: Record<string, string> = {
    reinsurer: "معيد تأمين",
    broker: "وسيط تأمين",
    medical: "طبي",
    other: "أخرى",
  };

  const columns = [
    { key: "displayOrder", label: "الترتيب" },
    { key: "nameAr", label: "الاسم (عربي)" },
    { key: "nameEn", label: "الاسم (إنجليزي)" },
    {
      key: "logoUrl",
      label: "الشعار",
      render: (item: Partner) => item.logoUrl ? (
        <img src={item.logoUrl} alt={item.nameEn} className="h-10 w-20 object-contain" />
      ) : <span className="text-gray-400">—</span>,
    },
    {
      key: "category",
      label: "الفئة",
      render: (item: Partner) => (
        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">{categoryLabels[item.category]}</span>
      ),
    },
    {
      key: "isActive",
      label: "الحالة",
      render: (item: Partner) => (
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
            <h1 className="text-3xl font-bold text-primary">الشركاء</h1>
            <p className="text-foreground/70 mt-2">إدارة شركاء الشركة (معيدو التأمين، الوسطاء، الشركاء الطبيون)</p>
          </div>
          <Button onClick={() => { setEditingItem(null); setFormData(defaultForm); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة شريك
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
            <DialogTitle>{editingItem ? "تعديل الشريك" : "إضافة شريك جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الاسم (عربي)</label>
                <Input value={formData.nameAr} onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الاسم (إنجليزي)</label>
                <Input value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} required />
              </div>
            </div>

            <ImageUpload
              value={formData.logoUrl}
              onChange={(url) => setFormData({ ...formData, logoUrl: url })}
              label="شعار الشريك"
            />

            <div>
              <label className="block text-sm font-medium mb-2">رابط الموقع</label>
              <Input value={formData.websiteUrl} onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })} placeholder="https://..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الوصف (عربي)</label>
                <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })} rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الوصف (إنجليزي)</label>
                <Textarea value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} rows={2} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الفئة</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full border border-input rounded-md px-3 py-2 text-sm"
              >
                <option value="reinsurer">معيد تأمين</option>
                <option value="broker">وسيط تأمين</option>
                <option value="medical">طبي</option>
                <option value="other">أخرى</option>
              </select>
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
