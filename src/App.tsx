import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// Public
import PublicLayout from "@/components/public/PublicLayout";
import HomePage from "@/pages/public/HomePage";
import AboutPage from "@/pages/public/AboutPage";
import ProjectsPage from "@/pages/public/ProjectsPage";
import ProjectDetailPage from "@/pages/public/ProjectDetailPage";
import ExperiencePage from "@/pages/public/ExperiencePage";
import BlogPage from "@/pages/public/BlogPage";
import BlogDetailPage from "@/pages/public/BlogDetailPage";
import ContactPage from "@/pages/public/ContactPage";
import NotFoundPage from "@/pages/public/NotFoundPage";

// Admin
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import {
  SiteSettingsPage,
  ThemeSettingsPage,
  LanguageSettingsPage,
  SEOSettingsPage,
} from "@/pages/admin/SettingsPages";
import {
  HeroAdminPage,
  AboutAdminPage,
  ResumeAdminPage,
  ContactSettingsAdminPage,
} from "@/pages/admin/ContentAdminPages";
import SectionVisibilityPage from "@/pages/admin/SectionVisibilityPage";
import NavigationPage from "@/pages/admin/NavigationPage";
import BlogManagerPage from "@/pages/admin/BlogManagerPage";
import ProjectsManagerPage from "@/pages/admin/ProjectsManagerPage";
import ContactSubmissionsPage from "@/pages/admin/ContactSubmissionsPage";
import SkillsManagerPage from "@/pages/admin/SkillsManagerPage";
import SocialLinksManagerPage from "@/pages/admin/SocialLinksManagerPage";
import ExperienceManagerPage from "@/pages/admin/ExperienceManagerPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" theme="dark" richColors />
        <Routes>
          {/* ── Public ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ── Admin ── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />

            {/* Content */}
            <Route path="hero" element={<HeroAdminPage />} />
            <Route path="about" element={<AboutAdminPage />} />
            <Route path="skills" element={<SkillsManagerPage />} />
            <Route path="social-links" element={<SocialLinksManagerPage />} />
            <Route path="projects" element={<ProjectsManagerPage />} />
            <Route path="experience" element={<ExperienceManagerPage />} />
            <Route path="blog" element={<BlogManagerPage />} />

            {/* Site */}
            <Route path="sections" element={<SectionVisibilityPage />} />
            <Route path="navigation" element={<NavigationPage />} />
            <Route path="resume" element={<ResumeAdminPage />} />

            {/* Settings */}
            <Route path="settings/site" element={<SiteSettingsPage />} />
            <Route path="settings/theme" element={<ThemeSettingsPage />} />
            <Route
              path="settings/language"
              element={<LanguageSettingsPage />}
            />
            <Route path="settings/seo" element={<SEOSettingsPage />} />

            {/* Contact */}
            <Route
              path="contact/settings"
              element={<ContactSettingsAdminPage />}
            />
            <Route
              path="contact/submissions"
              element={<ContactSubmissionsPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
