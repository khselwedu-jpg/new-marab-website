import { AdminLayout } from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { DataTable } from "@/components/admin/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import type { ContactSubmission } from "../../../../drizzle/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactMessagesPage() {
  const [viewingMessage, setViewingMessage] = useState<ContactSubmission | null>(null);
  const { data: messages, isLoading, refetch } = trpc.admin.contacts.list.useQuery();
  const updateStatusMutation = trpc.admin.contacts.updateStatus.useMutation();
  const deleteMutation = trpc.admin.contacts.delete.useMutation();

  const handleView = async (message: ContactSubmission) => {
    setViewingMessage(message);
    if (message.status === "new") {
      try {
        await updateStatusMutation.mutateAsync({ id: message.id, status: "read" });
        refetch();
      } catch (error) {
        console.error("Failed to update status");
      }
    }
  };

  const handleDelete = async (message: ContactSubmission) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    
    try {
      await deleteMutation.mutateAsync({ id: message.id });
      toast.success("تم حذف الرسالة بنجاح");
      refetch();
    } catch (error) {
      toast.error("فشل في حذف الرسالة");
    }
  };

  const statusLabels: Record<string, string> = {
    new: "جديدة",
    read: "مقروءة",
    replied: "تم الرد",
    archived: "مؤرشفة",
  };

  const columns = [
    {
      key: "createdAt",
      label: "التاريخ",
      render: (msg: ContactSubmission) => new Date(msg.createdAt).toLocaleDateString("ar"),
    },
    { key: "name", label: "الاسم" },
    { key: "email", label: "البريد الإلكتروني" },
    { key: "phone", label: "الهاتف" },
    { key: "subject", label: "الموضوع" },
    {
      key: "messageType",
      label: "النوع",
      render: (msg: ContactSubmission) => (
        <Badge variant="outline">{msg.messageType}</Badge>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (msg: ContactSubmission) => {
        const colors: Record<string, string> = {
          new: "bg-blue-100 text-blue-800",
          read: "bg-gray-100 text-gray-800",
          replied: "bg-green-100 text-green-800",
          archived: "bg-yellow-100 text-yellow-800",
        };
        return (
          <span className={`px-2 py-1 rounded text-xs ${colors[msg.status]}`}>
            {statusLabels[msg.status] || msg.status}
          </span>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <div>
          <h1 className="text-3xl font-bold text-primary">رسائل التواصل</h1>
          <p className="text-foreground/70 mt-2">عرض وإدارة رسائل نموذج التواصل</p>
        </div>

        <DataTable
          data={messages || []}
          columns={columns}
          onView={handleView}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      <Dialog open={!!viewingMessage} onOpenChange={() => setViewingMessage(null)}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الرسالة</DialogTitle>
          </DialogHeader>
          {viewingMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/70">الاسم</label>
                  <p className="text-foreground">{viewingMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/70">البريد الإلكتروني</label>
                  <p className="text-foreground">{viewingMessage.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/70">الهاتف</label>
                  <p className="text-foreground">{viewingMessage.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/70">نوع الرسالة</label>
                  <p className="text-foreground">{viewingMessage.messageType}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/70">الموضوع</label>
                <p className="text-foreground">{viewingMessage.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/70">الرسالة</label>
                <p className="text-foreground whitespace-pre-wrap bg-muted p-4 rounded-lg">
                  {viewingMessage.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/70">تاريخ الاستلام</label>
                <p className="text-foreground">
                  {new Date(viewingMessage.createdAt).toLocaleString("ar")}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={async () => {
                    await updateStatusMutation.mutateAsync({
                      id: viewingMessage.id,
                      status: "replied",
                    });
                    toast.success("تم تحديد الرسالة كمردود عليها");
                    setViewingMessage(null);
                    refetch();
                  }}
                  disabled={viewingMessage.status === "replied"}
                >
                  تحديد كمردود عليه
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await updateStatusMutation.mutateAsync({
                      id: viewingMessage.id,
                      status: "archived",
                    });
                    toast.success("تم الأرشفة");
                    setViewingMessage(null);
                    refetch();
                  }}
                >
                  أرشفة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
