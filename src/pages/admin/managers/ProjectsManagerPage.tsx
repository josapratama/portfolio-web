import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  X,
  FolderOpen,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useLanguageStore } from "@/store/languageStore";

interface Project {
  id?: string;
  slug: string;
  title: { en: string; id: string };
  short_description: { en: string; id: string };
  full_description: { en: string; id: string };
  cover_image_url: string;
  tech_stack: string[];
  tags: string[];
  role: { en: string; id: string };
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  live_demo_url: string;
  repo_url: string;
}

const BLANK: Omit<Project, "id"> = {
  slug: "",
  title: { en: "", id: "" },
  short_description: { en: "", id: "" },
  full_description: { en: "", id: "" },
  cover_image_url: "",
  tech_stack: [],
  tags: [],
  role: { en: "", id: "" },
  is_featured: false,
  is_visible: true,
  sort_order: 0,
  live_demo_url: "",
  repo_url: "",
};

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
        gap: 10,
        cursor: "pointer",
      }}
    >
      <div
        onClick={() => onChange(!checked)}
        style={{
          position: "relative",
          width: 36,
          height: 20,
          borderRadius: 999,
          background: checked ? "var(--color-accent)" : "var(--color-border)",
          transition: "background 0.2s",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "white",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>
      <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
        {label}
      </span>
    </label>
  );
}

