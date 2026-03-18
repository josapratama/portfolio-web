import { useState, lazy, Suspense } from "react";
import { adminAPI } from "@/api/admin";
import { useLanguageStore } from "@/store/languageStore";
import { Link2, FileText, CheckCircle2 } from "lucide-react";
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

  const activeSource = (values.cv_source as string) || "url";
  const showButton = bool(values, "enable_cv_download");

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

  const activeBadge = (source: "url" | "builder") =>
    activeSource === source ? (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-success, #22c55e)",
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 20,
          padding: "2px 8px",
        }}
      >
        <CheckCircle2 size={11} />
        {uiLang === "en" ? "Active" : "Aktif"}
      </span>
    ) : null;

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

      {/* Status summary */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderRadius: 10,
          background: showButton
            ? "rgba(34,197,94,0.07)"
            : "rgba(239,68,68,0.07)",
          border: `1px solid ${showButton ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
          fontSize: 13,
          color: showButton
            ? "var(--color-success, #22c55e)"
            : "var(--color-error, #ef4444)",
          marginBottom: 20,
        }}
      >
        <CheckCircle2 size={14} />
        {showButton
          ? uiLang === "en"
            ? `Download button is visible — source: ${activeSource === "url" ? "External URL" : "CV Builder"}`
            : `Tombol unduh terlihat — sumber: ${activeSource === "url" ? "URL Eksternal" : "CV Builder"}`
          : uiLang === "en"
            ? "Download button is hidden from the public site"
            : "Tombol unduh disembunyikan dari situs publik"}
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
          <span style={{ marginLeft: 4 }}>{activeBadge("url")}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("builder")}
          style={tabBtnStyle(tab === "builder")}
        >
          <FileText size={14} />
          {uiLang === "en" ? "CV Builder" : "Buat CV"}
          <span style={{ marginLeft: 4 }}>{activeBadge("builder")}</span>
        </button>
      </div>

      {tab === "url" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChange("cv_source", "url");
            save();
          }}
        >
          <FormCard>
            <div>
              <FieldLabel
                text={uiLang === "en" ? "Resume File URL" : "URL File Resume"}
              />
              <input
                className="input-cyber"
                value={str(values, "cv_url")}
                onChange={(e) => handleChange("cv_url", e.target.value)}
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
              checked={showButton}
              onChange={(v) => handleChange("enable_cv_download", v)}
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
        <>
          {/* Activate builder source */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: 10,
              background: "var(--color-surface-card)",
              border: "1px solid var(--color-border)",
              marginTop: 16,
              marginBottom: 4,
              gap: 12,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: 2,
                }}
              >
                {uiLang === "en"
                  ? "Use CV Builder as download source"
                  : "Gunakan CV Builder sebagai sumber unduhan"}
              </p>
              <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                {uiLang === "en"
                  ? "When active, the download button will use the CV you build below"
                  : "Saat aktif, tombol unduh akan menggunakan CV yang Anda buat di bawah"}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {activeBadge("builder")}
              <button
                type="button"
                onClick={() => {
                  handleChange("cv_source", "builder");
                  handleChange("enable_cv_download", true);
                  save();
                }}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    activeSource === "builder"
                      ? "rgba(34,197,94,0.15)"
                      : "var(--color-accent)",
                  color:
                    activeSource === "builder"
                      ? "var(--color-success, #22c55e)"
                      : "white",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap" as const,
                }}
              >
                {activeSource === "builder"
                  ? uiLang === "en"
                    ? "Already Active"
                    : "Sudah Aktif"
                  : uiLang === "en"
                    ? "Set as Active"
                    : "Jadikan Aktif"}
              </button>
            </div>
          </div>

          <Suspense
            fallback={
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
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
        </>
      )}
    </div>
  );
}
