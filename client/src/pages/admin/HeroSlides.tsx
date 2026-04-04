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
    if (!confirm("Are you sure you want to delete this slide?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id: slide.id });
      toast.success("Slide deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete slide");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSlide) {
        await updateMutation.mutateAsync({ id: editingSlide.id, ...formData });
        toast.success("Slide updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Slide created successfully");
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
      toast.error("Failed to save slide");
    }
  };

  const columns = [
    { key: "displayOrder", label: "Order" },
    { key: "titleAr", label: "Title (AR)" },
    { key: "titleEn", label: "Title (EN)" },
    {
      key: "imageUrl",
      label: "Image",
      render: (slide: HeroSlide) => (
        <img src={slide.imageUrl} alt="Preview" className="h-12 w-20 object-cover rounded" />
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (slide: HeroSlide) => (
        <span className={`px-2 py-1 rounded text-xs ${slide.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
          {slide.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Hero Slides</h1>
            <p className="text-foreground/70 mt-2">Manage homepage slider images and content</p>
          </div>
          <Button onClick={() => { setEditingSlide(null); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Slide
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSlide ? "Edit Slide" : "Add New Slide"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (Arabic)</label>
                <Input
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title (English)</label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle (Arabic)</label>
                <Textarea
                  value={formData.subtitleAr}
                  onChange={(e) => setFormData({ ...formData, subtitleAr: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle (English)</label>
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
                <label className="block text-sm font-medium mb-2">CTA Text (Arabic)</label>
                <Input
                  value={formData.ctaTextAr}
                  onChange={(e) => setFormData({ ...formData, ctaTextAr: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CTA Text (English)</label>
                <Input
                  value={formData.ctaTextEn}
                  onChange={(e) => setFormData({ ...formData, ctaTextEn: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">CTA Link</label>
              <Input
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                placeholder="/contact"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Display Order</label>
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
                <label className="text-sm font-medium">Active</label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
