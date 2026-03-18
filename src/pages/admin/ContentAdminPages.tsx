import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";
import { Link2, FileText } from "lucide-react";

const CVBuilder = lazy(() => import("./CVBuilder"));

type FormData = Record<string, unknown>;

const loc = (v: FormData, key: string, lang: string): string => {
  const f = v[key];
  if (f && typeof f === "object")
    return ((f as Record<string, unknown>)[lang] as string) ?? "";
  return "";
};
const str = (v: FormData, key: string): string => {
  const val = v[key];
  return typeof val === "string" ? val : "";
};
const bool = (v: FormData, key: string): boolean => !!v[key];

function useAdminForm(
  queryKey: string[],
  queryFn: () => Promise<unknown>,
  mutateFn: (data: FormData) => Promise<unknown>,
) {
  const qc = useQueryClient();
  const { lang } = useLanguageStore();
  const { data, isLoading } = useQuery({ queryKey, queryFn });
  const [local, setLocal] = useState<FormData>({});
  const values: FormData = { ...(data as FormData), ...local };
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
    setLocal((p) => ({ ...p, [key]: value }));
  const handleLocChange = (key: string, l: string, value: string) =>
    setLocal((p) => ({
      ...p,
      [key]: { ...((p[key] as Record<string, unknown>) ?? {}), [l]: value },
    }));
  const save = (e?: React.FormEvent) => {
    e?.preventDefault();
    mutation.mutate(values);
  };
  return { values, isLoading, mutation, handleChange, handleLocChange, save };
}

// Reusable toggle switch
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
      }}
    >
      <div
        onClick={() => onChange(!checked)}
        style={{
          position: "relative",
          width: 40,
          height: 22,
          borderRadius: 999,
          background: checked ? "var(--color-accent)" : "var(--color-border)",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "white",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>
      <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
        {label}
      </span>
    </label>
  );
}

function FieldLabel({ text }: { text: string }) {
  return (
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
      {text}
    </label>
  );
}

