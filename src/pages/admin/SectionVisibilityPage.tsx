import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface Section {
  id: string;
  section_key: string;
  label: string;
  is_visible: boolean;
}

export default function SectionVisibilityPage() {
  const qc = useQueryClient();
  const { data: sections, isLoading } = useQuery({
    queryKey: ["admin-sections"],
    queryFn: adminAPI.getSections,
  });

  const mutation = useMutation({
    mutationFn: ({ key, visible }: { key: string; visible: boolean }) =>
      adminAPI.updateSection(key, { is_visible: visible }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-sections"] });
      toast.success("Section updated");
    },
    onError: () => toast.error("Failed to update section"),
  });

  if (isLoading) return <div className="skeleton h-96 rounded-xl" />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          Section Visibility
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Control which sections appear on your public site. Blog page toggle
          affects the entire blog feature.
        </p>
      </div>
      <div className="card-glass divide-y divide-border overflow-hidden">
        {((sections as Section[]) || []).map((section) => (
          <div
            key={section.id}
            className="flex items-center justify-between p-5"
          >
            <div className="flex items-center gap-3">
              {section.is_visible ? (
                <Eye size={16} className="text-accent" />
              ) : (
                <EyeOff size={16} className="text-text-muted" />
              )}
              <div>
                <p className="font-medium text-sm text-text-primary">
                  {section.label}
                </p>
                <p className="text-xs text-text-muted font-mono">
                  {section.section_key}
                </p>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-xs text-text-muted">
                {section.is_visible ? "Visible" : "Hidden"}
              </span>
              <div
                className={`relative w-10 h-5 rounded-full transition-colors ${section.is_visible ? "bg-accent" : "bg-border"}`}
                onClick={() =>
                  mutation.mutate({
                    key: section.section_key,
                    visible: !section.is_visible,
                  })
                }
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${section.is_visible ? "translate-x-5" : "translate-x-0"}`}
                />
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
