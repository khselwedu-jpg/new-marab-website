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
import type { HeroSlide } from "../../../../drizzle/schema";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function HeroSlidesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  
  const { data: slides, isLoading, refetch } = trpc.admin.heroSlides.list.useQuery();
  const createMutation = trpc.admin.heroSlides.create.useMutation();
  const updateMutation = trpc.admin.heroSlides.update.useMutation();
  const deleteMutation = trpc.admin.heroSlides.delete.useMutation();

  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    subtitleAr: "",
    subtitleEn: "",
    imageUrl: "",
    ctaTextAr: "",
    ctaTextEn: "",
    ctaLink: "",
    displayOrder: 0,
    isActive: true,
  });

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      titleAr: slide.titleAr,
      titleEn: slide.titleEn,
      subtitleAr: slide.subtitleAr || "",
      subtitleEn: slide.subtitleEn || "",
      imageUrl: slide.imageUrl,
      ctaTextAr: slide.ctaTextAr || "",
      ctaTextEn: slide.ctaTextEn || "",
      ctaLink: slide.ctaLink || "",
      displayOrder: slide.displayOrder,
      isActive: slide.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (slide: HeroSlide) => {
    if (!confirm("هل أنت متأكد من حذف هذه الشريحة؟")) return;
    
    try {
      await deleteMutation.mutateAsync({ id: slide.id });
      toast.success("تم حذف الشريحة بنجاح");
      refetch();
    } catch (error) {
      toast.error("فشل في حذف الشريحة");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSlide) {
        await updateMutation.mutateAsync({ id: editingSlide.id, ...formData });
        toast.success("تم تحديث الشريحة بنجاح");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("تم إنشاء الشريحة بنجاح");
      }
      
      setIsDialogOpen(false);
      setEditingSlide(null);
      setFormData({
        titleAr: "",
        titleEn: "",
        subtitleAr: "",
        subtitleEn: "",
        imageUrl: "",
        ctaTextAr: "",
        ctaTextEn: "",
        ctaLink: "",
        displayOrder: 0,
        isActive: true,
      });
      refetch();
    } catch (error) {
      toast.error("فشل في حفظ الشريحة");
    }
  };

  const columns = [
    { key: "displayOrder", label: "الترتيب" },
    { key: "titleAr", label: "العنوان (عربي)" },
    { key: "titleEn", label: "العنوان (إنجليزي)" },
    {
      key: "imageUrl",
      label: "الصورة",
      render: (slide: HeroSlide) => (
        <img src={slide.imageUrl} alt="معاينة" className="h-12 w-20 object-cover rounded" />
      ),
    },
    {
      key: "isActive",
      label: "الحالة",
      render: (slide: HeroSlide) => (
        <span className={`px-2 py-1 rounded text-xs ${slide.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
          {slide.isActive ? "مفعّل" : "معطّل"}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">الشرائح الرئيسية</h1>
            <p className="text-foreground/70 mt-2">إدارة صور وعناوين شرائح الصفحة الرئيسية</p>
          </div>
          <Button onClick={() => { setEditingSlide(null); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة شريحة
          </Button>
        </div>

        <DataTable
          data={slides || []}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingSlide ? "تعديل الشريحة" : "إضافة شريحة جديدة"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">العنوان (عربي)</label>
                <Input
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">العنوان (إنجليزي)</label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">العنوان الفرعي (عربي)</label>
                <Textarea
                  value={formData.subtitleAr}
                  onChange={(e) => setFormData({ ...formData, subtitleAr: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">العنوان الفرعي (إنجليزي)</label>
                <Textarea
                  value={formData.subtitleEn}
                  onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              label="صورة الشريحة"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نص زر الإجراء (عربي)</label>
                <Input
                  value={formData.ctaTextAr}
                  onChange={(e) => setFormData({ ...formData, ctaTextAr: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نص زر الإجراء (إنجليزي)</label>
                <Input
                  value={formData.ctaTextEn}
                  onChange={(e) => setFormData({ ...formData, ctaTextEn: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">رابط الزر</label>
              <Input
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                placeholder="/contact"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">ترتيب العرض</label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">مفعّل</label>
              </div>
            </div>

            <div className="flex justify-start gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
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
