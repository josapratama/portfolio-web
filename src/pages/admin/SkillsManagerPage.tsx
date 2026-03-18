import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { toast } from "sonner";
import { Plus, Trash2, ChevronDown, ChevronUp, Star, X } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import type { SkillCategory, Skill } from "@/types";

const LEVELS = ["beginner", "intermediate", "advanced", "expert"];

interface SkillForm {
  name_en: string;
  name_id: string;
  proficiency_level: string;
  is_featured: boolean;
  category_id: string;
}

const BLANK: SkillForm = {
  name_en: "",
  name_id: "",
  proficiency_level: "advanced",
  is_featured: false,
  category_id: "",
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

export default function SkillsManagerPage() {
  const qc = useQueryClient();
  const { lang } = useLanguageStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SkillForm>(BLANK);
  const [newCatName, setNewCatName] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data: catsRaw, isLoading } = useQuery({
    queryKey: ["admin-skill-categories"],
    queryFn: () => adminAPI.getSkillCategories() as Promise<SkillCategory[]>,
    staleTime: 0,
  });

  const parseLocalized = (val: unknown): { en: string; id: string } => {
    if (!val) return { en: "", id: "" };
    if (typeof val === "object") return val as { en: string; id: string };
    try {
      return JSON.parse(val as string);
    } catch {
      return { en: val as string, id: val as string };
    }
  };

  const categories: SkillCategory[] = (catsRaw ?? []).map((cat) => ({
    ...cat,
    name: parseLocalized(cat.name),
    skills: (cat.skills ?? []).map((s) => ({
      ...s,
      name: parseLocalized(s.name),
    })),
  }));

  // Auto-expand all categories on first load
  useEffect(() => {
    if (categories.length > 0) {
      setExpanded((prev) => {
        const next = { ...prev };
        categories.forEach((c) => {
          if (!(c.id in next)) next[c.id] = true;
        });
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catsRaw]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-skill-categories"] });
    qc.invalidateQueries({ queryKey: ["skills"] });
  };

  const createSkill = useMutation({
    mutationFn: (data: object) => adminAPI.createSkill(data),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Skill added" : "Skill ditambahkan");
      setForm(BLANK);
      setShowForm(false);
    },
    onError: () =>
      toast.error(
        lang === "en" ? "Failed to add skill" : "Gagal menambahkan skill",
      ),
  });

  const deleteSkill = useMutation({
    mutationFn: (id: string) => adminAPI.deleteSkill(id),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Skill deleted" : "Skill dihapus");
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, val }: { id: string; val: boolean }) =>
      adminAPI.updateSkill(id, { is_featured: val }),
    onSuccess: () => invalidate(),
  });

  const createCategory = useMutation({
    mutationFn: (name: string) =>
      adminAPI.createSkillCategory({ name: { en: name, id: name } }),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Category created" : "Kategori dibuat");
      setNewCatName("");
    },
    onError: () =>
      toast.error(
        lang === "en" ? "Failed to create category" : "Gagal membuat kategori",
      ),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => adminAPI.deleteSkillCategory(id),
    onSuccess: () => {
      invalidate();
      toast.success(lang === "en" ? "Category deleted" : "Kategori dihapus");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name_en || !form.category_id) return;
    createSkill.mutate({
      name: { en: form.name_en, id: form.name_id || form.name_en },
      proficiency_level: form.proficiency_level,
      is_featured: form.is_featured,
      category_id: form.category_id,
    });
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

  const allCats = categories;

  const cardStyle = {
    background: "var(--color-surface-card)",
    border: "1px solid var(--color-border)",
    borderRadius: 16,
    backdropFilter: "blur(16px)",
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {lang === "en" ? "Skills Manager" : "Manajer Keahlian"}
          </h1>
          <p className="admin-page-subtitle">
            {lang === "en"
              ? "Manage skill categories and individual skills"
              : "Kelola kategori dan keahlian individual"}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
            style={{ gap: 6 }}
          >
            <Plus size={15} />
            {lang === "en" ? "Add Skill" : "Tambah Skill"}
          </button>
        )}
      </div>

      {/* Add Skill Form */}
      {showForm && (
        <div style={{ ...cardStyle, padding: "clamp(20px, 3vw, 28px)" }}>
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
              {lang === "en" ? "New Skill" : "Skill Baru"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(BLANK);
              }}
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
              <div>
                <FieldLabel
                  text={`${lang === "en" ? "Name" : "Nama"} (EN) *`}
                />
                <input
                  className="input-cyber"
                  value={form.name_en}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name_en: e.target.value }))
                  }
                  placeholder="React"
                  required
                />
              </div>
              <div>
                <FieldLabel text={`${lang === "en" ? "Name" : "Nama"} (ID)`} />
                <input
                  className="input-cyber"
                  value={form.name_id}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name_id: e.target.value }))
                  }
                  placeholder={
                    lang === "en" ? "Same if identical" : "Sama jika identik"
                  }
                />
              </div>
              <div>
                <FieldLabel
                  text={`${lang === "en" ? "Category" : "Kategori"} *`}
                />
                <select
                  className="input-cyber"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category_id: e.target.value }))
                  }
                  required
                  style={{ cursor: "pointer" }}
                >
                  <option value="">
                    {lang === "en" ? "Select category..." : "Pilih kategori..."}
                  </option>
                  {allCats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name.en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel text={lang === "en" ? "Level" : "Level"} />
                <select
                  className="input-cyber"
                  value={form.proficiency_level}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      proficiency_level: e.target.value,
                    }))
                  }
                  style={{ cursor: "pointer" }}
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Toggle
                checked={form.is_featured}
                onChange={(v) => setForm((p) => ({ ...p, is_featured: v }))}
                label={
                  lang === "en" ? "Featured on homepage" : "Tampil di beranda"
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
                type="submit"
                disabled={createSkill.isPending}
                className="btn-primary"
              >
                {createSkill.isPending
                  ? lang === "en"
                    ? "Saving..."
                    : "Menyimpan..."
                  : lang === "en"
                    ? "Add Skill"
                    : "Tambah Skill"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(BLANK);
                }}
                className="btn-secondary"
              >
                {lang === "en" ? "Cancel" : "Batal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories + Skills */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allCats.length === 0 ? (
          <div
            style={{
              ...cardStyle,
              padding: "48px 24px",
              textAlign: "center",
              color: "var(--color-text-muted)",
              fontSize: 14,
            }}
          >
            {lang === "en"
              ? "No categories yet. Add one below."
              : "Belum ada kategori. Tambahkan di bawah."}
          </div>
        ) : (
          allCats.map((cat) => (
            <div key={cat.id} style={cardStyle}>
              {/* Category header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  cursor: "pointer",
                  background: expanded[cat.id]
                    ? "rgba(59,130,246,0.04)"
                    : "transparent",
                  transition: "background 0.15s",
                }}
                onClick={() =>
                  setExpanded((p) => ({ ...p, [cat.id]: !p[cat.id] }))
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {expanded[cat.id] ? (
                    <ChevronUp
                      size={15}
                      style={{ color: "var(--color-text-muted)" }}
                    />
                  ) : (
                    <ChevronDown
                      size={15}
                      style={{ color: "var(--color-text-muted)" }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {cat.name.en}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(59,130,246,0.1)",
                      border: "1px solid rgba(59,130,246,0.2)",
                      color: "var(--color-accent-bright)",
                    }}
                  >
                    {cat.skills.length}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm(
                        lang === "en"
                          ? "Delete this category and all its skills?"
                          : "Hapus kategori ini beserta semua skillnya?",
                      )
                    )
                      deleteCategory.mutate(cat.id);
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
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Skills list */}
              {expanded[cat.id] && (
                <div style={{ borderTop: "1px solid var(--color-border)" }}>
                  {cat.skills.length === 0 ? (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-muted)",
                        padding: "16px 18px",
                        fontStyle: "italic",
                      }}
                    >
                      {lang === "en"
                        ? "No skills in this category"
                        : "Belum ada skill di kategori ini"}
                    </p>
                  ) : (
                    cat.skills.map((skill: Skill, idx: number) => (
                      <div
                        key={skill.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "11px 18px",
                          borderBottom:
                            idx < cat.skills.length - 1
                              ? "1px solid var(--color-border)"
                              : "none",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(59,130,246,0.03)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFeatured.mutate({
                                id: skill.id,
                                val: !skill.is_featured,
                              });
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: 2,
                              color: skill.is_featured
                                ? "#facc15"
                                : "var(--color-text-muted)",
                              display: "flex",
                              alignItems: "center",
                              transition: "color 0.15s",
                            }}
                            title={
                              lang === "en"
                                ? "Toggle featured"
                                : "Toggle unggulan"
                            }
                          >
                            <Star
                              size={13}
                              fill={skill.is_featured ? "currentColor" : "none"}
                            />
                          </button>
                          <span
                            style={{
                              fontSize: 13,
                              color: "var(--color-text-primary)",
                            }}
                          >
                            {skill.name.en}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: "rgba(59,130,246,0.08)",
                              border: "1px solid rgba(59,130,246,0.15)",
                              color: "var(--color-accent-bright)",
                              textTransform: "capitalize",
                            }}
                          >
                            {skill.proficiency_level}
                          </span>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  lang === "en"
                                    ? "Delete this skill?"
                                    : "Hapus skill ini?",
                                )
                              )
                                deleteSkill.mutate(skill.id);
                            }}
                            style={{
                              padding: 6,
                              borderRadius: 6,
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
                              e.currentTarget.style.color =
                                "var(--color-text-muted)";
                              e.currentTarget.style.borderColor =
                                "var(--color-border)";
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Category */}
      <div
        style={{
          background: "var(--color-surface-card)",
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          backdropFilter: "blur(16px)",
          padding: "clamp(16px, 2vw, 20px)",
        }}
      >
        <FieldLabel text={lang === "en" ? "New Category" : "Kategori Baru"} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
          <input
            className="input-cyber"
            style={{ flex: 1, minWidth: 200 }}
            placeholder={
              lang === "en"
                ? "e.g. Mobile, DevOps..."
                : "mis. Mobile, DevOps..."
            }
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newCatName.trim()) {
                e.preventDefault();
                const trimmed = newCatName.trim();
                const exists = categories.some(
                  (c) => c.name.en.toLowerCase() === trimmed.toLowerCase(),
                );
                if (exists) {
                  toast.error(
                    lang === "en"
                      ? "Category already exists"
                      : "Kategori sudah ada",
                  );
                  return;
                }
                createCategory.mutate(trimmed);
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              const trimmed = newCatName.trim();
              if (!trimmed) return;
              const exists = categories.some(
                (c) => c.name.en.toLowerCase() === trimmed.toLowerCase(),
              );
              if (exists) {
                toast.error(
                  lang === "en"
                    ? "Category already exists"
                    : "Kategori sudah ada",
                );
                return;
              }
              createCategory.mutate(trimmed);
            }}
            disabled={createCategory.isPending || !newCatName.trim()}
            className="btn-secondary"
            style={{ gap: 6, flexShrink: 0 }}
          >
            <Plus size={14} />
            {createCategory.isPending
              ? lang === "en"
                ? "Adding..."
                : "Menambahkan..."
              : lang === "en"
                ? "Add Category"
                : "Tambah Kategori"}
          </button>
        </div>
      </div>
    </div>
  );
}
