import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

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

const BLANK_POST: BlogPostForm = {
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

export default function BlogManagerPage() {
  const qc = useQueryClient();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: adminAPI.getBlogPosts,
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(BLANK_POST);
  const [tagInput, setTagInput] = useState("");
  const [contentLang, setContentLang] = useState<"en" | "id">("en");

  const createM = useMutation({
    mutationFn: adminAPI.createBlogPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Post created");
      setEditing(null);
    },
    onError: () => toast.error("Failed to create"),
  });

  const updateM = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogPostForm }) =>
      adminAPI.updateBlogPost(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Post updated");
      setEditing(null);
    },
  });

  const deleteM = useMutation({
    mutationFn: adminAPI.deleteBlogPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Deleted");
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
    setForm(BLANK_POST);
    setEditing("new");
  };

  const handleSave = () => {
    if (editing === "new") createM.mutate(form);
    else updateM.mutate({ id: editing!, data: form });
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((p) => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) =>
    setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));

  if (isLoading) return <div className="skeleton h-96 rounded-xl" />;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Blog Manager</h1>
          <p className="text-sm text-text-secondary mt-1">
            Create and manage blog posts. Global visibility is controlled in Section Visibility.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> New Post
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 overflow-y-auto p-3 sm:p-4 flex items-start justify-center">
          <div className="card-glass w-full max-w-3xl p-5 sm:p-8 my-4 sm:my-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl text-text-primary">
                {editing === "new" ? "New Post" : "Edit Post"}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setContentLang("en")}
                  className={contentLang === "en" ? "tag" : "text-xs text-text-muted"}
                >EN</button>
                <button
                  onClick={() => setContentLang("id")}
                  className={contentLang === "id" ? "tag" : "text-xs text-text-muted"}
                >ID</button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">Slug</label>
                <input
                  className="input-cyber"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="my-post-slug"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">Status</label>
                <select
                  className="input-cyber"
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Title ({contentLang.toUpperCase()})
              </label>
              <input
                className="input-cyber"
                value={form.title[contentLang]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: { ...p.title, [contentLang]: e.target.value } }))
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Excerpt ({contentLang.toUpperCase()})
              </label>
              <textarea
                className="input-cyber resize-y"
                rows={2}
                value={form.excerpt[contentLang]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, excerpt: { ...p.excerpt, [contentLang]: e.target.value } }))
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Content — Markdown ({contentLang.toUpperCase()})
              </label>
              <textarea
                className="input-cyber resize-y font-mono text-xs"
                rows={12}
                value={form.content[contentLang]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: { ...p.content, [contentLang]: e.target.value } }))
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">Cover Image URL</label>
              <input
                className="input-cyber"
                type="url"
                value={form.cover_image_url}
                onChange={(e) => setForm((p) => ({ ...p, cover_image_url: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="input-cyber flex-1"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tag and press Enter"
                />
                <button type="button" onClick={addTag} className="btn-secondary text-sm px-3">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="tag flex items-center gap-1.5">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-text-muted hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))}
                /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_visible}
                  onChange={(e) => setForm((p) => ({ ...p, is_visible: e.target.checked }))}
                /> Visible
              </label>
            </div>

            <div className="flex gap-3 pt-2 border-t border-border">
              <button
                onClick={handleSave}
                disabled={createM.isPending || updateM.isPending}
                className="btn-primary flex-1 justify-center"
              >
                {createM.isPending || updateM.isPending ? "Saving..." : "Save Post"}
              </button>
              <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="card-glass overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              {["Title", "Status", "Featured", "Tags", "Date", ""].map((h) => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-widest text-text-muted p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(posts as BlogPost[]).map((post) => (
              <tr key={post.id} className="hover:bg-surface-2 transition-colors">
                <td className="p-4 max-w-xs">
                  <p className="font-medium text-text-primary truncate">{post.title?.en || post.slug}</p>
                  <p className="text-xs text-text-muted font-mono">{post.slug}</p>
                </td>
                <td className="p-4">
                  <span className={`tag ${post.status === "published" ? "text-green-400 border-green-500/30 bg-green-500/10" : ""}`}>
                    {post.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-text-muted">{post.is_featured ? "⭐" : "—"}</span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 flex-wrap">
                    {(post.tags || []).slice(0, 2).map((t) => (
                      <span key={t} className="tag text-xs">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-xs text-text-muted whitespace-nowrap">{post.created_at?.slice(0, 10)}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(post.id)}
                      className="p-2 rounded text-text-muted hover:text-accent-bright hover:bg-surface-2 transition-all"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deleteM.mutate(post.id)}
                      className="p-2 rounded text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(posts as BlogPost[]).length === 0 && (
          <p className="text-center py-12 text-sm text-text-muted">No blog posts yet. Create your first one!</p>
        )}
      </div>
    </div>
  );
}
