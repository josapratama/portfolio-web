import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
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
          <Link
            to="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            <ArrowLeft size={14} />
            {lang === "en" ? "Back to Blog" : "Kembali ke Blog"}
          </Link>
        </div>
      </div>
    );

  const content =
    getText(post.content, lang) || getText(post.excerpt, lang) || "";
  const readTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      {/* Cover image — flush at top */}
      {post.cover_image_url && (
        <div
          style={{
            width: "100%",
            height: "clamp(220px, 40vw, 480px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={post.cover_image_url}
            alt={getText(post.title, lang)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 40%, var(--color-bg) 100%)",
            }}
          />
        </div>
      )}

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        {/* Header block */}
        <div
          style={{
            marginTop: post.cover_image_url ? -48 : 40,
            marginBottom: 32,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Link
            to="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--color-text-muted)",
              textDecoration: "none",
              marginBottom: 20,
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
            {lang === "en" ? "Back to Blog" : "Kembali ke Blog"}
          </Link>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 14,
              }}
            >
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    background: "var(--color-accent-dim)",
                    color: "var(--color-accent-bright)",
                    border: "1px solid var(--color-accent-dim)",
                  }}
                >
                  <Tag size={9} />
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
              marginBottom: 12,
            }}
          >
            {getText(post.title, lang)}
          </h1>

          {/* Excerpt */}
          {getText(post.excerpt, lang) && (
            <p
              style={{
                fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: 18,
              }}
            >
              {getText(post.excerpt, lang)}
            </p>
          )}

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 16,
              paddingBottom: 20,
              borderBottom: "1px solid var(--color-border)",
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

        {/* Article body */}
        <div
          style={{
            background: "var(--color-surface-alt)",
            border: "1px solid var(--color-border)",
            borderRadius: 20,
            padding: "clamp(24px, 4vw, 48px)",
            marginBottom: 40,
          }}
        >
          <div className="prose-cyber">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {getText(post.content, lang) || getText(post.excerpt, lang)}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer divider + back link */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, var(--color-accent-dim), transparent)",
            opacity: 0.4,
            marginBottom: 32,
          }}
        />
        <Link
          to="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 10,
            border: "1px solid var(--color-border)",
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            fontSize: 14,
            marginBottom: 60,
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = "var(--color-accent)";
            el.style.color = "var(--color-accent-bright)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = "var(--color-border)";
            el.style.color = "var(--color-text-secondary)";
          }}
        >
          <ArrowLeft size={14} />
          {lang === "en" ? "More Articles" : "Artikel Lainnya"}
        </Link>
      </div>
    </div>
  );
}
