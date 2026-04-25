import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.adminLogin.useMutation({
    onSuccess: () => {
      // Redirect to admin panel after successful login
      window.location.href = "/admin";
    },
    onError: (err) => {
      setError(language === "ar" ? "اسم المستخدم أو كلمة المرور غير صحيحة" : "Invalid username or password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError(language === "ar" ? "يرجى إدخال اسم المستخدم وكلمة المرور" : "Please enter username and password");
      return;
    }
    loginMutation.mutate({ username: username.trim(), password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a3a5c 0%, #0d2035 50%, #1a3a5c 100%)",
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #c9a227, transparent)" }} />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #c9a227, transparent)" }} />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <a href="/">
            <img src="/logo-new.png" alt="Mareb Insurance" className="h-20 w-auto object-contain rounded-lg shadow-lg" />
          </a>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1a3a5c, #0d2035)" }}>
                <Lock className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              {language === "ar" ? "تسجيل الدخول" : "Admin Login"}
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              {language === "ar" ? "لوحة إدارة شركة مأرب للتأمين" : "Mareb Insurance Admin Panel"}
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5" dir={language === "ar" ? "rtl" : "ltr"}>
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  {language === "ar" ? "اسم المستخدم" : "Username"}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" style={language === "ar" ? { left: "auto", right: "12px" } : {}} />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={language === "ar" ? "أدخل اسم المستخدم" : "Enter username"}
                    className="pl-10 h-11 border-gray-200 focus:border-primary"
                    style={language === "ar" ? { paddingLeft: "12px", paddingRight: "40px" } : {}}
                    autoComplete="username"
                    disabled={loginMutation.isPending}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {language === "ar" ? "كلمة المرور" : "Password"}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" style={language === "ar" ? { left: "auto", right: "12px" } : {}} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter password"}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-primary"
                    style={language === "ar" ? { paddingLeft: "40px", paddingRight: "40px" } : {}}
                    autoComplete="current-password"
                    disabled={loginMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    style={language === "ar" ? { right: "auto", left: "12px" } : {}}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                style={{ background: "linear-gradient(135deg, #1a3a5c, #0d2035)" }}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending
                  ? (language === "ar" ? "جاري تسجيل الدخول..." : "Signing in...")
                  : (language === "ar" ? "دخول" : "Sign In")}
              </Button>

              {/* Back to site */}
              <div className="text-center">
                <a
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {language === "ar" ? "← العودة إلى الموقع" : "← Back to website"}
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/50 text-xs mt-6">
          {language === "ar" ? "شركة مأرب للتأمين - جميع الحقوق محفوظة" : "Mareb Insurance Co. - All rights reserved"}
        </p>
      </div>
    </div>
  );
}
