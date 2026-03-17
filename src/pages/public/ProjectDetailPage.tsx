import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
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
      <div className="page-section text-center py-32">
        <h2 className="section-title mb-4">
          {lang === "en" ? "Project Not Found" : "Proyek Tidak Ditemukan"}
        </h2>
        <Link to="/projects" className="btn-secondary">
          <ArrowLeft size={16} />{" "}
          {lang === "en" ? "Back to Projects" : "Kembali"}
        </Link>
      </div>
    );

  return (
    <div className="page-section max-w-4xl">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent-bright mb-8 transition-colors"
      >
        <ArrowLeft size={16} />{" "}
        {lang === "en" ? "Back to Projects" : "Kembali ke Proyek"}
      </Link>

      {project.cover_image_url && (
        <div className="h-72 md:h-96 rounded-2xl overflow-hidden mb-10 border border-border">
          <img
            src={project.cover_image_url}
            alt={getText(project.title, lang)}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <h1 className="section-title mb-4">{getText(project.title, lang)}</h1>
          <p className="text-text-secondary text-lg mb-8">
            {getText(project.short_description, lang)}
          </p>
          <div className="prose-cyber">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {getText(project.full_description, lang) ||
                getText(project.short_description, lang)}
            </ReactMarkdown>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5 order-1 lg:order-2">
          {/* Links */}
          <div className="card-glass p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Links
            </h3>
            {project.live_demo_url && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center text-sm"
              >
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center text-sm"
              >
                <Github size={14} /> View Code
              </a>
            )}
          </div>

          {/* Tech stack */}
          {project.tech_stack.length > 0 && (
            <div className="card-glass p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Role */}
          {project.role && getText(project.role, lang) && (
            <div className="card-glass p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">
                {lang === "en" ? "My Role" : "Peran Saya"}
              </h3>
              <p className="text-sm text-accent-bright">
                {getText(project.role, lang)}
              </p>
            </div>
          )}

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="card-glass p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