function SaveBtn({ pending, lang }: { pending: boolean; lang?: "en" | "id" }) {
  return (
    <div style={{ paddingTop: 16, borderTop: "1px solid var(--color-border)" }}>
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? (
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
            {lang === "id" ? "Menyimpan..." : "Saving..."}
          </span>
        ) : lang === "id" ? (
          "Simpan Perubahan"
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  );
}

function FormCard({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
}

// Lang switcher pill — used inline next to field labels (not in header)
function LangPill({
  lang,
  setLang,
}: {
  lang: "en" | "id";
  setLang: (l: "en" | "id") => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        borderRadius: 6,
        padding: 2,
      }}
    >
      {(["en", "id"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          style={{
            padding: "3px 10px",
            borderRadius: 4,
            border: "none",
            cursor: "pointer",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: lang === l ? "var(--color-accent)" : "transparent",
            color: lang === l ? "white" : "var(--color-text-muted)",
            transition: "all 0.15s",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

// ─── Hero Admin Page ───────────────────────────────────────────────────────
export function HeroAdminPage() {
  const { lang: uiLang } = useLanguageStore();
  const [contentLang, setContentLang] = useState<"en" | "id">("en");
  const { values, isLoading, mutation, handleChange, handleLocChange, save } =
    useAdminForm(
      ["admin", "hero"],
      () => adminAPI.getHero(),
      (data) => adminAPI.updateHero(data),
    );

  if (isLoading)
    return (
      <div className="admin-page">
        <div className="skeleton" style={{ height: 32, width: 200 }} />
      </div>
    );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {uiLang === "en" ? "Hero Section" : "Bagian Hero"}
          </h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Edit your hero section content"
              : "Edit konten bagian hero"}
          </p>
        </div>
      </div>

      <form onSubmit={save}>
        <FormCard>
          {/* Profile Image URL */}
          <div>
            <FieldLabel
              text={uiLang === "en" ? "Profile Image URL" : "URL Foto Profil"}
            />
            <input
              className="input-cyber"
              value={str(values, "profile_image_url")}
              onChange={(e) =>
                handleChange("profile_image_url", e.target.value)
              }
              placeholder="https://..."
            />
          </div>

          {/* Bilingual fields */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <FieldLabel
              text={uiLang === "en" ? "Bilingual Fields" : "Field Dua Bahasa"}
            />
            <LangPill lang={contentLang} setLang={setContentLang} />
          </div>

          {/* Headline */}
          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Headline" : "Judul Utama"} (${contentLang.toUpperCase()})`}
            />
            <input
              className="input-cyber"
              value={loc(values, "headline", contentLang)}
              onChange={(e) =>
                handleLocChange("headline", contentLang, e.target.value)
              }
              placeholder={
                uiLang === "en"
                  ? "Building Digital Experiences..."
                  : "Membangun Pengalaman Digital..."
              }
            />
          </div>

          {/* Subheadline */}
          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Subheadline" : "Subjudul"} (${contentLang.toUpperCase()})`}
            />
            <input
              className="input-cyber"
              value={loc(values, "subheadline", contentLang)}
              onChange={(e) =>
                handleLocChange("subheadline", contentLang, e.target.value)
              }
              placeholder={
                uiLang === "en"
                  ? "Full-Stack Engineer & ..."
                  : "Engineer Full-Stack & ..."
              }
            />
          </div>

          {/* Short Intro */}
          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Short Introduction" : "Intro Singkat"} (${contentLang.toUpperCase()})`}
            />
            <textarea
              className="input-cyber"
              rows={3}
              value={loc(values, "short_intro", contentLang)}
              onChange={(e) =>
                handleLocChange("short_intro", contentLang, e.target.value)
              }
            />
          </div>

          {/* Availability Badge */}
          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Availability Badge Text" : "Teks Badge Ketersediaan"} (${contentLang.toUpperCase()})`}
            />
            <input
              className="input-cyber"
              value={loc(values, "availability_badge", contentLang)}
              onChange={(e) =>
                handleLocChange(
                  "availability_badge",
                  contentLang,
                  e.target.value,
                )
              }
              placeholder={
                uiLang === "en"
                  ? "Available for selected work"
                  : "Tersedia untuk proyek terpilih"
              }
            />
          </div>

          {/* Show badge toggle */}
          <Toggle
            checked={bool(values, "show_availability_badge")}
            onChange={(v) => handleChange("show_availability_badge", v)}
            label={
              uiLang === "en"
                ? "Show availability badge"
                : "Tampilkan badge ketersediaan"
            }
          />

          <SaveBtn pending={mutation.isPending} lang={uiLang} />
        </FormCard>
      </form>
    </div>
  );
}

// ─── About Admin Page ──────────────────────────────────────────────────────
export function AboutAdminPage() {
  const { lang: uiLang } = useLanguageStore();
  const [contentLang, setContentLang] = useState<"en" | "id">("en");
  const { values, isLoading, mutation, handleChange, handleLocChange, save } =
    useAdminForm(
      ["admin", "about"],
      () => adminAPI.getAbout(),
      (data) => adminAPI.updateAbout(data),
    );

  if (isLoading)
    return (
      <div className="admin-page">
        <div className="skeleton" style={{ height: 32, width: 200 }} />
      </div>
    );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {uiLang === "en" ? "About Section" : "Bagian Tentang"}
          </h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Edit your about section content"
              : "Edit konten bagian tentang"}
          </p>
        </div>
      </div>

      <form onSubmit={save}>
        <FormCard>
          {/* Profile Image URL */}
          <div>
            <FieldLabel
              text={uiLang === "en" ? "Profile Image URL" : "URL Foto Profil"}
            />
            <input
              className="input-cyber"
              value={str(values, "profile_image_url")}
              onChange={(e) =>
                handleChange("profile_image_url", e.target.value)
              }
              placeholder="https://..."
            />
          </div>

          {/* Years of experience */}
          <div>
            <FieldLabel
              text={
                uiLang === "en" ? "Years of Experience" : "Tahun Pengalaman"
              }
            />
            <input
              className="input-cyber"
              type="number"
              min={0}
              value={(values["years_of_experience"] as number) ?? 0}
              onChange={(e) =>
                handleChange(
                  "years_of_experience",
                  parseInt(e.target.value) || 0,
                )
              }
            />
          </div>

          {/* Bilingual fields */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <FieldLabel
              text={uiLang === "en" ? "Bilingual Fields" : "Field Dua Bahasa"}
            />
            <LangPill lang={contentLang} setLang={setContentLang} />
          </div>

          {/* Short Bio */}
          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Short Bio" : "Bio Singkat"} (${contentLang.toUpperCase()})`}
            />
            <textarea
              className="input-cyber"
              rows={3}
              value={loc(values, "short_bio", contentLang)}
              onChange={(e) =>
                handleLocChange("short_bio", contentLang, e.target.value)
              }
            />
          </div>

          {/* Full Bio */}
          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Full Bio (Markdown)" : "Bio Lengkap (Markdown)"} (${contentLang.toUpperCase()})`}
            />
            <textarea
              className="input-cyber"
              rows={8}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                resize: "vertical",
              }}
              value={loc(values, "full_bio", contentLang)}
              onChange={(e) =>
                handleLocChange("full_bio", contentLang, e.target.value)
              }
            />
          </div>

          <SaveBtn pending={mutation.isPending} lang={uiLang} />
        </FormCard>
      </form>
    </div>
  );
}

// ─── Resume Admin Page ─────────────────────────────────────────────────────
export function ResumeAdminPage() {
  const { lang: uiLang } = useLanguageStore();
  const [tab, setTab] = useState<"url" | "builder">("url");
  const [contentLang, setContentLang] = useState<"en" | "id">("en");
  const { values, isLoading, mutation, handleChange, handleLocChange, save } =
    useAdminForm(
      ["admin", "resume"],
      () => adminAPI.getResumeSettings(),
      (data) => adminAPI.updateResumeSettings(data),
    );

  if (isLoading)
    return (
      <div className="admin-page">
        <div className="skeleton" style={{ height: 32, width: 200 }} />
      </div>
    );

  const tabBtnStyle = (active: boolean) => ({
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 8,
    padding: "10px 20px",
    borderRadius: "10px 10px 0 0",
    border: active ? "1px solid var(--color-border)" : "1px solid transparent",
    borderBottom: active
      ? "1px solid var(--color-surface-card)"
      : "1px solid var(--color-border)",
    background: active ? "var(--color-surface-card)" : "transparent",
    color: active ? "var(--color-text-primary)" : "var(--color-text-muted)",
    cursor: "pointer" as const,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    marginBottom: -1,
    transition: "all 0.15s",
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Resume / CV</h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Manage your resume — use a URL or build one here"
              : "Kelola resume Anda — gunakan URL atau buat di sini"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <button
          type="button"
          onClick={() => setTab("url")}
          style={tabBtnStyle(tab === "url")}
        >
          <Link2 size={14} />
          {uiLang === "en" ? "Use URL" : "Gunakan URL"}
        </button>
        <button
          type="button"
          onClick={() => setTab("builder")}
          style={tabBtnStyle(tab === "builder")}
        >
          <FileText size={14} />
          {uiLang === "en" ? "CV Builder" : "Buat CV"}
        </button>
      </div>

      {/* Tab: Use URL */}
      {tab === "url" && (
        <form onSubmit={save}>
          <FormCard>
            <div>
              <FieldLabel
                text={uiLang === "en" ? "Resume File URL" : "URL File Resume"}
              />
              <input
                className="input-cyber"
                value={str(values, "url")}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://drive.google.com/..."
              />
              <p
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 6,
                }}
              >
                {uiLang === "en"
                  ? "Paste a direct link to your PDF (Google Drive, Dropbox, etc.)"
                  : "Tempel tautan langsung ke PDF Anda (Google Drive, Dropbox, dll.)"}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <FieldLabel
                text={`${uiLang === "en" ? "Download Button Label" : "Label Tombol Unduh"} (${contentLang.toUpperCase()})`}
              />
              <LangPill lang={contentLang} setLang={setContentLang} />
            </div>
            <input
              className="input-cyber"
              value={loc(values, "button_label", contentLang)}
              onChange={(e) =>
                handleLocChange("button_label", contentLang, e.target.value)
              }
              placeholder={contentLang === "en" ? "Download CV" : "Unduh CV"}
            />

            <Toggle
              checked={bool(values, "show_button")}
              onChange={(v) => handleChange("show_button", v)}
              label={
                uiLang === "en"
                  ? "Show download button on site"
                  : "Tampilkan tombol unduh di situs"
              }
            />

            <SaveBtn pending={mutation.isPending} lang={uiLang} />
          </FormCard>
        </form>
      )}

      {/* Tab: CV Builder */}
      {tab === "builder" && (
        <Suspense
          fallback={
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: 80, borderRadius: 12 }}
                />
              ))}
            </div>
          }
        >
          <CVBuilder />
        </Suspense>
      )}
    </div>
  );
}

