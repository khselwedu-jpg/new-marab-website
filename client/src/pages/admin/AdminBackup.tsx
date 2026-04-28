import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, Database, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function AdminBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);

  const exportQuery = trpc.admin.backup.export.useQuery(undefined, {
    enabled: false,
    retry: false,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportQuery.refetch();
      if (result.data) {
        const jsonStr = JSON.stringify(result.data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const date = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `mareb-backup-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setLastExport(new Date().toLocaleString("ar-YE"));
        toast.success("تم تصدير النسخة الاحتياطية بنجاح");
      }
    } catch (err: any) {
      toast.error(err?.message || "فشل تصدير البيانات");
    } finally {
      setIsExporting(false);
    }
  };

  const tables = [
    { key: "heroSlides", label: "الشرائح الرئيسية" },
    { key: "insuranceTypes", label: "أنواع التأمين" },
    { key: "statistics", label: "الإحصائيات" },
    { key: "partners", label: "الشركاء والمساهمون" },
    { key: "branches", label: "الفروع" },
    { key: "news", label: "الأخبار" },
    { key: "contactSubmissions", label: "رسائل التواصل" },
    { key: "whyUsFeatures", label: "لماذا نحن" },
    { key: "aboutContent", label: "محتوى من نحن" },
    { key: "siteSettings", label: "إعدادات الموقع" },
    { key: "dynamicPages", label: "الصفحات الديناميكية" },
    { key: "teamMembers", label: "أعضاء الفريق" },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0A1F3D]">النسخ الاحتياطي</h1>
        <p className="text-gray-500 mt-1">تصدير جميع بيانات الموقع كملف JSON</p>
      </div>

      <Card className="border border-gray-200 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0A1F3D]/10 flex items-center justify-center">
              <Database className="w-6 h-6 text-[#0A1F3D]" />
            </div>
            <div>
              <CardTitle className="text-lg">تصدير قاعدة البيانات</CardTitle>
              <CardDescription>تنزيل نسخة احتياطية كاملة من بيانات الموقع</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-3">يشمل التصدير البيانات التالية:</p>
            <div className="grid grid-cols-2 gap-2">
              {tables.map((t) => (
                <div key={t.key} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {lastExport && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 mb-4">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              آخر تصدير: {lastExport}
            </div>
          )}

          <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>يُنصح بأخذ نسخة احتياطية دورية وحفظها في مكان آمن. الملف المُصدَّر بصيغة JSON ويمكن استخدامه لاستعادة البيانات عند الحاجة.</span>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-[#0A1F3D] hover:bg-[#0A1F3D]/90 text-white gap-2"
            size="lg"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري التصدير...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                تنزيل النسخة الاحتياطية
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">ملاحظات مهمة</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>• الملف المُصدَّر يحتوي على جميع البيانات المدخلة في لوحة التحكم.</p>
          <p>• لا يشمل التصدير كلمات المرور أو بيانات المستخدمين الحساسة.</p>
          <p>• احتفظ بالنسخة الاحتياطية في مكان آمن بعيداً عن متناول الآخرين.</p>
          <p>• يُنصح بأخذ نسخة احتياطية قبل إجراء أي تغييرات كبيرة على بيانات الموقع.</p>
        </CardContent>
      </Card>
    </div>
  );
}
