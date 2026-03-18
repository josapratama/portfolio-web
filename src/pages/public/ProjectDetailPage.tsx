import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Code2, Tag, Briefcase } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import { PageLoadSkeleton } from "@/components/public/LoadingStates";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguageStore();
  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => publicAPI.getProject(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <PageLoadSkeleton />;

  if (isError || !project)
    return (
      <div
        style={{
          paddingTop: 80,
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem,4vw,2rem)",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              marginBottom: 16,
            }}
          >
            {lang === "en" ? "Project Not Found" : "Proyek Tidak Ditemukan"}
          </h2>
          <Link
            to="/projects"
            className="btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <ArrowLeft size={16} />{" "}
            {lang === "en" ? "Back to Projects" : "Kembali"}
          </Link>
        </div>
      </div>
    );

  const title = getText(project.title, lang);
  const shortDesc = getText(project.short_description, lang);
  const fullDesc = getText(project.full_description, lang);
  const role = project.role ? getText(project.role, lang) : "";

  const sideCard = {
    background: "var(--color-surface-card)",
    border: "1px solid var(--color-border)",
    borderRadius: 16,
    padding: 20,
    backdropFilter: "blur(16px)",
  };

  const sectionLabel = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-muted)",
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.06) 0%, transparent 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "clamp(28px,5vw,48px) 0 0",
        }}
      >
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            padding: "0 clamp(16px,4vw,32px)",
          }}
        >
          {/* Back link */}
          <Link
            to="/projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--color-text-muted)",
              textDecoration: "none",
              marginBottom: 24,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-accent-bright)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-text-muted)")
            }
          >
            <ArrowLeft size={14} />
            {lang === "en" ? "Back to Projects" : "Kembali ke Proyek"}
          </Link>

          {/* Cover image */}
          {project.cover_image_url && (
            <div
              style={{
                borderRadius: "20px 20px 0 0",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                borderBottom: "none",
                height: "clamp(180px,35vw,400px)",
              }}
            >
              <img
                src={project.cover_image_url}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "clamp(28px,5vw,48px) clamp(16px,4vw,32px)",
        }}
      >
        <div className="project-detail-grid">
          {/* ── Left: main content ── */}
          <div style={{ minWidth: 0 }}>
            {/* Title + badges */}
            <div style={{ marginBottom: 20 }}>
              <h1
                style={{
                  fontSize: "clamp(1.75rem,4vw,2.75rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: "var(--color-text-primary)",
                  marginBottom: 12,
                }}
              >
                {title}
              </h1>
              {/* Status badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {project.is_featured && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: "rgba(250,204,21,0.12)",
                      border: "1px solid rgba(250,204,21,0.25)",
                      color: "#facc15",
                    }}
                  >
                    ★ {lang === "en" ? "Featured" : "Unggulan"}
                  </span>
                )}
                {(project.tech_stack ?? []).slice(0, 4).map((t: string) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: "rgba(59,130,246,0.08)",
                      border: "1px solid rgba(59,130,246,0.18)",
                      color: "var(--color-accent-bright)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Short description */}
            {shortDesc && (
              <p
                style={{
                  fontSize: "clamp(0.9rem,2vw,1.05rem)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: 32,
                  paddingBottom: 32,
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {shortDesc}
              </p>
            )}

            {/* Full description (markdown) */}
            {fullDesc && fullDesc !== shortDesc && (
              <div className="prose-cyber">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {fullDesc}
                </ReactMarkdown>
              </div>
            )}

            {/* Mobile-only: links */}
            <div className="project-mobile-links">
              {project.live_demo_url && (
                <a
                  href={project.live_demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ justifyContent: "center", fontSize: 13 }}
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ justifyContent: "center", fontSize: 13 }}
                >
                  <FaGithub size={14} /> View Code
                </a>
              )}
            </div>
          </div>

          {/* ── Right: sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Links */}
            {(project.live_demo_url || project.repo_url) && (
              <div style={sideCard}>
                <p style={sectionLabel}>Links</p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {project.live_demo_url && (
                    <a
                      href={project.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ justifyContent: "center", fontSize: 13 }}
                    >
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ justifyContent: "center", fontSize: 13 }}
                    >
                      <FaGithub size={14} /> View Code
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Tech stack */}
            {(project.tech_stack ?? []).length > 0 && (
              <div style={sideCard}>
                <p style={sectionLabel}>
                  <Code2 size={12} /> Tech Stack
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(project.tech_stack as string[]).map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: "rgba(59,130,246,0.08)",
                        border: "1px solid rgba(59,130,246,0.18)",
                        color: "var(--color-accent-bright)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Role */}
            {role && (
              <div style={sideCard}>
                <p style={sectionLabel}>
                  <Briefcase size={12} />{" "}
                  {lang === "en" ? "My Role" : "Peran Saya"}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-accent-bright)",
                    fontWeight: 600,
                  }}
                >
                  {role}
                </p>
              </div>
            )}

            {/* Tags */}
            {(project.tags ?? []).length > 0 && (
              <div style={sideCard}>
                <p style={sectionLabel}>
                  <Tag size={12} /> Tags
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(project.tags as string[]).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        color: "#a5b4fc",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <Link
              to="/projects"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid var(--color-border)",
                background: "transparent",
                fontSize: 13,
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--color-text-primary)";
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
              <ArrowLeft size={13} />{" "}
              {lang === "en" ? "All Projects" : "Semua Proyek"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
