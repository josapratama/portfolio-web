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
    <div style={{ paddingTop: 80 }}>
      {/* Hero header */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.04) 0%, transparent 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "48px 0 40px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: 12,
            }}
          >
            {lang === "en" ? "Career History" : "Riwayat Karier"}
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--color-text-primary)",
            }}
          >
            {lang === "en" ? (
              <>
                Work{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Experience
                </span>
              </>
            ) : (
              <>
                <span
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Pengalaman
                </span>{" "}
                Kerja
              </>
            )}
          </h1>
        </div>
      </div>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 64px) 24px",
        }}
      >
        {(experiences || []).length === 0 ? (
          <EmptyState
            message={
              lang === "en"
                ? "No experience listed yet"
                : "Belum ada pengalaman"
            }
          />
        ) : (
          <div style={{ position: "relative" }}>
            {/* Timeline line */}
            <div
              className="timeline-line"
              style={{
                position: "absolute",
                left: 16,
                top: 0,
                bottom: 0,
                width: 1,
                background:
                  "linear-gradient(to bottom, var(--color-accent), var(--color-border-glow), transparent)",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {(experiences || []).map((exp, i) => (
                <div
                  key={exp.id}
                  className="animate-fade-in"
                  style={{
                    position: "relative",
                    paddingLeft: "clamp(0px, 5vw, 56px)",
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    className="timeline-dot"
                    style={{
                      position: "absolute",
                      left: 8,
                      top: 24,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: "2px solid var(--color-accent)",
                      background: "var(--color-background)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--color-accent)",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      background: "var(--color-surface-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 16,
                      padding: "clamp(16px, 3vw, 24px)",
                      backdropFilter: "blur(16px)",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 16,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <h2
                          style={{
                            fontWeight: 700,
                            color: "var(--color-text-primary)",
                            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                            marginBottom: 2,
                          }}
                        >
                          {getText(exp.role, lang)}
                        </h2>
                        <p
                          style={{
                            color: "var(--color-accent-bright)",
                            fontWeight: 600,
                            fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)",
                            marginBottom: 2,
                          }}
                        >
                          {getText(exp.organization, lang)}
                        </p>
                        <p
                          style={{
                            color: "var(--color-text-muted)",
                            fontSize: 12,
                          }}
                        >
                          {getText(exp.location, lang)}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 6,
                          flexShrink: 0,
                        }}
                      >
                        <span className="tag">{exp.employment_type}</span>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {exp.start_date?.slice(0, 7).replace("-", " / ")} —{" "}
                          {exp.is_current
                            ? lang === "en"
                              ? "Present"
                              : "Sekarang"
                            : exp.end_date?.slice(0, 7).replace("-", " / ")}
                        </p>
                        {exp.is_current && (
                          <div
                            className="status-badge"
                            style={{ fontSize: 11 }}
                          >
                            {lang === "en" ? "Current" : "Aktif"}
                          </div>
                        )}
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: "clamp(0.8rem, 1.5vw, 0.875rem)",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.7,
                        marginBottom:
                          Array.isArray(exp.achievements) &&
                          exp.achievements.length > 0
                            ? 16
                            : 0,
                      }}
                    >
                      {getText(exp.description, lang)}
                    </p>

                    {Array.isArray(exp.achievements) &&
                      exp.achievements.length > 0 && (
                        <div>
                          <p
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "var(--color-text-muted)",
                              marginBottom: 10,
                            }}
                          >
                            {lang === "en"
                              ? "Key Achievements"
                              : "Pencapaian Utama"}
                          </p>
                          <ul
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 6,
                            }}
                          >
                            {exp.achievements.map((a, j) => (
                              <li
                                key={j}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 8,
                                  fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
                                  color: "var(--color-text-secondary)",
                                }}
                              >
                                <span
                                  style={{
                                    color: "var(--color-accent)",
                                    marginTop: 2,
                                    flexShrink: 0,
                                  }}
                                >
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
    </div>
  );
}
