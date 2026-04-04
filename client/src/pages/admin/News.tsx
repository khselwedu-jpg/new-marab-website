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
import type { News } from "../../../../drizzle/schema";
import { ImageUpload } from "@/components/admin/ImageUpload";

const today = new Date().toISOString().split("T")[0];

const defaultForm = {
  titleAr: "",
  titleEn: "",
  summaryAr: "",
  summaryEn: "",
  contentAr: "",
  contentEn: "",
  imageUrl: "",
  category: "news" as "news" | "event" | "announcement",
  publishDate: today,
  isActive: true,
};

export default function NewsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<News | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const { data: items, isLoading, refetch } = trpc.admin.news.list.useQuery();
  const createMutation = trpc.admin.news.create.useMutation();
  const updateMutation = trpc.admin.news.update.useMutation();
  const deleteMutation = trpc.admin.news.delete.useMutation();

  const handleEdit = (item: News) => {
    setEditingItem(item);
    setFormData({
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      summaryAr: item.summaryAr,
      summaryEn: item.summaryEn,
      contentAr: item.contentAr || "",
      contentEn: item.contentEn || "",
      imageUrl: item.imageUrl,
      category: item.category,
      publishDate: new Date(item.publishDate).toISOString().split("T")[0],
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: News) => {
    if (!confirm("هل أنت متأكد من حذف هذا الخبر؟")) return;
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
      const data = { ...formData, publishDate: formData.publishDate };
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, ...data });
        toast.success("تم التحديث بنجاح");
      } else {
        await createMutation.mutateAsync(data);
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
    news: "خبر",
    event: "فعالية",
    announcement: "إعلان",
  };

  const columns = [
    { key: "titleAr", label: "العنوان (عربي)" },
    { key: "titleEn", label: "العنوان (إنجليزي)" },
    {
      key: "imageUrl",
      label: "الصورة",
      render: (item: News) => (
        <img src={item.imageUrl} alt="Preview" className="h-12 w-20 object-cover rounded" />
      ),
    },
    {
      key: "category",
      label: "الفئة",
      render: (item: News) => (
        <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">{categoryLabels[item.category]}</span>
      ),
    },
    {
      key: "publishDate",
      label: "تاريخ النشر",
      render: (item: News) => new Date(item.publishDate).toLocaleDateString("ar"),
    },
    {
      key: "isActive",
      label: "الحالة",
      render: (item: News) => (
        <span className={`px-2 py-1 rounded text-xs ${item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
          {item.isActive ? "منشور" : "مخفي"}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">الأخبار والفعاليات</h1>
            <p className="text-foreground/70 mt-2">إدارة أخبار وفعاليات الشركة</p>
          </div>
          <Button onClick={() => { setEditingItem(null); setFormData(defaultForm); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة خبر
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "تعديل الخبر" : "إضافة خبر جديد"}</DialogTitle>
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
                <label className="block text-sm font-medium mb-2">الملخص (عربي)</label>
                <Textarea value={formData.summaryAr} onChange={(e) => setFormData({ ...formData, summaryAr: e.target.value })} rows={3} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الملخص (إنجليزي)</label>
                <Textarea value={formData.summaryEn} onChange={(e) => setFormData({ ...formData, summaryEn: e.target.value })} rows={3} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">المحتوى الكامل (عربي)</label>
                <Textarea value={formData.contentAr} onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })} rows={5} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المحتوى الكامل (إنجليزي)</label>
                <Textarea value={formData.contentEn} onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })} rows={5} />
              </div>
            </div>

            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              label="صورة الخبر"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الفئة</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full border border-input rounded-md px-3 py-2 text-sm"
                >
                  <option value="news">خبر</option>
                  <option value="event">فعالية</option>
                  <option value="announcement">إعلان</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ النشر</label>
                <Input type="date" value={formData.publishDate} onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })} required />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
              <label className="text-sm font-medium">منشور</label>
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
