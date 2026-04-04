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
import type { AboutContent } from "../../../../drizzle/schema";

const defaultForm = {
  titleAr: "",
  titleEn: "",
  contentAr: "",
  contentEn: "",
  imageUrl: "",
  section: "main",
};

export default function AboutContentPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AboutContent | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const { data: items, isLoading, refetch } = trpc.admin.about.list.useQuery();
  const createMutation = trpc.admin.about.create.useMutation();
  const updateMutation = trpc.admin.about.update.useMutation();
  const deleteMutation = trpc.admin.about.delete.useMutation();

  const handleEdit = (item: AboutContent) => {
    setEditingItem(item);
    setFormData({
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      contentAr: item.contentAr,
      contentEn: item.contentEn,
      imageUrl: item.imageUrl || "",
      section: item.section,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: AboutContent) => {
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
    { key: "section", label: "القسم" },
    { key: "titleAr", label: "العنوان (عربي)" },
    { key: "titleEn", label: "العنوان (إنجليزي)" },
    {
      key: "imageUrl",
      label: "الصورة",
      render: (item: AboutContent) => item.imageUrl ? (
        <img src={item.imageUrl} alt="Preview" className="h-12 w-20 object-cover rounded" />
      ) : <span className="text-gray-400">—</span>,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">محتوى من نحن</h1>
            <p className="text-foreground/70 mt-2">إدارة محتوى صفحة "من نحن"</p>
          </div>
          <Button onClick={() => { setEditingItem(null); setFormData(defaultForm); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة محتوى
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
            <DialogTitle>{editingItem ? "تعديل المحتوى" : "إضافة محتوى جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">القسم</label>
              <Input value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} placeholder="main, vision, mission, goals..." required />
              <p className="text-xs text-gray-500 mt-1">أمثلة: main, vision, mission, goals, history</p>
            </div>

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
                <label className="block text-sm font-medium mb-2">المحتوى (عربي)</label>
                <Textarea value={formData.contentAr} onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })} rows={6} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المحتوى (إنجليزي)</label>
                <Textarea value={formData.contentEn} onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })} rows={6} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">رابط الصورة</label>
              <Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
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
