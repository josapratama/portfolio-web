import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  ExternalLink,
  Pencil,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import type { SocialLink } from "@/types";

const PLATFORMS = [
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "email",
  "whatsapp",
  "website",
  "youtube",
  "tiktok",
  "other",
];

const PLATFORM_COLORS: Record<string, string> = {
  github: "#6e7681",
  linkedin: "#0a66c2",
  twitter: "#1d9bf0",
  instagram: "#e1306c",
  email: "#ea4335",
  whatsapp: "#25d366",
  youtube: "#ff0000",
  tiktok: "#010101",
  website: "#3b82f6",
  other: "#8b5cf6",
};

interface LinkForm {
  platform: string;
  url: string;
  label: string;
  is_visible: boolean;
  open_in_new_tab: boolean;
}

const BLANK: LinkForm = {
  platform: "github",
  url: "",
  label: "",
  is_visible: true,
  open_in_new_tab: true,
};

export default function SocialLinksManagerPage() {
  const qc = useQueryClient();
  const { lang } = useLanguageStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<LinkForm>(BLANK);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: links = [], isLoading } = useQuery<SocialLink[]>({
    queryKey: ["admin-social-links"],
    queryFn: () => adminAPI.getSocialLinks() as Promise<SocialLink[]>,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-social-links"] });
    qc.invalidateQueries({ queryKey: ["social-links"] }); // refresh public cache too
  };

  const createLink = useMutation({
    mutationFn: (data: object) => adminAPI.createSocialLink(data),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Link added" : "Link ditambahkan");
      setForm(BLANK);
      setShowForm(false);
    },
    onError: () =>
      toast.error(lang === "en" ? "Failed to add" : "Gagal menambahkan"),
  });

  const updateLink = useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) =>
      adminAPI.updateSocialLink(id, data),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Link updated" : "Link diperbarui");
      setEditId(null);
      setShowForm(false);
    },
    onError: () =>
      toast.error(lang === "en" ? "Failed to update" : "Gagal memperbarui"),
  });

  const deleteLink = useMutation({
    mutationFn: (id: string) => adminAPI.deleteSocialLink(id),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Link deleted" : "Link dihapus");
    },
    onError: () =>
      toast.error(lang === "en" ? "Failed to delete" : "Gagal menghapus"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url) return;
    const label =
      form.label ||
      form.platform.charAt(0).toUpperCase() + form.platform.slice(1);
    const payload = { ...form, label };
    if (editId) {
      updateLink.mutate({ id: editId, data: payload });
    } else {
      createLink.mutate(payload);
    }
  };

  const startEdit = (link: SocialLink) => {
    setForm({
      platform: link.platform,
      url: link.url,
      label: link.label,
      is_visible: link.is_visible ?? true,
      open_in_new_tab: link.open_in_new_tab,
    });
    setEditId(link.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(BLANK);
  };

  if (isLoading)
    return (
      <div className="admin-page">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 64, borderRadius: 12 }}
          />
        ))}
      </div>
    );

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {lang === "en" ? "Social Links" : "Tautan Sosial"}
          </h1>
          <p className="admin-page-subtitle">
            {lang === "en"
              ? "Manage your social media and contact links"
              : "Kelola tautan media sosial dan kontak Anda"}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setForm(BLANK);
              setEditId(null);
              setShowForm(true);
            }}
            className="btn-primary"
            style={{ gap: 6 }}
          >
            <Plus size={15} />
            {lang === "en" ? "Add Link" : "Tambah Link"}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div
          style={{
            background: "var(--color-surface-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 16,
            padding: "clamp(20px, 3vw, 28px)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--color-text-primary)",
              }}
            >
              {editId
                ? lang === "en"
                  ? "Edit Link"
                  : "Edit Link"
                : lang === "en"
                  ? "New Social Link"
                  : "Link Sosial Baru"}
            </h2>
            <button
              type="button"
              onClick={cancelForm}
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
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
                marginBottom: 16,
              }}
            >
              {/* Platform */}
              <div>
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
                  {lang === "en" ? "Platform" : "Platform"}
                </label>
                <select
                  className="input-cyber"
                  value={form.platform}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, platform: e.target.value }))
                  }
                  style={{ cursor: "pointer" }}
                >
                  {PLATFORMS.map((pl) => (
                    <option key={pl} value={pl}>
                      {pl.charAt(0).toUpperCase() + pl.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Label */}
              <div>
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
                  {lang === "en" ? "Label" : "Label"}
                </label>
                <input
                  className="input-cyber"
                  value={form.label}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, label: e.target.value }))
                  }
                  placeholder={lang === "en" ? "e.g. GitHub" : "mis. GitHub"}
                />
              </div>

              {/* URL */}
              <div style={{ gridColumn: "1 / -1" }}>
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
                  URL *
                </label>
                <input
                  className="input-cyber"
                  value={form.url}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, url: e.target.value }))
                  }
                  placeholder="https://github.com/username"
                  required
                />
              </div>
            </div>

            {/* Toggles */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() =>
                    setForm((p) => ({ ...p, is_visible: !p.is_visible }))
                  }
                  style={{
                    position: "relative",
                    width: 36,
                    height: 20,
                    borderRadius: 999,
                    background: form.is_visible
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                    transition: "background 0.2s",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: form.is_visible ? 18 : 2,
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
                  style={{ fontSize: 13, color: "var(--color-text-secondary)" }}
                >
                  {lang === "en" ? "Visible on site" : "Tampil di situs"}
                </span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      open_in_new_tab: !p.open_in_new_tab,
                    }))
                  }
                  style={{
                    position: "relative",
                    width: 36,
                    height: 20,
                    borderRadius: 999,
                    background: form.open_in_new_tab
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                    transition: "background 0.2s",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: form.open_in_new_tab ? 18 : 2,
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
                  style={{ fontSize: 13, color: "var(--color-text-secondary)" }}
                >
                  {lang === "en" ? "Open in new tab" : "Buka di tab baru"}
                </span>
              </label>
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
                type="submit"
                disabled={createLink.isPending || updateLink.isPending}
                className="btn-primary"
              >
                {createLink.isPending || updateLink.isPending
                  ? lang === "en"
                    ? "Saving..."
                    : "Menyimpan..."
                  : editId
                    ? lang === "en"
                      ? "Update Link"
                      : "Perbarui Link"
                    : lang === "en"
                      ? "Add Link"
                      : "Tambah Link"}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="btn-secondary"
              >
                {lang === "en" ? "Cancel" : "Batal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links list */}
      <div
        style={{
          background: "var(--color-surface-card)",
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          overflow: "hidden",
          backdropFilter: "blur(16px)",
        }}
      >
        {links.length === 0 ? (
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
              <ExternalLink size={20} />
            </div>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
              {lang === "en"
                ? "No social links yet."
                : "Belum ada tautan sosial."}
            </p>
            <button
              onClick={() => {
                setForm(BLANK);
                setEditId(null);
                setShowForm(true);
              }}
              className="btn-secondary"
              style={{ fontSize: 13 }}
            >
              <Plus size={14} />
              {lang === "en" ? "Add your first link" : "Tambah link pertama"}
            </button>
          </div>
        ) : (
          <div>
            {/* Table header */}
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
                "Platform / URL",
                lang === "en" ? "Visible" : "Tampil",
                "",
                "",
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

            {links.map((link, idx) => {
              const color =
                PLATFORM_COLORS[link.platform.toLowerCase()] || "#8b5cf6";
              const isVis = link.is_visible ?? true;
              return (
                <div
                  key={link.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto auto auto",
                    gap: 12,
                    padding: "14px 20px",
                    alignItems: "center",
                    borderBottom:
                      idx < links.length - 1
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
                  {/* Platform + URL */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: `${color}18`,
                        border: `1px solid ${color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 11,
                        fontWeight: 800,
                        color,
                        textTransform: "uppercase",
                      }}
                    >
                      {link.platform.slice(0, 2)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                          marginBottom: 2,
                        }}
                      >
                        {link.label}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--color-text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {link.url}
                      </p>
                    </div>
                  </div>

                  {/* Visibility badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                      background: isVis
                        ? "rgba(34,197,94,0.08)"
                        : "rgba(148,163,184,0.08)",
                      border: `1px solid ${isVis ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)"}`,
                      color: isVis ? "#4ade80" : "var(--color-text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isVis ? <Eye size={10} /> : <EyeOff size={10} />}
                    {isVis
                      ? lang === "en"
                        ? "Visible"
                        : "Tampil"
                      : lang === "en"
                        ? "Hidden"
                        : "Tersembunyi"}
                  </div>

                  {/* Open link */}
                  <a
                    href={link.url}
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
                    <ExternalLink size={13} />
                  </a>

                  {/* Edit */}
                  <button
                    onClick={() => startEdit(link)}
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
                      e.currentTarget.style.color =
                        "var(--color-accent-bright)";
                      e.currentTarget.style.borderColor = "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--color-text-muted)";
                      e.currentTarget.style.borderColor = "var(--color-border)";
                    }}
                  >
                    <Pencil size={13} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          lang === "en"
                            ? "Delete this link?"
                            : "Hapus link ini?",
                        )
                      )
                        deleteLink.mutate(link.id);
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
                      e.currentTarget.style.borderColor =
                        "rgba(248,113,113,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--color-text-muted)";
                      e.currentTarget.style.borderColor = "var(--color-border)";
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info note */}
      <p
        style={{
          fontSize: 12,
          color: "var(--color-text-muted)",
          marginTop: -8,
        }}
      >
        {lang === "en"
          ? "Only visible links appear on the public site. Toggle visibility per link above."
          : "Hanya link yang terlihat yang muncul di situs publik. Atur visibilitas per link di atas."}
      </p>
    </div>
  );
}
