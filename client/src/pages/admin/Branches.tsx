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
import type { Branch } from "../../../../drizzle/schema";
import { ImageUpload } from "@/components/admin/ImageUpload";

const defaultForm = {
  nameAr: "",
  nameEn: "",
  addressAr: "",
  addressEn: "",
  phone: "",
  email: "",
  imageUrl: "",
  latitude: "",
  longitude: "",
  mapUrl: "",
  displayOrder: 0,
  isActive: true,
};

export default function BranchesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Branch | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const { data: items, isLoading, refetch } = trpc.admin.branches.list.useQuery();
  const createMutation = trpc.admin.branches.create.useMutation();
  const updateMutation = trpc.admin.branches.update.useMutation();
  const deleteMutation = trpc.admin.branches.delete.useMutation();

  const handleEdit = (item: Branch) => {
    setEditingItem(item);
    setFormData({
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      addressAr: item.addressAr,
      addressEn: item.addressEn,
      phone: item.phone,
      email: item.email || "",
      imageUrl: item.imageUrl || "",
      latitude: item.latitude || "",
      longitude: item.longitude || "",
      mapUrl: item.mapUrl || "",
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: Branch) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفرع؟")) return;
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
    { key: "nameAr", label: "الاسم (عربي)" },
    { key: "nameEn", label: "الاسم (إنجليزي)" },
    { key: "phone", label: "الهاتف" },
    { key: "email", label: "البريد الإلكتروني" },
    {
      key: "isActive",
      label: "الحالة",
      render: (item: Branch) => (
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
            <h1 className="text-3xl font-bold text-primary">الفروع</h1>
            <p className="text-foreground/70 mt-2">إدارة فروع الشركة ومعلوماتها</p>
          </div>
          <Button onClick={() => { setEditingItem(null); setFormData(defaultForm); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة فرع
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
            <DialogTitle>{editingItem ? "تعديل الفرع" : "إضافة فرع جديد"}</DialogTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">العنوان (عربي)</label>
                <Textarea value={formData.addressAr} onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })} rows={2} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">العنوان (إنجليزي)</label>
                <Textarea value={formData.addressEn} onChange={(e) => setFormData({ ...formData, addressEn: e.target.value })} rows={2} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الهاتف</label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              label="صورة الفرع"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">خط العرض (Latitude)</label>
                <Input value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} placeholder="15.3694" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">خط الطول (Longitude)</label>
                <Input value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} placeholder="44.1910" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">رابط خرائط جوجل</label>
              <Input value={formData.mapUrl} onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })} placeholder="https://maps.google.com/..." />
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
