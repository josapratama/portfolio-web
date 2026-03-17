import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState } from "react";
import { toast } from "sonner";

// ── Generic form page for singleton settings ──

interface Field {
  key: string;
  label: string;
  type?: "text" | "email" | "url" | "textarea" | "toggle" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

function SettingsForm({
  title,
  subtitle,
  queryKey,
  queryFn,
  mutateFn,
  fields,
}: {
  title: string;
  subtitle?: string;
  queryKey: string[];
  queryFn: () => Promise<unknown>;
  mutateFn: (data: Record<string, unknown>) => Promise<unknown>;
  fields: Field[];
}) {
  const { data, isLoading } = useQuery({ queryKey, queryFn });
  const qc = useQueryClient();
  const [local, setLocal] = useState<Record<string, unknown>>({});

  const values: Record<string, unknown> = {
    ...(data as Record<string, unknown>),
    ...local,
  };

  const mutation = useMutation({
    mutationFn: mutateFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Saved!");
    },
    onError: () => toast.error("Failed to save"),
  });

  const handleChange = (key: string, value: unknown) =>
    setLocal((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(values);
  };

  if (isLoading) return <div className="skeleton h-96 rounded-xl" />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
        )}
      </div>
      <div className="card-glass p-8 space-y-6 max-w-2xl">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
              {field.label}
            </label>
            {field.type === "toggle" ? (
              <label className="flex items-center gap-3 cursor-pointer w-fit">
                <div
                  className={`relative w-10 h-5 rounded-full transition-colors ${values[field.key] ? "bg-accent" : "bg-border"}`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={!!values[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.checked)}
                  />
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${values[field.key] ? "translate-x-5" : "translate-x-0"}`}
                  />
                </div>
                <span className="text-sm text-text-secondary">
                  {values[field.key] ? "Enabled" : "Disabled"}
                </span>
              </label>
            ) : field.type === "textarea" ? (
              <textarea
                className="input-cyber resize-y"
                rows={4}
                value={(values[field.key] as string) || ""}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            ) : field.type === "select" ? (
              <select
                className="input-cyber"
                value={(values[field.key] as string) || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
              >
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                className="input-cyber"
                value={(values[field.key] as string) || ""}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="pt-2 border-t border-border">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function SiteSettingsPage() {
  return (
    <SettingsForm
      title="Site Settings"
      subtitle="Core identity and branding settings"
      queryKey={["admin-site-settings"]}
      queryFn={adminAPI.getSiteSettings}
      mutateFn={(data) => adminAPI.updateSiteSettings(data)}
      fields={[
        { key: "site_name", label: "Site Name", placeholder: "DevPortfolio" },
        { key: "brand_name", label: "Brand Name", placeholder: "Alex Dev" },
        { key: "full_name", label: "Full Name", placeholder: "Alex Johnson" },
        {
          key: "title",
          label: "Professional Title",
          placeholder: "Full-Stack Software Engineer",
        },
        {
          key: "contact_email",
          label: "Contact Email",
          type: "email",
          placeholder: "hello@alexdev.io",
        },
        {
          key: "location",
          label: "Location",
          placeholder: "Jakarta, Indonesia",
        },
        {
          key: "availability_status",
          label: "Availability Status",
          placeholder: "Available for selected work",
        },
        { key: "is_available", label: "Show as Available", type: "toggle" },
        {
          key: "footer_text",
          label: "Footer Text",
          placeholder: "© 2025 Alex Johnson",
        },
        {
          key: "cta_primary_label",
          label: "Primary CTA Label",
          placeholder: "View My Work",
        },
        {
          key: "cta_secondary_label",
          label: "Secondary CTA Label",
          placeholder: "Get In Touch",
        },
        {
          key: "logo_url",
          label: "Logo URL",
          type: "url",
          placeholder: "https://...",
        },
      ]}
    />
  );
}

export function ThemeSettingsPage() {
  return (
    <SettingsForm
      title="Theme Settings"
      subtitle="Control theme switching and accent colors"
      queryKey={["admin-theme-settings"]}
      queryFn={adminAPI.getThemeSettings}
      mutateFn={(data) => adminAPI.updateThemeSettings(data)}
      fields={[
        {
          key: "enable_theme_switcher",
          label: "Enable Theme Switcher on Public Site",
          type: "toggle",
        },
        {
          key: "default_theme",
          label: "Default Theme",
          type: "select",
          options: [
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ],
        },
        {
          key: "accent_preset",
          label: "Accent Color Preset",
          type: "select",
          options: [
            { value: "blue", label: "Blue (Cyber)" },
            { value: "indigo", label: "Indigo" },
            { value: "cyan", label: "Cyan" },
          ],
        },
      ]}
    />
  );
}

export function LanguageSettingsPage() {
  return (
    <SettingsForm
      title="Language Settings"
      subtitle="Control language switching and default language"
      queryKey={["admin-language-settings"]}
      queryFn={adminAPI.getLanguageSettings}
      mutateFn={(data) => adminAPI.updateLanguageSettings(data)}
      fields={[
        {
          key: "enable_language_switcher",
          label: "Enable Language Switcher on Public Site",
          type: "toggle",
        },
        {
          key: "default_language",
          label: "Default Language",
          type: "select",
          options: [
            { value: "en", label: "English" },
            { value: "id", label: "Indonesian" },
          ],
        },
      ]}
    />
  );
}

export function SEOSettingsPage() {
  return (
    <SettingsForm
      title="SEO Settings"
      subtitle="Meta tags, Open Graph, and Twitter Card settings"
      queryKey={["admin-seo-settings"]}
      queryFn={adminAPI.getSEOSettings}
      mutateFn={(data) => adminAPI.updateSEOSettings(data)}
      fields={[
        {
          key: "meta_title",
          label: "Meta Title",
          placeholder: "Alex Johnson — Full-Stack Engineer",
        },
        {
          key: "meta_description",
          label: "Meta Description",
          type: "textarea",
          placeholder: "Portfolio website of Alex Johnson...",
        },
        {
          key: "og_title",
          label: "Open Graph Title",
          placeholder: "Alex Johnson",
        },
        {
          key: "og_description",
          label: "Open Graph Description",
          type: "textarea",
        },
        { key: "og_image_url", label: "OG Image URL", type: "url" },
        {
          key: "twitter_card",
          label: "Twitter Card Type",
          type: "select",
          options: [
            { value: "summary", label: "Summary" },
            { value: "summary_large_image", label: "Summary Large Image" },
          ],
        },
        {
          key: "canonical_url",
          label: "Canonical URL",
          type: "url",
          placeholder: "https://yoursite.com",
        },
      ]}
    />
  );
}
