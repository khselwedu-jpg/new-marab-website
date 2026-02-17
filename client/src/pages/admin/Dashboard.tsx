import { AdminLayout } from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { 
  Image, 
  FileText, 
  TrendingUp, 
  Users, 
  MapPin, 
  Newspaper,
  Mail
} from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = trpc.admin.getDashboardStats.useQuery();

  const statCards = [
    { icon: Image, label: "Hero Slides", value: stats?.heroSlides || 0, color: "bg-blue-500" },
    { icon: FileText, label: "Insurance Types", value: stats?.insuranceTypes || 0, color: "bg-green-500" },
    { icon: Users, label: "Partners", value: stats?.partners || 0, color: "bg-purple-500" },
    { icon: MapPin, label: "Branches", value: stats?.branches || 0, color: "bg-orange-500" },
    { icon: Newspaper, label: "News Articles", value: stats?.news || 0, color: "bg-red-500" },
    { icon: Mail, label: "Contact Messages", value: stats?.contactSubmissions || 0, color: "bg-yellow-500" },
    { icon: TrendingUp, label: "Statistics", value: stats?.statistics || 0, color: "bg-indigo-500" },
    { icon: FileText, label: "Why Us Features", value: stats?.whyUsFeatures || 0, color: "bg-pink-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-foreground/70 mt-2">Welcome to the Mareb Insurance admin control panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/70 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/hero-slides"
              className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Image className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold">Manage Hero Slides</h3>
              <p className="text-sm text-foreground/70">Add or edit homepage slider</p>
            </a>
            <a
              href="/admin/news"
              className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Newspaper className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold">Add News Article</h3>
              <p className="text-sm text-foreground/70">Publish latest news and events</p>
            </a>
            <a
              href="/admin/contacts"
              className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Mail className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold">View Messages</h3>
              <p className="text-sm text-foreground/70">Check contact form submissions</p>
            </a>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
