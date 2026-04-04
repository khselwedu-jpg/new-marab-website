import { AdminLayout } from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";

interface SettingField {
  key: string;
  labelAr: string;
  labelEn: string;
  category: string;
  multiline?: boolean;
}

const settingsConfig: SettingField[] = [
  // Contact Info
  { key: "phone_main", labelAr: "الهاتف الرئيسي", labelEn: "Main Phone", category: "contact" },
  { key: "phone_secondary", labelAr: "الهاتف الثانوي", labelEn: "Secondary Phone", category: "contact" },
  { key: "email_main", labelAr: "البريد الإلكتروني الرئيسي", labelEn: "Main Email", category: "contact" },
  { key: "email_support", labelAr: "بريد الدعم", labelEn: "Support Email", category: "contact" },
  { key: "address_ar", labelAr: "العنوان (عربي)", labelEn: "Address (Arabic)", category: "contact", multiline: true },
  { key: "address_en", labelAr: "العنوان (إنجليزي)", labelEn: "Address (English)", category: "contact", multiline: true },
  // Social Media
  { key: "social_facebook", labelAr: "فيسبوك", labelEn: "Facebook URL", category: "social" },
  { key: "social_twitter", labelAr: "تويتر / X", labelEn: "Twitter/X URL", category: "social" },
  { key: "social_linkedin", labelAr: "لينكدإن", labelEn: "LinkedIn URL", category: "social" },
  { key: "social_youtube", labelAr: "يوتيوب", labelEn: "YouTube URL", category: "social" },
  { key: "social_instagram", labelAr: "إنستغرام", labelEn: "Instagram URL", category: "social" },
  // Company Info
  { key: "company_name_ar", labelAr: "اسم الشركة (عربي)", labelEn: "Company Name (Arabic)", category: "company" },
  { key: "company_name_en", labelAr: "اسم الشركة (إنجليزي)", labelEn: "Company Name (English)", category: "company" },
  { key: "company_slogan_ar", labelAr: "الشعار (عربي)", labelEn: "Slogan (Arabic)", category: "company" },
  { key: "company_slogan_en", labelAr: "الشعار (إنجليزي)", labelEn: "Slogan (English)", category: "company" },
  { key: "company_founded", labelAr: "سنة التأسيس", labelEn: "Founded Year", category: "company" },
  { key: "company_license", labelAr: "رقم الترخيص", labelEn: "License Number", category: "company" },
];

const categoryLabels: Record<string, string> = {
  contact: "معلومات التواصل",
  social: "وسائل التواصل الاجتماعي",
  company: "معلومات الشركة",
};

export default function SiteSettingsPage() {
  const { data: settingsData, isLoading, refetch } = trpc.admin.settings.list.useQuery();
  const upsertMutation = trpc.admin.settings.upsert.useMutation();

  // Local state for form values: key -> { valueAr, valueEn }
  const [formValues, setFormValues] = useState<Record<string, { valueAr: string; valueEn: string }>>({});

  useEffect(() => {
    if (settingsData) {
      const map: Record<string, { valueAr: string; valueEn: string }> = {};
      settingsData.forEach((s) => {
        map[s.key] = { valueAr: s.valueAr || "", valueEn: s.valueEn || "" };
      });
      setFormValues(map);
    }
  }, [settingsData]);

  const getValue = (key: string, lang: "ar" | "en") => {
    return formValues[key]?.[lang === "ar" ? "valueAr" : "valueEn"] || "";
  };

  const setValue = (key: string, lang: "ar" | "en", val: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang === "ar" ? "valueAr" : "valueEn"]: val,
      },
    }));
  };

  const handleSave = async (category: string) => {
    const categoryFields = settingsConfig.filter((f) => f.category === category);
    const items = categoryFields.map((f) => ({
      key: f.key,
      valueAr: formValues[f.key]?.valueAr || "",
      valueEn: formValues[f.key]?.valueEn || "",
      category: f.category,
    }));
    try {
      await upsertMutation.mutateAsync(items);
      toast.success("تم حفظ الإعدادات بنجاح");
      refetch();
    } catch {
      toast.error("فشل حفظ الإعدادات");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const categories = Array.from(new Set(settingsConfig.map((f) => f.category)));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">إعدادات الموقع</h1>
          <p className="text-foreground/70 mt-2">إدارة معلومات الشركة والتواصل ووسائل التواصل الاجتماعي</p>
        </div>

        {categories.map((category) => (
          <Card key={category} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">{categoryLabels[category]}</h2>
              <Button
                onClick={() => handleSave(category)}
                disabled={upsertMutation.isPending}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {upsertMutation.isPending ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </div>

            <div className="space-y-4">
              {settingsConfig.filter((f) => f.category === category).map((field) => (
                <div key={field.key} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{field.labelAr} (عربي)</label>
                    {field.multiline ? (
                      <Textarea
                        value={getValue(field.key, "ar")}
                        onChange={(e) => setValue(field.key, "ar", e.target.value)}
                        rows={2}
                        dir="rtl"
                      />
                    ) : (
                      <Input
                        value={getValue(field.key, "ar")}
                        onChange={(e) => setValue(field.key, "ar", e.target.value)}
                        dir="rtl"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{field.labelEn} (English)</label>
                    {field.multiline ? (
                      <Textarea
                        value={getValue(field.key, "en")}
                        onChange={(e) => setValue(field.key, "en", e.target.value)}
                        rows={2}
                      />
                    ) : (
                      <Input
                        value={getValue(field.key, "en")}
                        onChange={(e) => setValue(field.key, "en", e.target.value)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
