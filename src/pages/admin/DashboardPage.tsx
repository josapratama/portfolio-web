import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { FolderOpen, BookOpen, Code2, Inbox, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface DashboardData {
  stats: {
    projects?: number;
    blog_posts?: number;
    skills?: number;
    unread_submissions?: number;
  };
  recent_submissions: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    is_read: boolean;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  const { data: rawData } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminAPI.getDashboard,
  });
  const data = rawData as DashboardData | undefined;

  const stats = data?.stats || {};
  const recentSubs = data?.recent_submissions ?? [];

  const cards = [
    {
      label: "Published Projects",
      value: stats.projects ?? "—",
      icon: <FolderOpen size={20} />,
      to: "/admin/projects",
      color: "blue",
    },
    {
      label: "Blog Posts",
      value: stats.blog_posts ?? "—",
      icon: <BookOpen size={20} />,
      to: "/admin/blog",
      color: "indigo",
    },
    {
      label: "Skills",
      value: stats.skills ?? "—",
      icon: <Code2 size={20} />,
      to: "/admin/skills",
      color: "cyan",
    },
    {
      label: "Unread Messages",
      value: stats.unread_submissions ?? "—",
      icon: <Inbox size={20} />,
      to: "/admin/contact/submissions",
      color: "violet",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          Dashboard
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Overview of your portfolio content
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="card-glass p-4 sm:p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 text-accent-bright">
                {card.icon}
              </div>
              <TrendingUp
                size={14}
                className="text-text-muted"
              />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-text-primary">
                {card.value}
              </div>
              <div className="text-xs text-text-muted mt-0.5 leading-tight">
                {card.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent submissions */}
      <div className="card-glass p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-text-primary">
            Recent Contact Submissions
          </h2>
          <Link
            to="/admin/contact/submissions"
            className="text-xs text-accent-bright hover:underline"
          >
            View all
          </Link>
        </div>
        {recentSubs.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">
            No submissions yet
          </p>
        ) : (
          <div className="space-y-3">
            {recentSubs.map((sub) => (
              <div
                key={sub.id}
                className="flex items-start justify-between gap-4 p-3 rounded-lg bg-surface-2 border border-border"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {!sub.is_read && (
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {sub.name}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {sub.email} — {sub.subject || "(no subject)"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-text-muted shrink-0">
                  {format(new Date(sub.created_at), "MMM d")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
