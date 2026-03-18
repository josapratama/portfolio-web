import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
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
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              marginBottom: 16,
            }}
          >
            {lang === "en" ? "Project Not Found" : "Proyek Tidak Ditemukan"}
          </h2>
          <Link to="/projects" className="btn-secondary">
            <ArrowLeft size={16} />{" "}
            {lang === "en" ? "Back to Projects" : "Kembali"}
          </Link>
        </div>
      </div>
    );

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero / cover */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.05) 0%, transparent 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "clamp(32px, 5vw, 56px) 0",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
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
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-accent-bright)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-text-muted)";
            }}
          >
            <ArrowLeft size={14} />{" "}
            {lang === "en" ? "Back to Projects" : "Kembali ke Proyek"}
          </Link>

          {project.cover_image_url && (
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                height: "clamp(200px, 40vw, 420px)",
                marginBottom: 0,
              }}
            >
              <img
                src={project.cover_image_url}
                alt={getText(project.title, lang)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 56px) 24px",
        }}
      >
        <div className="project-detail-grid">
          {/* Left: content */}
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "var(--color-text-primary)",
                marginBottom: 12,
              }}
            >
              {getText(project.title, lang)}
            </h1>
            <p
              style={{
                fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: 32,
              }}
            >
              {getText(project.short_description, lang)}
            </p>
            <div className="prose-cyber">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {getText(project.full_description, lang) ||
                  getText(project.short_description, lang)}
              </ReactMarkdown>
            </div>
          </div>

          {/* Right: sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Links */}
            {(project.live_demo_url || project.repo_url) && (
              <div
                style={{
                  background: "var(--color-surface-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 16,
                  padding: "20px",
                  backdropFilter: "blur(16px)",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    marginBottom: 14,
                  }}
                >
                  Links
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
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
            {project.tech_stack.length > 0 && (
              <div
                style={{
                  background: "var(--color-surface-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 16,
                  padding: "20px",
                  backdropFilter: "blur(16px)",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    marginBottom: 14,
                  }}
                >
                  Tech Stack
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {project.tech_stack.map((tech) => (
                    <span key={tech} className="tag" style={{ fontSize: 11 }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Role */}
            {project.role && getText(project.role, lang) && (
              <div
                style={{
                  background: "var(--color-surface-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 16,
                  padding: "20px",
                  backdropFilter: "blur(16px)",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    marginBottom: 8,
                  }}
                >
                  {lang === "en" ? "My Role" : "Peran Saya"}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-accent-bright)",
                    fontWeight: 600,
                  }}
                >
                  {getText(project.role, lang)}
                </p>
              </div>
            )}

            {/* Tags */}
            {project.tags.length > 0 && (
              <div
                style={{
                  background: "var(--color-surface-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 16,
                  padding: "20px",
                  backdropFilter: "blur(16px)",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    marginBottom: 14,
                  }}
                >
                  Tags
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag" style={{ fontSize: 11 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
