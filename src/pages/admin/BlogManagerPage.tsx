import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, BookOpen } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

interface BlogPost {
  id: string;
  slug: string;
  title: { en: string; id: string };
  status: string;
  is_featured: boolean;
  is_visible: boolean;
  published_at?: string;
  created_at: string;
  tags: string[];
}

interface BlogPostForm {
  slug: string;
  title: { en: string; id: string };
  excerpt: { en: string; id: string };
  content: { en: string; id: string };
  cover_image_url: string;
  tags: string[];
  status: string;
  is_featured: boolean;
  is_visible: boolean;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  og_image_url: string;
}

const BLANK: BlogPostForm = {
  slug: "",
  title: { en: "", id: "" },
  excerpt: { en: "", id: "" },
  content: { en: "", id: "" },
  cover_image_url: "",
  tags: [],
  status: "draft",
  is_featured: false,
  is_visible: true,
  published_at: null,
  meta_title: "",
  meta_description: "",
  og_image_url: "",
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

export default function BlogManagerPage() {
  const qc = useQueryClient();
  const { lang: uiLang } = useLanguageStore();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: adminAPI.getBlogPosts,
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(BLANK);
  const [tagInput, setTagInput] = useState("");
  const [contentLang, setContentLang] = useState<"en" | "id">("en");

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
    qc.invalidateQueries({ queryKey: ["blog"] });
  };

  const createM = useMutation({
    mutationFn: adminAPI.createBlogPost,
    onSuccess: () => {
      invalidate();
      toast.success(uiLang === "en" ? "Post created" : "Post dibuat");
      setEditing(null);
    },
    onError: () => toast.error("Failed"),
  });
  const updateM = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogPostForm }) =>
      adminAPI.updateBlogPost(id, data),
    onSuccess: () => {
      invalidate();
      toast.success(uiLang === "en" ? "Updated" : "Diperbarui");
      setEditing(null);
    },
  });
  const deleteM = useMutation({
    mutationFn: adminAPI.deleteBlogPost,
    onSuccess: () => {
      invalidate();
      toast.success(uiLang === "en" ? "Deleted" : "Dihapus");
    },
  });

  const openEdit = async (id: string) => {
    try {
      const data = await adminAPI.getBlogPost(id);
      setForm(data as BlogPostForm);
      setEditing(id);
    } catch {
      toast.error("Failed to load post");
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
  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((p) => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };
  const removeTag = (tag: string) =>
    setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));

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
            {uiLang === "en" ? "Blog Manager" : "Manajer Blog"}
          </h1>
          <p className="admin-page-subtitle">
            {uiLang === "en"
              ? "Create and manage blog posts"
              : "Buat dan kelola postingan blog"}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ gap: 6 }}>
          <Plus size={15} />
          {uiLang === "en" ? "New Post" : "Post Baru"}
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
                    ? "New Post"
                    : "Post Baru"
                  : uiLang === "en"
                    ? "Edit Post"
                    : "Edit Post"}
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
                    placeholder="my-post-slug"
                  />
                </div>
                <div>
                  <FieldLabel text={uiLang === "en" ? "Status" : "Status"} />
                  <select
                    className="input-cyber"
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, status: e.target.value }))
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">
                      {uiLang === "en" ? "Published" : "Dipublikasi"}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <FieldLabel
                  text={`${uiLang === "en" ? "Title" : "Judul"} (${contentLang.toUpperCase()})`}
                />
                <input
                  className="input-cyber"
                  value={form.title[contentLang]}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      title: { ...p.title, [contentLang]: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <FieldLabel
                  text={`${uiLang === "en" ? "Excerpt" : "Ringkasan"} (${contentLang.toUpperCase()})`}
                />
                <textarea
                  className="input-cyber"
                  rows={2}
                  style={{ resize: "vertical" }}
                  value={form.excerpt[contentLang]}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      excerpt: { ...p.excerpt, [contentLang]: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <FieldLabel
                  text={`${uiLang === "en" ? "Content (Markdown)" : "Konten (Markdown)"} (${contentLang.toUpperCase()})`}
                />
                <textarea
                  className="input-cyber"
                  rows={12}
                  style={{
                    resize: "vertical",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                  value={form.content[contentLang]}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      content: { ...p.content, [contentLang]: e.target.value },
                    }))
                  }
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
                    setForm((p) => ({ ...p, cover_image_url: e.target.value }))
                  }
                  placeholder="https://..."
                />
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
                      uiLang === "en"
                        ? "Add tag and press Enter"
                        : "Tambah tag dan tekan Enter"
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
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
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
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
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
                  label={uiLang === "en" ? "Featured post" : "Post unggulan"}
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
                      ? "Save Post"
                      : "Simpan Post"}
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

      {/* Posts list */}
      <div style={cardStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto auto auto",
            gap: 12,
            padding: "10px 20px",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
          }}
        >
          {[
            uiLang === "en" ? "Title" : "Judul",
            uiLang === "en" ? "Status" : "Status",
            "Tags",
            uiLang === "en" ? "Date" : "Tanggal",
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

        {(posts as BlogPost[]).length === 0 ? (
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
              <BookOpen size={20} />
            </div>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
              {uiLang === "en"
                ? "No blog posts yet."
                : "Belum ada postingan blog."}
            </p>
            <button
              onClick={openCreate}
              className="btn-secondary"
              style={{ fontSize: 13, gap: 6 }}
            >
              <Plus size={14} />
              {uiLang === "en" ? "Create first post" : "Buat post pertama"}
            </button>
          </div>
        ) : (
          (posts as BlogPost[]).map((post, idx) => (
            <div
              key={post.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto auto",
                gap: 12,
                padding: "14px 20px",
                alignItems: "center",
                borderBottom:
                  idx < (posts as BlogPost[]).length - 1
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
                  {post.title?.en || post.slug}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {post.slug}
                </p>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background:
                    post.status === "published"
                      ? "rgba(34,197,94,0.08)"
                      : "rgba(148,163,184,0.08)",
                  border: `1px solid ${post.status === "published" ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)"}`,
                  color:
                    post.status === "published"
                      ? "#4ade80"
                      : "var(--color-text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {post.status === "published"
                  ? uiLang === "en"
                    ? "Published"
                    : "Dipublikasi"
                  : "Draft"}
              </span>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {(post.tags || []).slice(0, 2).map((t) => (
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
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {post.created_at?.slice(0, 10)}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => openEdit(post.id)}
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
                          ? "Delete this post?"
                          : "Hapus post ini?",
                      )
                    )
                      deleteM.mutate(post.id);
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
