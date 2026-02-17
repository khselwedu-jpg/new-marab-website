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
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id: message.id });
      toast.success("Message deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const columns = [
    {
      key: "createdAt",
      label: "Date",
      render: (msg: ContactSubmission) => new Date(msg.createdAt).toLocaleDateString(),
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "subject", label: "Subject" },
    {
      key: "messageType",
      label: "Type",
      render: (msg: ContactSubmission) => (
        <Badge variant="outline">{msg.messageType}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (msg: ContactSubmission) => {
        const colors = {
          new: "bg-blue-100 text-blue-800",
          read: "bg-gray-100 text-gray-800",
          replied: "bg-green-100 text-green-800",
          archived: "bg-yellow-100 text-yellow-800",
        };
        return (
          <span className={`px-2 py-1 rounded text-xs ${colors[msg.status]}`}>
            {msg.status}
          </span>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Contact Messages</h1>
          <p className="text-foreground/70 mt-2">View and manage contact form submissions</p>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {viewingMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/70">Name</label>
                  <p className="text-foreground">{viewingMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/70">Email</label>
                  <p className="text-foreground">{viewingMessage.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/70">Phone</label>
                  <p className="text-foreground">{viewingMessage.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/70">Type</label>
                  <p className="text-foreground">{viewingMessage.messageType}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/70">Subject</label>
                <p className="text-foreground">{viewingMessage.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/70">Message</label>
                <p className="text-foreground whitespace-pre-wrap bg-muted p-4 rounded-lg">
                  {viewingMessage.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/70">Received</label>
                <p className="text-foreground">
                  {new Date(viewingMessage.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={async () => {
                    await updateStatusMutation.mutateAsync({
                      id: viewingMessage.id,
                      status: "replied",
                    });
                    toast.success("Marked as replied");
                    setViewingMessage(null);
                    refetch();
                  }}
                  disabled={viewingMessage.status === "replied"}
                >
                  Mark as Replied
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await updateStatusMutation.mutateAsync({
                      id: viewingMessage.id,
                      status: "archived",
                    });
                    toast.success("Archived");
                    setViewingMessage(null);
                    refetch();
                  }}
                >
                  Archive
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
