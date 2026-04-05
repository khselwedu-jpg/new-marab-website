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
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

const PAGE_SLUGS = [
  { slug: "about/chairman", labelAr: "رئيس مجلس الإدارة", labelEn: "Chairman" },
  { slug: "about/vision", labelAr: "الرؤية", labelEn: "Vision" },
  { slug: "about/mission", labelAr: "الرسالة", labelEn: "Mission" },
  { slug: "about/goals", labelAr: "الأهداف", labelEn: "Goals" },
  { slug: "about/structure", labelAr: "الهيكل التنظيمي", labelEn: "Org Structure" },
  { slug: "about/privacy", labelAr: "سياسة الخصوصية", labelEn: "Privacy Policy" },
  { slug: "about/cookies", labelAr: "سياسة ملفات تعريف الارتباط", labelEn: "Cookie Policy" },
  { slug: "partners/success", labelAr: "قصص النجاح", labelEn: "Success Stories" },
  { slug: "media/news", labelAr: "الأخبار (وسائل الإعلام)", labelEn: "Media News" },
];

const emptyForm = {
  slug: "",
  titleAr: "",
  titleEn: "",
  contentAr: "",
  contentEn: "",
  imageUrl: "",
  metaDescriptionAr: "",
  metaDescriptionEn: "",
  isActive: true,
};

export default function DynamicPagesAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const utils = trpc.useUtils();
  const { data: pages, isLoading } = trpc.admin.pages.list.useQuery();

  const upsertMutation = trpc.admin.pages.upsert.useMutation({
    onSuccess: () => {
      toast.success("تم حفظ الصفحة بنجاح");
      utils.admin.pages.list.invalidate();
      setIsDialogOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.admin.pages.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف الصفحة");
      utils.admin.pages.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const openCreate = (slug?: string) => {
    const preset = PAGE_SLUGS.find((p) => p.slug === slug);
    setForm({
      ...emptyForm,
      slug: slug || "",
      titleAr: preset?.labelAr || "",
      titleEn: preset?.labelEn || "",
    });
    setEditingSlug(null);
    setIsDialogOpen(true);
  };

  const openEdit = (page: any) => {
    setForm({
      slug: page.slug,
      titleAr: page.titleAr,
      titleEn: page.titleEn,
      contentAr: page.contentAr || "",
      contentEn: page.contentEn || "",
      imageUrl: page.imageUrl || "",
      metaDescriptionAr: page.metaDescriptionAr || "",
      metaDescriptionEn: page.metaDescriptionEn || "",
      isActive: page.isActive,
    });
    setEditingSlug(page.slug);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.slug || !form.titleAr) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }
    upsertMutation.mutate(form);
  };

  const existingSlugs = new Set(pages?.map((p) => p.slug) || []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">إدارة صفحات التنقل</h1>
            <p className="text-muted-foreground text-sm mt-1">أضف محتوى لصفحات القائمة الرئيسية</p>
          </div>
          <Button onClick={() => openCreate()}>
            <Plus className="w-4 h-4 ml-2" />
            صفحة جديدة
          </Button>
        </div>

        {/* Quick add buttons for predefined slugs */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium text-foreground mb-3">الصفحات المحددة مسبقاً (اضغط لإضافة محتوى):</p>
          <div className="flex flex-wrap gap-2">
            {PAGE_SLUGS.map((p) => (
              <Button
                key={p.slug}
                variant={existingSlugs.has(p.slug) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const existing = pages?.find((pg) => pg.slug === p.slug);
                  if (existing) openEdit(existing);
                  else openCreate(p.slug);
                }}
              >
                {existingSlugs.has(p.slug) ? "✓ " : "+ "}
                {p.labelAr}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>
        ) : !pages || pages.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد صفحات بعد. اضغط على أحد الأزرار أعلاه لإضافة محتوى.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المسار (Slug)</TableHead>
                <TableHead className="text-right">العنوان بالعربي</TableHead>
                <TableHead className="text-right">العنوان بالإنجليزي</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-mono text-sm text-muted-foreground">{page.slug}</TableCell>
                  <TableCell className="font-medium">{page.titleAr}</TableCell>
                  <TableCell>{page.titleEn}</TableCell>
                  <TableCell>
                    <Badge variant={page.isActive ? "default" : "secondary"}>
                      {page.isActive ? "نشط" : "مخفي"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(page)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteMutation.mutate({ id: page.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSlug ? "تعديل الصفحة" : "إضافة صفحة جديدة"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>المسار (Slug) *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="about/chairman"
                  disabled={!!editingSlug}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">مثال: about/chairman أو partners/success</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>العنوان بالعربي *</Label>
                  <Input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
                </div>
                <div>
                  <Label>العنوان بالإنجليزي</Label>
                  <Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>المحتوى بالعربي</Label>
                <Textarea
                  value={form.contentAr}
                  onChange={(e) => setForm({ ...form, contentAr: e.target.value })}
                  rows={8}
                  placeholder="أدخل محتوى الصفحة بالعربي..."
                />
              </div>
              <div>
                <Label>المحتوى بالإنجليزي</Label>
                <Textarea
                  value={form.contentEn}
                  onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
                  rows={8}
                  placeholder="Enter page content in English..."
                />
              </div>
              <div>
                <Label>صورة الغلاف</Label>
                <ImageUpload
                  value={form.imageUrl}
                  onChange={(url: string) => setForm({ ...form, imageUrl: url })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>وصف SEO بالعربي</Label>
                  <Textarea
                    value={form.metaDescriptionAr}
                    onChange={(e) => setForm({ ...form, metaDescriptionAr: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>وصف SEO بالإنجليزي</Label>
                  <Textarea
                    value={form.metaDescriptionEn}
                    onChange={(e) => setForm({ ...form, metaDescriptionEn: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
                <Label>نشط (مرئي للزوار)</Label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                <Button onClick={handleSubmit} disabled={upsertMutation.isPending}>
                  {upsertMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
