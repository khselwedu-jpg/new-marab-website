import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Camera } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

const MEDIA_TYPES = [
  { value: "photo", labelAr: "صور" },
  { value: "video", labelAr: "فيديوهات" },
  { value: "conference", labelAr: "مؤتمرات" },
  { value: "event", labelAr: "فعاليات" },
];

const emptyForm = {
  mediaType: "photo" as "photo" | "video" | "conference" | "event",
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  mediaUrl: "",
  thumbnailUrl: "",
  displayOrder: 0,
  isActive: true,
};

export default function MediaItemsAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [form, setForm] = useState(emptyForm);

  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.admin.media.list.useQuery();

  const createMutation = trpc.admin.media.create.useMutation({
    onSuccess: () => { toast.success("تم الإضافة"); utils.admin.media.list.invalidate(); setIsDialogOpen(false); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.admin.media.update.useMutation({
    onSuccess: () => { toast.success("تم التحديث"); utils.admin.media.list.invalidate(); setIsDialogOpen(false); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.admin.media.delete.useMutation({
    onSuccess: () => { toast.success("تم الحذف"); utils.admin.media.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setIsDialogOpen(true); };
  const openEdit = (item: any) => {
    setForm({
      mediaType: item.mediaType,
      titleAr: item.titleAr,
      titleEn: item.titleEn || "",
      descriptionAr: item.descriptionAr || "",
      descriptionEn: item.descriptionEn || "",
      mediaUrl: item.mediaUrl || "",
      thumbnailUrl: item.thumbnailUrl || "",
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setEditingId(item.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.titleAr) { toast.error("العنوان بالعربي مطلوب"); return; }
    if (editingId) updateMutation.mutate({ id: editingId, ...form });
    else createMutation.mutate(form);
  };

  const filteredItems = filterType === "all" ? items : items?.filter((i) => i.mediaType === filterType);
  const typeLabel = (t: string) => MEDIA_TYPES.find((m) => m.value === t)?.labelAr || t;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">معرض الوسائط</h1>
            <p className="text-muted-foreground text-sm mt-1">إدارة الصور والفيديوهات والمؤتمرات والفعاليات</p>
          </div>
          <Button onClick={openCreate}><Plus className="w-4 h-4 ml-2" />إضافة عنصر</Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button variant={filterType === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterType("all")}>الكل</Button>
          {MEDIA_TYPES.map((t) => (
            <Button key={t.value} variant={filterType === t.value ? "default" : "outline"} size="sm" onClick={() => setFilterType(t.value)}>{t.labelAr}</Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>
        ) : !filteredItems || filteredItems.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد عناصر بعد.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الصورة</TableHead>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الترتيب</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.thumbnailUrl
                      ? <img src={item.thumbnailUrl} alt={item.titleAr} className="w-12 h-10 rounded object-cover" />
                      : item.mediaUrl && item.mediaType === "photo"
                        ? <img src={item.mediaUrl} alt={item.titleAr} className="w-12 h-10 rounded object-cover" />
                        : <div className="w-12 h-10 rounded bg-muted flex items-center justify-center"><Camera className="w-5 h-5 text-muted-foreground" /></div>
                    }
                  </TableCell>
                  <TableCell className="font-medium">{item.titleAr}</TableCell>
                  <TableCell><Badge variant="outline">{typeLabel(item.mediaType)}</Badge></TableCell>
                  <TableCell>{item.displayOrder}</TableCell>
                  <TableCell><Badge variant={item.isActive ? "default" : "secondary"}>{item.isActive ? "نشط" : "مخفي"}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate({ id: item.id })}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? "تعديل عنصر" : "إضافة عنصر جديد"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>النوع *</Label>
                <Select value={form.mediaType} onValueChange={(v) => setForm({ ...form, mediaType: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MEDIA_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.labelAr}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>العنوان بالعربي *</Label><Input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} /></div>
                <div><Label>العنوان بالإنجليزي</Label><Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></div>
              </div>
              <div><Label>الوصف بالعربي</Label><Textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={3} /></div>
              <div><Label>الوصف بالإنجليزي</Label><Textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} rows={3} /></div>

              {form.mediaType === "photo" || form.mediaType === "conference" || form.mediaType === "event" ? (
                <div>
                  <Label>الصورة الرئيسية</Label>
                  <ImageUpload value={form.mediaUrl} onChange={(url: string) => setForm({ ...form, mediaUrl: url })} />
                </div>
              ) : (
                <div>
                  <Label>رابط الفيديو (YouTube أو غيره)</Label>
                  <Input value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
                </div>
              )}

              <div>
                <Label>صورة مصغرة (Thumbnail) - اختياري</Label>
                <ImageUpload value={form.thumbnailUrl} onChange={(url: string) => setForm({ ...form, thumbnailUrl: url })} />
              </div>

              <div><Label>الترتيب</Label><Input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} /><Label>نشط</Label></div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>{(createMutation.isPending || updateMutation.isPending) ? "جاري الحفظ..." : "حفظ"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
