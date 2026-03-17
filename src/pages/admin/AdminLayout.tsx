import { useState, useEffect } from "react";
import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { adminAPI } from "@/api/admin";
import axios from "axios";
import {
  LayoutDashboard,
  Settings,
  Globe,
  Palette,
  Navigation,
  Eye,
  Zap,
  User,
  Code2,
  Link2,
  FolderOpen,
  Briefcase,
  BookOpen,
  Mail,
  Inbox,
  FileDown,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface NavEntry {
  to: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}
interface NavSection {
  group: string;
  items: NavEntry[];
}

const NAV: NavSection[] = [
  {
    group: "Overview",
    items: [
      {
        to: "/admin",
        label: "Dashboard",
        icon: <LayoutDashboard size={16} />,
        exact: true,
      },
    ],
  },
  {
    group: "Content",
    items: [
      { to: "/admin/hero", label: "Hero", icon: <Zap size={16} /> },
      { to: "/admin/about", label: "About", icon: <User size={16} /> },
      { to: "/admin/skills", label: "Skills", icon: <Code2 size={16} /> },
      {
        to: "/admin/social-links",
        label: "Social Links",
        icon: <Link2 size={16} />,
      },
      {
        to: "/admin/projects",
        label: "Projects",
        icon: <FolderOpen size={16} />,
      },
      {
        to: "/admin/experience",
        label: "Experience",
        icon: <Briefcase size={16} />,
      },
      { to: "/admin/blog", label: "Blog", icon: <BookOpen size={16} /> },
    ],
  },
  {
    group: "Site",
    items: [
      {
        to: "/admin/sections",
        label: "Section Visibility",
        icon: <Eye size={16} />,
      },
      {
        to: "/admin/navigation",
        label: "Navigation",
        icon: <Navigation size={16} />,
      },
      {
        to: "/admin/resume",
        label: "Resume / CV",
        icon: <FileDown size={16} />,
      },
    ],
  },
  {
    group: "Settings",
    items: [
      {
        to: "/admin/settings/site",
        label: "Site Settings",
        icon: <Settings size={16} />,
      },
      {
        to: "/admin/settings/theme",
        label: "Theme",
        icon: <Palette size={16} />,
      },
      {
        to: "/admin/settings/language",
        label: "Language",
        icon: <Globe size={16} />,
      },
      { to: "/admin/settings/seo", label: "SEO", icon: <Search size={16} /> },
    ],
  },
  {
    group: "Contact",
    items: [
      {
        to: "/admin/contact/settings",
        label: "Contact Settings",
        icon: <Mail size={16} />,
      },
      {
        to: "/admin/contact/submissions",
        label: "Submissions",
        icon: <Inbox size={16} />,
      },
    ],
  },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminAPI.logout();
    } catch (_) {
      // logout regardless of API error
    }
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-sidebar h-full flex flex-col overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <span className="font-bold text-sm text-text-primary">
            Admin Panel
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-4">
        {NAV.map((section) => (
          <div key={section.group}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted px-3 mb-1">
              {section.group}
            </p>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-xs font-bold text-accent-bright">
              {(admin?.name || admin?.email || "A")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">
                {admin?.name || "Admin"}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {admin?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded text-text-muted hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const {
    isAuthenticated,
    isInitialized,
    setAccessToken,
    setAdmin,
    setInitialized,
  } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isInitialized) return;
    // Try to restore session via refresh token cookie
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
    axios
      .post(`${BASE_URL}/api/v1/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        const { access_token, admin } = res.data.data;
        setAccessToken(access_token);
        setAdmin(admin);
      })
      .catch(() => {
        // No valid session, will redirect to login
      })
      .finally(() => setInitialized());
  }, [isInitialized, setAccessToken, setAdmin, setInitialized]);

  // Still trying to restore session
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 w-64">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-surface/50 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-text-secondary"
          >
            <Menu size={20} />
          </button>
          <div className="md:hidden" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-muted hover:text-accent-bright transition-colors flex items-center gap-1.5"
          >
            ↗ View Site
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
