import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/api/admin";
import { useState } from "react";
import { toast } from "sonner";

type FormData = Record<string, unknown>;

// Safe accessors
const loc = (v: FormData, key: string, lang: string): string => {
  const f = v[key];
  if (f && typeof f === "object")
    return ((f as Record<string, unknown>)[lang] as string) ?? "";
  return "";
};
const str = (v: FormData, key: string): string => {
  const val = v[key];
  return typeof val === "string" ? val : "";
};
const bool = (v: FormData, key: string): boolean => !!v[key];

function useAdminForm(
  queryKey: string[],
  queryFn: () => Promise<unknown>,
  mutateFn: (data: FormData) => Promise<unknown>,
) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey, queryFn });
  const [local, setLocal] = useState<FormData>({});
  const values: FormData = { ...(data as FormData), ...local };
  const mutation = useMutation({
    mutationFn: mutateFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Saved!");
    },
    onError: () => toast.error("Failed to save"),
  });
  const handleChange = (key: string, value: unknown) =>
    setLocal((p) => ({ ...p, [key]: value }));
  const handleLocChange = (key: string, lang: string, value: string) =>
    setLocal((p) => ({
      ...p,
      [key]: { ...((p[key] as Record<string, unknown>) ?? {}), [lang]: value },
    }));
  const save = (e?: React.FormEvent) => {
    e?.preventDefault();
    mutation.mutate(values);
  };
  return { values, isLoading, mutation, handleChange, handleLocChange, save };
}

