import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Image, 
  FileText, 
  TrendingUp, 
  Users, 
  MapPin, 
  Newspaper,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  UserSquare2,
  Camera,
  UserCog,
  HardDriveDownload,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not admin
  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-primary">غير مصرح</h1>
          <p className="text-foreground/70">ليس لديك صلاحية الوصول إلى لوحة التحكم.</p>
          <Link href="/">
            <Button>الذهاب للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin" },
    { icon: Image, label: "الشرائح الرئيسية", href: "/admin/hero-slides" },
    { icon: FileText, label: "محتوى من نحن", href: "/admin/about" },
    { icon: ShieldCheck, label: "لماذا نحن", href: "/admin/why-us" },
    { icon: FileText, label: "أنواع التأمين", href: "/admin/insurance" },
    { icon: TrendingUp, label: "الإحصائيات", href: "/admin/statistics" },
    { icon: Users, label: "الشركاء والمساهمون", href: "/admin/partners" },
    { icon: MapPin, label: "الفروع", href: "/admin/branches" },
    { icon: Newspaper, label: "الأخبار والفعاليات", href: "/admin/news" },
    { icon: Mail, label: "رسائل التواصل", href: "/admin/contacts" },
    { icon: BookOpen, label: "الصفحات", href: "/admin/pages" },
    { icon: UserSquare2, label: "أعضاء الفريق", href: "/admin/team" },
    { icon: Camera, label: "المعرض الإعلامي", href: "/admin/media" },
    { icon: Settings, label: "إعدادات الموقع", href: "/admin/settings" },
    { icon: UserCog, label: "إدارة المستخدمين", href: "/admin/users" },
    { icon: HardDriveDownload, label: "النسخ الاحتياطي", href: "/admin/backup" },
  ];

  return (
    <div className="min-h-screen bg-muted" dir="rtl">
      {/* Top Navigation */}
      <header className="bg-primary text-white h-16 fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <img src="/logo-new.png" alt="مأرب للتأمين" className="h-12 w-auto" />
            <h1 className="text-xl font-bold hidden md:block">لوحة التحكم</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:inline">{user?.name || user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="text-white hover:bg-white/10 gap-2"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 right-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pr-64 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
