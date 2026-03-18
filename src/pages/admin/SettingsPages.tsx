import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";

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
  const { lang } = useLanguageStore();
  const [local, setLocal] = useState<Record<string, unknown>>({});
  const values: Record<string, unknown> = {
    ...(data as Record<string, unknown>),
    ...local,
  };

  const mutation = useMutation({
    mutationFn: mutateFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success(lang === "en" ? "Saved!" : "Tersimpan!");
    },
    onError: () =>
      toast.error(lang === "en" ? "Failed to save" : "Gagal menyimpan"),
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
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">{title}</h1>
            {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div
          style={{
            background: "var(--color-surface-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 16,
            padding: "clamp(20px, 3vw, 28px)",
            backdropFilter: "blur(16px)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 680,
          }}
        >
          {fields.map((field) => (
            <div key={field.key}>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                {field.label}
              </label>

              {field.type === "toggle" ? (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: 40,
                      height: 22,
                      borderRadius: 999,
                      background: values[field.key]
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                      transition: "background 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        position: "absolute",
                        opacity: 0,
                        width: 0,
                        height: 0,
                      }}
                      checked={!!values[field.key]}
                      onChange={(e) =>
                        handleChange(field.key, e.target.checked)
                      }
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 3,
                        left: values[field.key] ? 21 : 3,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "white",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {values[field.key]
                      ? lang === "en"
                        ? "Active"
                        : "Aktif"
                      : lang === "en"
                        ? "Inactive"
                        : "Nonaktif"}
                  </span>
                </label>
              ) : field.type === "textarea" ? (
                <textarea
                  className="input-cyber"
                  rows={4}
                  style={{ resize: "vertical" }}
                  value={(values[field.key] as string) || ""}
                  placeholder={field.placeholder}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              ) : field.type === "select" ? (
                <select
                  className="input-cyber"
                  value={(values[field.key] as string) || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  style={{ cursor: "pointer" }}
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

          <div
            style={{
              paddingTop: 16,
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary"
            >
              {mutation.isPending ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid white",
                      borderTopColor: "transparent",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  {lang === "en" ? "Saving..." : "Menyimpan..."}
                </span>
              ) : lang === "en" ? (
                "Save Changes"
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function SiteSettingsPage() {
  const { lang } = useLanguageStore();
  return (
    <SettingsForm
      title={lang === "en" ? "Site Settings" : "Pengaturan Situs"}
      subtitle={
        lang === "en"
          ? "Identity and main branding"
          : "Identitas dan branding utama"
      }
      queryKey={["admin-site-settings"]}
      queryFn={adminAPI.getSiteSettings}
      mutateFn={(data) => adminAPI.updateSiteSettings(data)}
      fields={[
        {
          key: "site_name",
          label: lang === "en" ? "Site Name" : "Nama Situs",
          placeholder: "DevPortfolio",
        },
        {
          key: "brand_name",
          label: lang === "en" ? "Brand Name" : "Nama Brand",
          placeholder: "Alex Dev",
        },
        {
          key: "full_name",
          label: lang === "en" ? "Full Name" : "Nama Lengkap",
          placeholder: "Alex Johnson",
        },
        {
          key: "title",
          label: lang === "en" ? "Professional Title" : "Jabatan Profesional",
          placeholder: "Full-Stack Software Engineer",
        },
        {
          key: "contact_email",
          label: lang === "en" ? "Contact Email" : "Email Kontak",
          type: "email",
          placeholder: "hello@alexdev.io",
        },
        {
          key: "location",
          label: lang === "en" ? "Location" : "Lokasi",
          placeholder: "Jakarta, Indonesia",
        },
        {
          key: "availability_status",
          label: lang === "en" ? "Availability Status" : "Status Ketersediaan",
          placeholder: "Available for selected work",
        },
        {
          key: "is_available",
          label:
            lang === "en" ? "Show as Available" : "Tampilkan sebagai Tersedia",
          type: "toggle",
        },
        {
          key: "footer_text",
          label: lang === "en" ? "Footer Text" : "Teks Footer",
          placeholder: "© 2025 Alex Johnson",
        },
        {
          key: "cta_primary_label",
          label: lang === "en" ? "Primary CTA Label" : "Label CTA Utama",
          placeholder: "View My Work",
        },
        {
          key: "cta_secondary_label",
          label: lang === "en" ? "Secondary CTA Label" : "Label CTA Sekunder",
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
  const { lang } = useLanguageStore();
  return (
    <SettingsForm
      title={lang === "en" ? "Theme Settings" : "Pengaturan Tema"}
      subtitle={
        lang === "en"
          ? "Control theme and accent colors"
          : "Kontrol tema dan warna aksen"
      }
      queryKey={["admin-theme-settings"]}
      queryFn={adminAPI.getThemeSettings}
      mutateFn={(data) => adminAPI.updateThemeSettings(data)}
      fields={[
        {
          key: "enable_theme_switcher",
          label:
            lang === "en"
              ? "Enable Theme Switcher on Public Site"
              : "Aktifkan Pemilih Tema di Situs Publik",
          type: "toggle",
        },
        {
          key: "default_theme",
          label: lang === "en" ? "Default Theme" : "Tema Default",
          type: "select",
          options: [
            { value: "dark", label: lang === "en" ? "Dark" : "Gelap (Dark)" },
            {
              value: "light",
              label: lang === "en" ? "Light" : "Terang (Light)",
            },
          ],
        },
        {
          key: "accent_preset",
          label: lang === "en" ? "Accent Color Preset" : "Preset Warna Aksen",
          type: "select",
          options: [
            {
              value: "blue",
              label: lang === "en" ? "Blue (Cyber)" : "Biru (Cyber)",
            },
            { value: "indigo", label: "Indigo" },
            { value: "cyan", label: "Cyan" },
          ],
        },
      ]}
    />
  );
}

export function LanguageSettingsPage() {
  const { lang } = useLanguageStore();
  return (
    <SettingsForm
      title={lang === "en" ? "Language Settings" : "Pengaturan Bahasa"}
      subtitle={
        lang === "en"
          ? "Control language switcher and default language"
          : "Kontrol pemilih bahasa dan bahasa default"
      }
      queryKey={["admin-language-settings"]}
      queryFn={adminAPI.getLanguageSettings}
      mutateFn={(data) => adminAPI.updateLanguageSettings(data)}
      fields={[
        {
          key: "enable_language_switcher",
          label:
            lang === "en"
              ? "Enable Language Switcher on Public Site"
              : "Aktifkan Pemilih Bahasa di Situs Publik",
          type: "toggle",
        },
        {
          key: "default_language",
          label: lang === "en" ? "Default Language" : "Bahasa Default",
          type: "select",
          options: [
            { value: "en", label: "English" },
            { value: "id", label: "Indonesia" },
          ],
        },
      ]}
    />
  );
}

export function SEOSettingsPage() {
  const { lang } = useLanguageStore();
  return (
    <SettingsForm
      title={lang === "en" ? "SEO Settings" : "Pengaturan SEO"}
      subtitle={
        lang === "en"
          ? "Meta tags, Open Graph, and Twitter Card"
          : "Meta tags, Open Graph, dan Twitter Card"
      }
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
          label: lang === "en" ? "Twitter Card Type" : "Tipe Twitter Card",
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
