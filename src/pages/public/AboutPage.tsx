import { useQuery } from "@tanstack/react-query";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import { PageLoadSkeleton } from "@/components/public/LoadingStates";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const { lang } = useLanguageStore();
  const { data: about, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: publicAPI.getAbout,
  });
  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: publicAPI.getSkills,
  });
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: publicAPI.getSettings,
  });

  if (isLoading) return <PageLoadSkeleton />;

  return (
    <div className="page-section">
      <div className="text-center mb-10 sm:mb-16 animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          {lang === "en" ? "Get to know me" : "Kenali Saya"}
        </p>
        <h1 className="section-title mb-4">
          {lang === "en" ? (
            <>
              Hi, I'm <span>{settings?.site?.full_name || "Alex Johnson"}</span>
            </>
          ) : (
            <>
              Halo, Perkenalkan{" "}
              <span>{settings?.site?.full_name || "Alex Johnson"}</span>
            </>
          )}
        </h1>
        <p className="text-accent-bright text-base sm:text-lg font-semibold">
          {settings?.site?.title}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-16 sm:mb-20">
        {/* Profile image + quick info */}
        <div className="flex flex-col items-center lg:items-start gap-6">
          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl border border-border-glow overflow-hidden bg-surface-2">
            {about?.profile_image_url ? (
              <img
                src={about.profile_image_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                  {(settings?.site?.full_name || "A")[0]}
                </div>
              </div>
            )}
          </div>
          <div className="card-glass p-4 sm:p-5 w-full space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">
              {lang === "en" ? "Quick Info" : "Info Singkat"}
            </h3>
            {[
              {
                label: lang === "en" ? "Location" : "Lokasi",
                value: settings?.site?.location,
              },
              {
                label: lang === "en" ? "Experience" : "Pengalaman",
                value: `${about?.years_of_experience}+ ${lang === "en" ? "years" : "tahun"}`,
              },
              { label: "Email", value: settings?.site?.contact_email },
              {
                label: lang === "en" ? "Status" : "Status",
                value: settings?.site?.availability_status,
              },
            ].map(
              (row) =>
                row.value && (
                  <div
                    key={row.label}
                    className="flex justify-between text-xs sm:text-sm gap-3"
                  >
                    <span className="text-text-muted shrink-0">
                      {row.label}
                    </span>
                    <span className="text-text-secondary text-right break-all">
                      {row.value}
                    </span>
                  </div>
                ),
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="prose-cyber mb-8 sm:mb-10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {getText(about?.full_bio, lang) ||
                getText(about?.short_bio, lang) ||
                ""}
            </ReactMarkdown>
          </div>
          {(about?.highlights || []).length > 0 && (
            <div className="card-glass p-4 sm:p-6">
              <h3 className="font-bold text-text-primary mb-4">
                {lang === "en" ? "Highlights" : "Poin Utama"}
              </h3>
              <ul className="space-y-2">
                {(about?.highlights || []).map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-xs sm:text-sm text-text-secondary"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-accent mt-0.5 shrink-0"
                    />
                    {typeof h === "string" ? h : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Skills by category */}
      {(skills || []).length > 0 && (
        <div id="skills">
          <div className="cyber-divider mb-10 sm:mb-12" />
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            {lang === "en" ? "Technical Skills" : "Keahlian Teknis"}
          </p>
          <h2 className="section-title mb-8 sm:mb-10">
            {lang === "en" ? (
              <>
                Tools & <span>Technologies</span>
              </>
            ) : (
              <>
                Alat & <span>Teknologi</span>
              </>
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {(skills || []).map(
              (category) =>
                category.skills.length > 0 && (
                  <div key={category.id} className="card-glass p-4 sm:p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 sm:mb-4">
                      {getText(category.name, lang)}
                    </h3>
                    <ul className="space-y-2">
                      {category.skills.map((skill) => (
                        <li
                          key={skill.id}
                          className="flex items-center justify-between text-xs sm:text-sm gap-2"
                        >
                          <span className="text-text-secondary truncate">
                            {getText(skill.name, lang)}
                          </span>
                          <span className="tag text-xs shrink-0">
                            {skill.proficiency_level}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
