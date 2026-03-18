import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import { PageLoadSkeleton } from "@/components/public/LoadingStates";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguageStore();
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => publicAPI.getBlogPost(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <PageLoadSkeleton />;

  if (isError || !post)
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
            {lang === "en" ? "Article Not Found" : "Artikel Tidak Ditemukan"}
          </h2>
          <Link to="/blog" className="btn-secondary">
            <ArrowLeft size={16} /> Blog
          </Link>
        </div>
      </div>
    );

  // Estimate read time
  const content =
    getText(post.content, lang) || getText(post.excerpt, lang) || "";
  const readTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.05) 0%, transparent 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "clamp(32px, 5vw, 56px) 0",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <Link
            to="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--color-text-muted)",
              textDecoration: "none",
              marginBottom: 28,
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
            {lang === "en" ? "Back to Blog" : "Kembali ke Blog"}
          </Link>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 16,
              }}
            >
              {post.tags.map((tag) => (
                <span key={tag} className="tag" style={{ fontSize: 11 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "var(--color-text-primary)",
              marginBottom: 14,
            }}
          >
            {getText(post.title, lang)}
          </h1>

          {/* Excerpt */}
          <p
            style={{
              fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              marginBottom: 20,
            }}
          >
            {getText(post.excerpt, lang)}
          </p>

          {/* Meta */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 16,
            }}
          >
            {post.published_at && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "var(--color-text-muted)",
                }}
              >
                <Calendar size={13} style={{ color: "var(--color-accent)" }} />
                {format(new Date(post.published_at), "MMMM d, yyyy")}
              </span>
            )}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "var(--color-text-muted)",
              }}
            >
              <Clock size={13} style={{ color: "var(--color-accent)" }} />
              {readTime} {lang === "en" ? "min read" : "menit baca"}
            </span>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.cover_image_url && (
        <div
          style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 0" }}
        >
          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid var(--color-border)",
              height: "clamp(200px, 40vw, 400px)",
            }}
          >
            <img
              src={post.cover_image_url}
              alt={getText(post.title, lang)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      )}

      {/* Article body */}
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 48px) 24px",
        }}
      >
        <div
          style={{
            background: "var(--color-surface-alt)",
            border: "1px solid var(--color-border)",
            borderRadius: 20,
            padding: "clamp(24px, 4vw, 48px)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="prose-cyber">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {getText(post.content, lang) || getText(post.excerpt, lang)}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, var(--color-accent-dim), transparent)",
            opacity: 0.4,
            margin: "40px 0 32px",
          }}
        />
        <Link to="/blog" className="btn-secondary">
          <ArrowLeft size={14} />{" "}
          {lang === "en" ? "More Articles" : "Artikel Lainnya"}
        </Link>
      </div>
    </div>
  );
}
