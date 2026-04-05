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
  Camera
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
          <h1 className="text-2xl font-bold text-primary">Access Denied</h1>
          <p className="text-foreground/70">You don't have permission to access the admin panel.</p>
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Image, label: "Hero Slides", href: "/admin/hero-slides" },
    { icon: FileText, label: "About Content", href: "/admin/about" },
    { icon: FileText, label: "Why Us Features", href: "/admin/why-us" },
    { icon: FileText, label: "Insurance Types", href: "/admin/insurance" },
    { icon: TrendingUp, label: "Statistics", href: "/admin/statistics" },
    { icon: Users, label: "Partners", href: "/admin/partners" },
    { icon: MapPin, label: "Branches", href: "/admin/branches" },
    { icon: Newspaper, label: "News & Events", href: "/admin/news" },
    { icon: Mail, label: "Contact Messages", href: "/admin/contacts" },
    { icon: BookOpen, label: "Pages", href: "/admin/pages" },
    { icon: UserSquare2, label: "Team Members", href: "/admin/team" },
    { icon: Camera, label: "Media Gallery", href: "/admin/media" },
    { icon: Settings, label: "Site Settings", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-muted">
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
            <img src="/logo.jpg" alt="Mareb Insurance" className="h-12 w-auto" />
            <h1 className="text-xl font-bold hidden md:block">Admin Control Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:inline">{user?.name || user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
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