export default function ProjectsManagerPage() {
  const qc = useQueryClient();
  const { lang: uiLang } = useLanguageStore();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: adminAPI.getProjects,
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(BLANK);
  const [contentLang, setContentLang] = useState<"en" | "id">("en");
  const [techInput, setTechInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-projects"] });
    qc.invalidateQueries({ queryKey: ["projects"] });
  };

  const createM = useMutation({
    mutationFn: adminAPI.createProject,
    onSuccess: () => {
      invalidate();
      toast.success(uiLang === "en" ? "Created" : "Dibuat");
      setEditing(null);
    },
    onError: () => toast.error("Failed"),
  });
  const updateM = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Project }) =>
      adminAPI.updateProject(id, data),
    onSuccess: () => {
      invalidate();
      toast.success(uiLang === "en" ? "Updated" : "Diperbarui");
      setEditing(null);
    },
    onError: () => toast.error("Failed"),
  });
  const deleteM = useMutation({
    mutationFn: adminAPI.deleteProject,
    onSuccess: () => {
      invalidate();
      toast.success(uiLang === "en" ? "Deleted" : "Dihapus");
    },
  });

  const openEdit = async (id: string) => {
    try {
      const d = await adminAPI.getProject(id);
      // Normalize JSONB fields that might come back as objects
      const project = d as Project;
      const normalize = (v: unknown) => {
        if (!v) return { en: "", id: "" };
        if (typeof v === "object") return v as { en: string; id: string };
        try {
          return JSON.parse(v as string);
        } catch {
          return { en: "", id: "" };
        }
      };
      setForm({
        ...project,
        title: normalize(project.title),
        short_description: normalize(project.short_description),
        full_description: normalize(project.full_description),
        role: normalize(project.role),
        tech_stack: project.tech_stack ?? [],
        tags: project.tags ?? [],
      });
      setEditing(id);
    } catch {
      toast.error(
        uiLang === "en" ? "Failed to load project" : "Gagal memuat proyek",
      );
    }
  };
  const openCreate = () => {
    setForm(BLANK);
    setEditing("new");
  };
  const handleSave = () =>
    editing === "new"
      ? createM.mutate(form)
      : updateM.mutate({ id: editing!, data: form });

  const addTech = () => {
    if (techInput.trim() && !form.tech_stack.includes(techInput.trim())) {
      setForm((p) => ({
        ...p,
        tech_stack: [...p.tech_stack, techInput.trim()],
      }));
      setTechInput("");
    }
  };
  const removeTech = (t: string) =>
    setForm((p) => ({ ...p, tech_stack: p.tech_stack.filter((x) => x !== t) }));
  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((p) => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };
  const removeTag = (t: string) =>
    setForm((p) => ({ ...p, tags: p.tags.filter((x) => x !== t) }));
  type LocKey = "title" | "short_description" | "full_description" | "role";
  const setLoc = (key: LocKey, val: string) =>
    setForm((p) => ({ ...p, [key]: { ...p[key], [contentLang]: val } }));

  if (isLoading)
    return (
      <div className="admin-page">
        <div className="skeleton" style={{ height: 300, borderRadius: 12 }} />
      </div>
    );

  const cardStyle = {
    background: "var(--color-surface-card)",
    border: "1px solid var(--color-border)",
    borderRadius: 16,
    backdropFilter: "blur(16px)",
    overflow: "hidden" as const,
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {uiLang === "en" ? "Projects Manager" : "Manajer Proyek"}
          </h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Manage your portfolio projects"
              : "Kelola proyek portofolio Anda"}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ gap: 6 }}>
          <Plus size={15} />
          {uiLang === "en" ? "New Project" : "Proyek Baru"}
        </button>
      </div>

      {/* Modal */}
      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 50,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              ...cardStyle,
              width: "100%",
              maxWidth: 720,
              margin: "32px auto",
              padding: "clamp(20px, 3vw, 32px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--color-text-primary)",
                }}
              >
                {editing === "new"
                  ? uiLang === "en"
                    ? "New Project"
                    : "Proyek Baru"
                  : uiLang === "en"
                    ? "Edit Project"
                    : "Edit Proyek"}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LangPill lang={contentLang} setLang={setContentLang} />
                <button
                  onClick={() => setEditing(null)}
                  style={{
                    padding: 6,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "var(--color-text-muted)",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 6,
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <FieldLabel text="Slug" />
                  <input
                    className="input-cyber"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, slug: e.target.value }))
                    }
                    placeholder="my-project"
                  />
                </div>
                <div>
                  <FieldLabel
                    text={
                      uiLang === "en" ? "Cover Image URL" : "URL Gambar Cover"
                    }
                  />
                  <input
                    className="input-cyber"
                    value={form.cover_image_url}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        cover_image_url: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <FieldLabel
                  text={`${uiLang === "en" ? "Title" : "Judul"} (${contentLang.toUpperCase()})`}
                />
                <input
                  className="input-cyber"
                  value={form.title[contentLang]}
                  onChange={(e) => setLoc("title", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel
                  text={`${uiLang === "en" ? "Short Description" : "Deskripsi Singkat"} (${contentLang.toUpperCase()})`}
                />
                <textarea
                  className="input-cyber"
                  rows={2}
                  style={{ resize: "vertical" }}
                  value={form.short_description[contentLang]}
                  onChange={(e) => setLoc("short_description", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel
                  text={`${uiLang === "en" ? "Full Description (Markdown)" : "Deskripsi Lengkap (Markdown)"} (${contentLang.toUpperCase()})`}
                />
                <textarea
                  className="input-cyber"
                  rows={8}
                  style={{
                    resize: "vertical",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                  value={form.full_description[contentLang]}
                  onChange={(e) => setLoc("full_description", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel
                  text={`${uiLang === "en" ? "Role" : "Peran"} (${contentLang.toUpperCase()})`}
                />
                <input
                  className="input-cyber"
                  value={form.role[contentLang]}
                  onChange={(e) => setLoc("role", e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <FieldLabel text="Live Demo URL" />
                  <input
                    className="input-cyber"
                    value={form.live_demo_url}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, live_demo_url: e.target.value }))
                    }
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <FieldLabel text="Repository URL" />
                  <input
                    className="input-cyber"
                    value={form.repo_url}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, repo_url: e.target.value }))
                    }
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <FieldLabel text="Tech Stack" />
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input
                    className="input-cyber"
                    style={{ flex: 1 }}
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTech())
                    }
                    placeholder={
                      uiLang === "en"
                        ? "Add technology..."
                        : "Tambah teknologi..."
                    }
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="btn-secondary"
                    style={{ padding: "10px 16px", fontSize: 13 }}
                  >
                    {uiLang === "en" ? "Add" : "Tambah"}
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {form.tech_stack.map((t) => (
                    <span
                      key={t}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.25)",
                        fontSize: 12,
                        color: "var(--color-accent-bright)",
                      }}
                    >
                      {t}
                      <button
                        onClick={() => removeTech(t)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "inherit",
                          padding: 0,
                          lineHeight: 1,
                          fontSize: 14,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <FieldLabel text="Tags" />
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input
                    className="input-cyber"
                    style={{ flex: 1 }}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder={
                      uiLang === "en" ? "Add tag..." : "Tambah tag..."
                    }
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn-secondary"
                    style={{ padding: "10px 16px", fontSize: 13 }}
                  >
                    {uiLang === "en" ? "Add" : "Tambah"}
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {form.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.25)",
                        fontSize: 12,
                        color: "#a5b4fc",
                      }}
                    >
                      {t}
                      <button
                        onClick={() => removeTag(t)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "inherit",
                          padding: 0,
                          lineHeight: 1,
                          fontSize: 14,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                <Toggle
                  checked={form.is_featured}
                  onChange={(v) => setForm((p) => ({ ...p, is_featured: v }))}
                  label={
                    uiLang === "en" ? "Featured project" : "Proyek unggulan"
                  }
                />
                <Toggle
                  checked={form.is_visible}
                  onChange={(v) => setForm((p) => ({ ...p, is_visible: v }))}
                  label={
                    uiLang === "en" ? "Visible on site" : "Tampil di situs"
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  paddingTop: 16,
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <button
                  onClick={handleSave}
                  disabled={createM.isPending || updateM.isPending}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  {createM.isPending || updateM.isPending
                    ? uiLang === "en"
                      ? "Saving..."
                      : "Menyimpan..."
                    : uiLang === "en"
                      ? "Save Project"
                      : "Simpan Proyek"}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="btn-secondary"
                >
                  {uiLang === "en" ? "Cancel" : "Batal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects list */}
      <div style={cardStyle}>
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto auto",
            gap: 12,
            padding: "10px 20px",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
          }}
        >
          {[
            uiLang === "en" ? "Project" : "Proyek",
            "Tech Stack",
            uiLang === "en" ? "Status" : "Status",
            "",
          ].map((h, i) => (
            <span
              key={i}
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {(projects as Project[]).length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
              }}
            >
              <FolderOpen size={20} />
            </div>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
              {uiLang === "en" ? "No projects yet." : "Belum ada proyek."}
            </p>
            <button
              onClick={openCreate}
              className="btn-secondary"
              style={{ fontSize: 13, gap: 6 }}
            >
              <Plus size={14} />
              {uiLang === "en" ? "Add first project" : "Tambah proyek pertama"}
            </button>
          </div>
        ) : (
          (projects as Project[]).map((p, idx) => (
            <div
              key={p.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: 12,
                padding: "14px 20px",
                alignItems: "center",
                borderBottom:
                  idx < (projects as Project[]).length - 1
                    ? "1px solid var(--color-border)"
                    : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(59,130,246,0.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.title?.en}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {p.slug}
                </p>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {(p.tech_stack || []).slice(0, 3).map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 7px",
                      borderRadius: 999,
                      background: "rgba(59,130,246,0.08)",
                      border: "1px solid rgba(59,130,246,0.15)",
                      color: "var(--color-accent-bright)",
                    }}
                  >
                    {t}
                  </span>
                ))}
                {(p.tech_stack || []).length > 3 && (
                  <span
                    style={{ fontSize: 10, color: "var(--color-text-muted)" }}
                  >
                    +{(p.tech_stack || []).length - 3}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {p.is_featured && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(250,204,21,0.1)",
                      border: "1px solid rgba(250,204,21,0.2)",
                      color: "#facc15",
                    }}
                  >
                    {uiLang === "en" ? "Featured" : "Unggulan"}
                  </span>
                )}
                {!p.is_visible && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(148,163,184,0.08)",
                      border: "1px solid rgba(148,163,184,0.2)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {uiLang === "en" ? "Hidden" : "Tersembunyi"}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {p.live_demo_url && (
                  <a
                    href={p.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: 7,
                      borderRadius: 7,
                      border: "1px solid var(--color-border)",
                      display: "flex",
                      alignItems: "center",
                      color: "var(--color-text-muted)",
                      textDecoration: "none",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-accent-bright)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-text-muted)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "var(--color-border)";
                    }}
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
                {p.repo_url && (
                  <a
                    href={p.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: 7,
                      borderRadius: 7,
                      border: "1px solid var(--color-border)",
                      display: "flex",
                      alignItems: "center",
                      color: "var(--color-text-muted)",
                      textDecoration: "none",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-accent-bright)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-text-muted)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "var(--color-border)";
                    }}
                  >
                    <FaGithub size={12} />
                  </a>
                )}
                <button
                  onClick={() => openEdit(p.id!)}
                  style={{
                    padding: 7,
                    borderRadius: 7,
                    border: "1px solid var(--color-border)",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "var(--color-text-muted)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-accent-bright)";
                    e.currentTarget.style.borderColor = "var(--color-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-text-muted)";
                    e.currentTarget.style.borderColor = "var(--color-border)";
                  }}
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        uiLang === "en"
                          ? "Delete this project?"
                          : "Hapus proyek ini?",
                      )
                    )
                      deleteM.mutate(p.id!);
                  }}
                  style={{
                    padding: 7,
                    borderRadius: 7,
                    border: "1px solid var(--color-border)",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "var(--color-text-muted)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f87171";
                    e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-text-muted)";
                    e.currentTarget.style.borderColor = "var(--color-border)";
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
