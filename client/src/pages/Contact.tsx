import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    messageType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.messageType || !formData.message) {
      toast.error(t("contact.error"));
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(t("contact.success"));
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      messageType: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div>
      {/* Page Header */}
      <section className="relative h-64 bg-primary flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <div className="relative container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("contact.title")}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <span>{t("nav.home")}</span>
            <span>/</span>
            <span className="text-secondary">{t("nav.contact")}</span>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-4">
                  {t("contact.title")}
                </h2>
                <p className="text-foreground/70">
                  {t("nav.home") === "الرئيسية" 
                    ? "نحن هنا للإجابة على استفساراتكم وتقديم أفضل الخدمات التأمينية"
                    : "We are here to answer your inquiries and provide the best insurance services"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.name")} *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.email")} *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.phone")} *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.subject")} *
                  </label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.messageType")} *
                  </label>
                  <Select
                    value={formData.messageType}
                    onValueChange={(value) => setFormData({ ...formData, messageType: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("contact.messageType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inquiry">
                        {t("nav.home") === "الرئيسية" ? "استفسار" : "Inquiry"}
                      </SelectItem>
                      <SelectItem value="quote">
                        {t("nav.home") === "الرئيسية" ? "طلب عرض سعر" : "Quote Request"}
                      </SelectItem>
                      <SelectItem value="complaint">
                        {t("nav.home") === "الرئيسية" ? "شكوى" : "Complaint"}
                      </SelectItem>
                      <SelectItem value="suggestion">
                        {t("nav.home") === "الرئيسية" ? "اقتراح" : "Suggestion"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.message")} *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-secondary text-primary hover:bg-secondary/90"
                >
                  {isSubmitting ? (
                    <span>{t("nav.home") === "الرئيسية" ? "جاري الإرسال..." : "Sending..."}</span>
                  ) : (
                    t("contact.send")
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info & Map */}
            <div className="space-y-6">
              <div className="bg-muted rounded-lg p-8 space-y-6">
                <h3 className="text-2xl font-bold text-primary mb-6">
                  {t("footer.contactInfo")}
                </h3>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">{t("footer.phone")}</h4>
                    <a href="tel:+9671234567" className="text-foreground/70 hover:text-secondary">
                      +967 1 234 567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">{t("footer.email")}</h4>
                    <a href="mailto:info@marebinsurance.com" className="text-foreground/70 hover:text-secondary">
                      info@marebinsurance.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">{t("footer.address")}</h4>
                    <p className="text-foreground/70">
                      {t("nav.home") === "الرئيسية" 
                        ? "شارع الزبيري، صنعاء، اليمن"
                        : "Al-Zubairi Street, Sana'a, Yemen"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61726.89283253516!2d44.17616!3d15.35472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1603dbb0e6c7e5a5%3A0x8e7c3e5e5e5e5e5e!2sSana&#39;a%2C%20Yemen!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mareb Insurance Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
