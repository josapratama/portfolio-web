import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ExternalLink, Github } from "lucide-react";

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

const BLANK_PROJECT: Omit<Project, "id"> & { id?: string } = {
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

export default function ProjectsManagerPage() {
  const qc = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: adminAPI.getProjects,
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(BLANK_PROJECT);
  const [langTab, setLangTab] = useState<"en" | "id">("en");
  const [techInput, setTechInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const createM = useMutation({
    mutationFn: adminAPI.createProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Created");
      setEditing(null);
    },
  });
  const updateM = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Project }) =>
      adminAPI.updateProject(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Updated");
      setEditing(null);
    },
  });
  const deleteM = useMutation({
    mutationFn: adminAPI.deleteProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Deleted");
    },
  });

  const openEdit = async (id: string) => {
    try {
      const d = await adminAPI.getProject(id);
      setForm(d as Project);
      setEditing(id);
    } catch {
      toast.error("Failed");
    }
  };
  const openCreate = () => {
    setForm(BLANK_PROJECT);
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
    setForm((p) => ({
      ...p,
      tech_stack: p.tech_stack.filter((x: string) => x !== t),
    }));
  const addTag = () => {
    if (tagInput.trim() && !form.tags?.includes(tagInput.trim())) {
      setForm((p) => ({
        ...p,
        tags: [...(p.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };
  const removeTag = (t: string) =>
    setForm((p) => ({
      ...p,
      tags: p.tags.filter((x: string) => x !== t),
    }));
  type LocKey = "title" | "short_description" | "full_description" | "role";
  const setLoc = (key: LocKey, val: string) =>
    setForm((p) => ({ ...p, [key]: { ...p[key], [langTab]: val } }));

  if (isLoading) return <div className="skeleton h-96 rounded-xl" />;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Projects Manager
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage portfolio projects
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> New Project
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 overflow-y-auto p-3 sm:p-4 flex items-start justify-center">
          <div className="card-glass w-full max-w-3xl p-5 sm:p-8 my-4 sm:my-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl text-text-primary">
                {editing === "new" ? "New" : "Edit"} Project
              </h2>
              <div className="flex gap-2">
                {(["en", "id"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLangTab(l)}
                    className={
                      langTab === l ? "tag" : "text-xs text-text-muted"
                    }
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                  Slug
                </label>
                <input
                  className="input-cyber"
                  value={form.slug || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, slug: e.target.value }))
                  }
                  placeholder="my-project"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                  Cover Image URL
                </label>
                <input
                  className="input-cyber"
                  value={form.cover_image_url || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      cover_image_url: e.target.value,
                    }))
                  }
                  type="url"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Title ({langTab.toUpperCase()})
              </label>
              <input
                className="input-cyber"
                value={form.title?.[langTab] || ""}
                onChange={(e) => setLoc("title", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Short Description ({langTab.toUpperCase()})
              </label>
              <textarea
                className="input-cyber resize-y"
                rows={2}
                value={form.short_description?.[langTab] || ""}
                onChange={(e) => setLoc("short_description", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Full Description — Markdown ({langTab.toUpperCase()})
              </label>
              <textarea
                className="input-cyber resize-y font-mono text-xs"
                rows={8}
                value={form.full_description?.[langTab] || ""}
                onChange={(e) => setLoc("full_description", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Role ({langTab.toUpperCase()})
              </label>
              <input
                className="input-cyber"
                value={form.role?.[langTab] || ""}
                onChange={(e) => setLoc("role", e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                  Live Demo URL
                </label>
                <input
                  className="input-cyber"
                  value={form.live_demo_url || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      live_demo_url: e.target.value,
                    }))
                  }
                  type="url"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                  Repository URL
                </label>
                <input
                  className="input-cyber"
                  value={form.repo_url || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, repo_url: e.target.value }))
                  }
                  type="url"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Tech Stack
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  className="input-cyber flex-1"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTech())
                  }
                  placeholder="Add tech"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="btn-secondary text-sm px-3"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.tech_stack || []).map((t: string) => (
                  <span key={t} className="tag flex items-center gap-1.5">
                    {t}{" "}
                    <button
                      onClick={() => removeTech(t)}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  className="input-cyber flex-1"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="Add tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-secondary text-sm px-3"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.tags || []).map((t: string) => (
                  <span key={t} className="tag flex items-center gap-1.5">
                    {t}{" "}
                    <button
                      onClick={() => removeTag(t)}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.is_featured}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      is_featured: e.target.checked,
                    }))
                  }
                />{" "}
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.is_visible}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      is_visible: e.target.checked,
                    }))
                  }
                />{" "}
                Visible
              </label>
            </div>

            <div className="flex gap-3 pt-2 border-t border-border">
              <button
                onClick={handleSave}
                disabled={createM.isPending || updateM.isPending}
                className="btn-primary flex-1 justify-center"
              >
                {createM.isPending || updateM.isPending
                  ? "Saving..."
                  : "Save Project"}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card-glass overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b border-border">
              {["Project", "Tech Stack", "Featured", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold uppercase tracking-widest text-text-muted p-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(projects as Project[]).map((p) => (
              <tr key={p.id} className="hover:bg-surface-2 transition-colors">
                <td className="p-4 max-w-xs">
                  <p className="font-medium text-text-primary truncate">
                    {p.title?.en}
                  </p>
                  <p className="text-xs text-text-muted font-mono">{p.slug}</p>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 flex-wrap">
                    {(p.tech_stack || []).slice(0, 3).map((t: string) => (
                      <span key={t} className="tag text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-text-muted">
                  {p.is_featured ? "⭐" : "—"}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {p.live_demo_url && (
                      <a
                        href={p.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded text-text-muted hover:text-accent-bright"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {p.repo_url && (
                      <a
                        href={p.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded text-text-muted hover:text-accent-bright"
                      >
                        <Github size={13} />
                      </a>
                    )}
                    <button
                      onClick={() => openEdit(p.id!)}
                      className="p-2 rounded text-text-muted hover:text-accent-bright hover:bg-surface-2"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deleteM.mutate(p.id!)}
                      className="p-2 rounded text-text-muted hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(projects as Project[]).length === 0 && (
          <p className="text-center py-12 text-sm text-text-muted">
            No projects yet
          </p>
        )}
      </div>
    </div>
  );
}
