import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState } from "react";
import { toast } from "sonner";
import { Inbox, Archive, Trash2, Mail } from "lucide-react";
import { format } from "date-fns";

interface SubmissionsData {
  submissions: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
    is_archived: boolean;
    created_at: string;
  }>;
}

export default function ContactSubmissionsPage() {
  const qc = useQueryClient();
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: () => adminAPI.getSubmissions(),
  });
  const data = rawData as SubmissionsData | undefined;
  const [selected, setSelected] = useState<
    SubmissionsData["submissions"][0] | null
  >(null);
  const submissions = data?.submissions ?? [];

  const readM = useMutation({
    mutationFn: adminAPI.markSubmissionRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-submissions"] }),
  });
  const archiveM = useMutation({
    mutationFn: adminAPI.archiveSubmission,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success("Archived");
      setSelected(null);
    },
  });
  const deleteM = useMutation({
    mutationFn: adminAPI.deleteSubmission,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success("Deleted");
      setSelected(null);
    },
  });

  const openSub = (sub: SubmissionsData["submissions"][0]) => {
    setSelected(sub);
    if (!sub.is_read) readM.mutate(sub.id);
  };

  if (isLoading) return <div className="skeleton h-96 rounded-xl" />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          Contact Submissions
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {submissions.filter((s) => !s.is_read).length} unread messages
        </p>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="card-glass w-full max-w-lg p-5 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-text-primary">
                  {selected.subject || "(no subject)"}
                </h2>
                <p className="text-sm text-accent-bright">
                  {selected.name} &lt;{selected.email}&gt;
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {format(new Date(selected.created_at), "MMM d, yyyy HH:mm")}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-text-muted hover:text-text-primary"
              >
                ×
              </button>
            </div>
            <div className="bg-surface-2 rounded-xl p-4 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {selected.message}
            </div>
            <div className="flex gap-3">
              <a
                href={`mailto:${selected.email}`}
                className="btn-primary flex-1 justify-center text-sm"
              >
                <Mail size={14} /> Reply
              </a>
              <button
                onClick={() => archiveM.mutate(selected.id)}
                className="btn-secondary text-sm"
              >
                <Archive size={14} /> Archive
              </button>
              <button
                onClick={() => deleteM.mutate(selected.id)}
                className="p-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card-glass divide-y divide-border">
        {submissions.length === 0 && (
          <p className="text-center py-12 text-sm text-text-muted flex flex-col items-center gap-3">
            <Inbox size={24} className="opacity-30" /> No messages yet
          </p>
        )}
        {submissions
          .filter((s) => !s.is_archived)
          .map((sub) => (
            <div
              key={sub.id}
              onClick={() => openSub(sub)}
              className="flex items-start justify-between p-4 gap-4 cursor-pointer hover:bg-surface-2 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!sub.is_read ? "bg-accent" : "bg-transparent"}`}
                />
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${!sub.is_read ? "text-text-primary" : "text-text-secondary"}`}
                  >
                    {sub.name}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {sub.email}
                  </p>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {sub.subject || "(no subject)"}
                  </p>
                </div>
              </div>
              <span className="text-xs text-text-muted shrink-0">
                {format(new Date(sub.created_at), "MMM d")}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