export function HeroAdminPage() {
  const { values, isLoading, mutation, handleChange, handleLocChange, save } =
    useAdminForm(["admin-hero"], adminAPI.getHero, adminAPI.updateHero);
  const [lang, setLang] = useState<"en" | "id">("en");
  if (isLoading) return <div className="skeleton h-96 rounded-xl" />;

  return (
    <form onSubmit={save}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Hero Section</h1>
          <p className="text-sm text-text-secondary mt-1">
            The first thing visitors see
          </p>
        </div>
        <div className="flex gap-2">
          {(["en", "id"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={lang === l ? "tag" : "text-xs text-text-muted"}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="card-glass p-8 max-w-2xl space-y-5">
        {[
          { k: "headline", l: "Headline" },
          { k: "subheadline", l: "Subheadline" },
          { k: "short_intro", l: "Short Intro" },
          { k: "availability_badge", l: "Availability Badge" },
        ].map(({ k, l }) => (
          <div key={k}>
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
              {l} ({lang.toUpperCase()})
            </label>
            {k === "short_intro" ? (
              <textarea
                className="input-cyber resize-y"
                rows={3}
                value={loc(values, k, lang)}
                onChange={(e) => handleLocChange(k, lang, e.target.value)}
              />
            ) : (
              <input
                className="input-cyber"
                value={loc(values, k, lang)}
                onChange={(e) => handleLocChange(k, lang, e.target.value)}
              />
            )}
          </div>
        ))}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
            Profile Image URL
          </label>
          <input
            className="input-cyber"
            type="url"
            value={str(values, "profile_image_url")}
            onChange={(e) => handleChange("profile_image_url", e.target.value)}
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`relative w-10 h-5 rounded-full transition-colors ${bool(values, "show_availability_badge") ? "bg-blue-500" : "bg-border"}`}
            onClick={() =>
              handleChange(
                "show_availability_badge",
                !bool(values, "show_availability_badge"),
              )
            }
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${bool(values, "show_availability_badge") ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
          <span className="text-sm text-text-secondary">
            Show availability badge
          </span>
        </label>
        <div className="pt-2 border-t border-border">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function AboutAdminPage() {
  const { values, isLoading, mutation, handleChange, handleLocChange, save } =
    useAdminForm(["admin-about"], adminAPI.getAbout, adminAPI.updateAbout);
  const [lang, setLang] = useState<"en" | "id">("en");
  if (isLoading) return <div className="skeleton h-96 rounded-xl" />;

  return (
    <form onSubmit={save}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            About Section
          </h1>
        </div>
        <div className="flex gap-2">
          {(["en", "id"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={lang === l ? "tag" : "text-xs text-text-muted"}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="card-glass p-8 max-w-2xl space-y-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
            Short Bio ({lang.toUpperCase()})
          </label>
          <textarea
            className="input-cyber resize-y"
            rows={3}
            value={loc(values, "short_bio", lang)}
            onChange={(e) => handleLocChange("short_bio", lang, e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
            Full Bio — Markdown ({lang.toUpperCase()})
          </label>
          <textarea
            className="input-cyber resize-y font-mono text-xs"
            rows={10}
            value={loc(values, "full_bio", lang)}
            onChange={(e) => handleLocChange("full_bio", lang, e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
            Profile Image URL
          </label>
          <input
            className="input-cyber"
            type="url"
            value={str(values, "profile_image_url")}
            onChange={(e) => handleChange("profile_image_url", e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
            Years of Experience
          </label>
          <input
            className="input-cyber"
            type="number"
            value={(values.years_of_experience as number) || 0}
            onChange={(e) =>
              handleChange("years_of_experience", parseInt(e.target.value))
            }
          />
        </div>
        <div className="pt-2 border-t border-border">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function ResumeAdminPage() {
  const { values, isLoading, mutation, handleChange, handleLocChange, save } =
    useAdminForm(
      ["admin-resume"],
      adminAPI.getResumeSettings,
      adminAPI.updateResumeSettings,
    );
  const [lang, setLang] = useState<"en" | "id">("en");
  if (isLoading) return <div className="skeleton h-96 rounded-xl" />;

  return (
    <form onSubmit={save}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Resume / CV</h1>
          <p className="text-sm text-text-secondary mt-1">
            Control CV download availability from the public site
          </p>
        </div>
      </div>
      <div className="card-glass p-8 max-w-2xl space-y-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`relative w-10 h-5 rounded-full transition-colors ${bool(values, "enable_cv_download") ? "bg-blue-500" : "bg-border"}`}
            onClick={() =>
              handleChange(
                "enable_cv_download",
                !bool(values, "enable_cv_download"),
              )
            }
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${bool(values, "enable_cv_download") ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
          <span className="text-sm text-text-secondary">
            Enable CV Download on Public Site
          </span>
        </label>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
            CV URL (English)
          </label>
          <input
            className="input-cyber"
            type="url"
            value={str(values, "cv_url")}
            onChange={(e) => handleChange("cv_url", e.target.value)}
            placeholder="https://drive.google.com/..."
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
            CV URL (Indonesian)
          </label>
          <input
            className="input-cyber"
            type="url"
            value={str(values, "cv_url_id")}
            onChange={(e) => handleChange("cv_url_id", e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
            Download Button Label
          </label>
          <div className="flex gap-2 mb-1">
            {(["en", "id"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={lang === l ? "tag" : "text-xs text-text-muted"}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <input
            className="input-cyber"
            value={loc(values, "button_label", lang)}
            onChange={(e) =>
              handleLocChange("button_label", lang, e.target.value)
            }
            placeholder="Download CV"
          />
        </div>
        <div className="pt-2 border-t border-border">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function ContactSettingsAdminPage() {
  const { values, isLoading, mutation, handleChange, handleLocChange, save } =
    useAdminForm(
      ["admin-contact-settings"],
      adminAPI.getContactSettings,
      adminAPI.updateContactSettings,
    );
  const [lang, setLang] = useState<"en" | "id">("en");
  if (isLoading) return <div className="skeleton h-96 rounded-xl" />;

  return (
    <form onSubmit={save}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Contact Settings
          </h1>
        </div>
        <div className="flex gap-2">
          {(["en", "id"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={lang === l ? "tag" : "text-xs text-text-muted"}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="card-glass p-8 max-w-2xl space-y-5">
        {[
          { k: "section_title", l: "Section Title" },
          { k: "section_subtitle", l: "Section Subtitle" },
          { k: "success_message", l: "Success Message" },
          { k: "error_message", l: "Error Message" },
        ].map(({ k, l }) => (
          <div key={k}>
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
              {l} ({lang.toUpperCase()})
            </label>
            <input
              className="input-cyber"
              value={loc(values, k, lang)}
              onChange={(e) => handleLocChange(k, lang, e.target.value)}
            />
          </div>
        ))}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { k: "enable_contact_form", l: "Enable Contact Form" },
            { k: "show_social_links", l: "Show Social Links" },
          ].map(({ k, l }) => (
            <label key={k} className="flex items-center gap-3 cursor-pointer">
              <div
                className={`relative w-10 h-5 rounded-full transition-colors ${bool(values, k) ? "bg-blue-500" : "bg-border"}`}
                onClick={() => handleChange(k, !bool(values, k))}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${bool(values, k) ? "translate-x-5" : "translate-x-0"}`}
                />
              </div>
              <span className="text-sm text-text-secondary">{l}</span>
            </label>
          ))}
        </div>
        <div className="pt-2 border-t border-border">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
