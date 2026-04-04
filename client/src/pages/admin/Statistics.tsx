import { AdminLayout } from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Statistic } from "../../../../drizzle/schema";

const defaultForm = {
  labelAr: "",
  labelEn: "",
  value: 0,
  suffix: "",
  prefix: "",
  displayOrder: 0,
  isActive: true,
};

export default function StatisticsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Statistic | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const { data: items, isLoading, refetch } = trpc.admin.statistics.list.useQuery();
  const createMutation = trpc.admin.statistics.create.useMutation();
  const updateMutation = trpc.admin.statistics.update.useMutation();
  const deleteMutation = trpc.admin.statistics.delete.useMutation();

  const handleEdit = (item: Statistic) => {
    setEditingItem(item);
    setFormData({
      labelAr: item.labelAr,
      labelEn: item.labelEn,
      value: item.value,
      suffix: item.suffix || "",
      prefix: item.prefix || "",
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: Statistic) => {
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
    { key: "labelAr", label: "التسمية (عربي)" },
    { key: "labelEn", label: "التسمية (إنجليزي)" },
    {
      key: "value",
      label: "القيمة",
      render: (item: Statistic) => (
        <span className="font-bold text-primary">{item.prefix}{item.value}{item.suffix}</span>
      ),
    },
    {
      key: "isActive",
      label: "الحالة",
      render: (item: Statistic) => (
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
            <h1 className="text-3xl font-bold text-primary">الإحصائيات</h1>
            <p className="text-foreground/70 mt-2">إدارة أرقام وإحصائيات الشركة</p>
          </div>
          <Button onClick={() => { setEditingItem(null); setFormData(defaultForm); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة إحصائية
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? "تعديل الإحصائية" : "إضافة إحصائية جديدة"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">التسمية (عربي)</label>
                <Input value={formData.labelAr} onChange={(e) => setFormData({ ...formData, labelAr: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">التسمية (إنجليزي)</label>
                <Input value={formData.labelEn} onChange={(e) => setFormData({ ...formData, labelEn: e.target.value })} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">القيمة الرقمية</label>
              <Input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">البادئة (مثال: +)</label>
                <Input value={formData.prefix} onChange={(e) => setFormData({ ...formData, prefix: e.target.value })} placeholder="+" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">اللاحقة (مثال: %)</label>
                <Input value={formData.suffix} onChange={(e) => setFormData({ ...formData, suffix: e.target.value })} placeholder="%" />
              </div>
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