// ─── Contact Settings Admin Page ───────────────────────────────────────────
export function ContactSettingsAdminPage() {
  const { lang: uiLang } = useLanguageStore();
  const [contentLang, setContentLang] = useState<"en" | "id">("en");
  const { values, isLoading, mutation, handleChange, handleLocChange, save } =
    useAdminForm(
      ["admin", "contact-settings"],
      () => adminAPI.getContactSettings(),
      (data) => adminAPI.updateContactSettings(data),
    );

  if (isLoading)
    return (
      <div className="admin-page">
        <div className="skeleton" style={{ height: 32, width: 200 }} />
      </div>
    );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {uiLang === "en" ? "Contact Settings" : "Pengaturan Kontak"}
          </h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Configure your contact section"
              : "Konfigurasi bagian kontak Anda"}
          </p>
        </div>
      </div>

      <form onSubmit={save}>
        <FormCard>
          {/* Email */}
          <div>
            <FieldLabel
              text={uiLang === "en" ? "Contact Email" : "Email Kontak"}
            />
            <input
              className="input-cyber"
              type="email"
              value={str(values, "email")}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <FieldLabel
              text={uiLang === "en" ? "Phone / WhatsApp" : "Telepon / WhatsApp"}
            />
            <input
              className="input-cyber"
              value={str(values, "phone")}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+62..."
            />
          </div>

          {/* Bilingual fields */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <FieldLabel
              text={uiLang === "en" ? "Bilingual Fields" : "Field Dua Bahasa"}
            />
            <LangPill lang={contentLang} setLang={setContentLang} />
          </div>

          {/* Section heading */}
          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Section Heading" : "Judul Bagian"} (${contentLang.toUpperCase()})`}
            />
            <input
              className="input-cyber"
              value={loc(values, "heading", contentLang)}
              onChange={(e) =>
                handleLocChange("heading", contentLang, e.target.value)
              }
            />
          </div>

          {/* Section subheading */}
          <div>
            <FieldLabel
              text={`${uiLang === "en" ? "Subheading" : "Subjudul"} (${contentLang.toUpperCase()})`}
            />
            <textarea
              className="input-cyber"
              rows={3}
              value={loc(values, "subheading", contentLang)}
              onChange={(e) =>
                handleLocChange("subheading", contentLang, e.target.value)
              }
            />
          </div>

          {/* Enable contact form */}
          <Toggle
            checked={bool(values, "form_enabled")}
            onChange={(v) => handleChange("form_enabled", v)}
            label={
              uiLang === "en"
                ? "Enable contact form"
                : "Aktifkan formulir kontak"
            }
          />

          <SaveBtn pending={mutation.isPending} lang={uiLang} />
        </FormCard>
      </form>
    </div>
  );
}
