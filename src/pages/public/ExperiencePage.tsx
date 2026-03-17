import { useQuery } from "@tanstack/react-query";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import {
  PageLoadSkeleton,
  EmptyState,
} from "@/components/public/LoadingStates";

export default function ExperiencePage() {
  const { lang } = useLanguageStore();
  const { data: experiences, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: publicAPI.getExperiences,
  });

  if (isLoading) return <PageLoadSkeleton />;

  return (
    <div className="page-section max-w-4xl">
      <div className="text-center mb-16 animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          {lang === "en" ? "Career History" : "Riwayat Karier"}
        </p>
        <h1 className="section-title mb-4">
          {lang === "en" ? (
            <>
              Work <span>Experience</span>
            </>
          ) : (
            <>
              <span>Pengalaman</span> Kerja
            </>
          )}
        </h1>
      </div>

      {(experiences || []).length === 0 ? (
        <EmptyState
          message={
            lang === "en" ? "No experience listed yet" : "Belum ada pengalaman"
          }
        />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-linear-to-b from-accent via-border-glow to-transparent hidden sm:block" />

          <div className="space-y-6 sm:space-y-8">
            {(experiences || []).map((exp, i) => (
              <div
                key={exp.id}
                className="relative sm:pl-14 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Timeline dot */}
                <div className="hidden sm:flex absolute left-2 top-6 w-4 h-4 rounded-full border-2 border-accent bg-background items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>

                <div className="card-glass p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <h2 className="font-bold text-text-primary text-base sm:text-lg">
                        {getText(exp.role, lang)}
                      </h2>
                      <p className="text-accent-bright font-semibold text-sm sm:text-base">
                        {getText(exp.organization, lang)}
                      </p>
                      <p className="text-text-muted text-xs sm:text-sm">
                        {getText(exp.location, lang)}
                      </p>
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <span className="tag">{exp.employment_type}</span>
                      <p className="text-xs text-text-muted mt-2">
                        {exp.start_date?.slice(0, 7).replace("-", " / ")} —{" "}
                        {exp.is_current
                          ? lang === "en"
                            ? "Present"
                            : "Sekarang"
                          : exp.end_date?.slice(0, 7).replace("-", " / ")}
                      </p>
                      {exp.is_current && (
                        <div className="status-badge mt-2 text-xs sm:justify-end">
                          {lang === "en" ? "Current" : "Aktif"}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
                    {getText(exp.description, lang)}
                  </p>
                  {(exp.achievements as string[]).length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">
                        {lang === "en"
                          ? "Key Achievements"
                          : "Pencapaian Utama"}
                      </h4>
                      <ul className="space-y-1">
                        {(exp.achievements as string[]).map((a, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-xs sm:text-sm text-text-secondary"
                          >
                            <span className="text-accent mt-1 shrink-0">
                              ▹
                            </span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
