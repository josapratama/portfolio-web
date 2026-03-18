import { useState, lazy, Suspense } from "react";
import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { Link2, FileText } from "lucide-react";
import { useAdminForm, str, loc, bool } from "./_helpers";
import { Toggle, FieldLabel, SaveBtn, FormCard, LangPill } from "./_shared";

const CVBuilder = lazy(() => import("@/features/cv/CVBuilder"));

export default function ResumeAdminPage() {
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
