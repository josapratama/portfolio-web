import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Link2, ExternalLink } from "lucide-react";

interface NavItem {
  id: string;
  label: { en: string; id: string };
  href: string;
  is_external: boolean;
  is_visible: boolean;
  sort_order: number;
}

const BLANK: Partial<NavItem> = {
  label: { en: "", id: "" },
  href: "",
  is_external: false,
  is_visible: true,
  sort_order: 0,
};

export default function NavigationPage() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-navigation"],
    queryFn: adminAPI.getNavigation,
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<NavItem>>(BLANK);

  const createMutation = useMutation({
    mutationFn: (data: Partial<NavItem>) => adminAPI.createNavItem(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-navigation"] });
      toast.success("Item created");
      setEditing(null);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NavItem> }) =>
      adminAPI.updateNavItem(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-navigation"] });
      toast.success("Item updated");
      setEditing(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: adminAPI.deleteNavItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-navigation"] });
      toast.success("Deleted");
    },
  });

  const openCreate = () => {
    setForm(BLANK);
    setEditing("new");
  };
  const openEdit = (item: NavItem) => {
    setForm({ ...item });
    setEditing(item.id);
  };
  const handleSave = () => {
    if (editing === "new") createMutation.mutate(form);
    else updateMutation.mutate({ id: editing!, data: form });
  };

  if (isLoading) return <div className="skeleton h-64 rounded-xl" />;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Navigation</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage public site navigation links
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Form modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="card-glass w-full max-w-md p-5 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-text-primary">
              {editing === "new" ? "Add" : "Edit"} Nav Item
            </h2>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Label (EN)
              </label>
              <input
                className="input-cyber"
                value={form.label?.en || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    label: { en: e.target.value, id: p.label?.id ?? "" },
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Label (ID)
              </label>
              <input
                className="input-cyber"
                value={form.label?.id || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    label: { en: p.label?.en ?? "", id: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Href
              </label>
              <input
                className="input-cyber"
                value={form.href || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, href: e.target.value }))
                }
                placeholder="/about"
              />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.is_external}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      is_external: e.target.checked,
                    }))
                  }
                />
                External link
              </label>
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.is_visible}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      is_visible: e.target.checked,
                    }))
                  }
                />
                Visible
              </label>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                Sort Order
              </label>
              <input
                type="number"
                className="input-cyber"
                value={form.sort_order || 0}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    sort_order: parseInt(e.target.value),
                  }))
                }
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="btn-primary flex-1 justify-center"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(null)}
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card-glass divide-y divide-border">
        {(items as NavItem[]).map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {item.is_external ? (
                <ExternalLink size={14} className="text-text-muted" />
              ) : (
                <Link2 size={14} className="text-accent" />
              )}
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {item.label?.en}
                </p>
                <p className="text-xs text-text-muted font-mono">{item.href}</p>
              </div>
              {!item.is_visible && (
                <span className="tag text-xs text-text-muted">Hidden</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(item)}
                className="p-2 rounded text-text-muted hover:text-accent-bright hover:bg-surface-2 transition-all"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => deleteMutation.mutate(item.id)}
                className="p-2 rounded text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {(items as NavItem[]).length === 0 && (
          <p className="text-center py-10 text-sm text-text-muted">
            No nav items yet
          </p>
        )}
      </div>
    </div>
  );
}
