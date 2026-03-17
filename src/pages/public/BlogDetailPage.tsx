import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar } from "lucide-react";
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
      <div className="page-section text-center py-32">
        <h2 className="section-title mb-4">
          {lang === "en" ? "Article Not Found" : "Artikel Tidak Ditemukan"}
        </h2>
        <Link to="/blog" className="btn-secondary">
          <ArrowLeft size={16} /> Blog
        </Link>
      </div>
    );

  return (
    <article className="page-section max-w-3xl">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent-bright mb-8 transition-colors"
      >
        <ArrowLeft size={16} />{" "}
        {lang === "en" ? "Back to Blog" : "Kembali ke Blog"}
      </Link>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {post.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="section-title mb-4">{getText(post.title, lang)}</h1>
      <p className="section-subtitle mb-6">{getText(post.excerpt, lang)}</p>

      {/* Meta */}
      {post.published_at && (
        <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Calendar size={14} />
          {format(new Date(post.published_at), "MMMM d, yyyy")}
        </div>
      )}

      {/* Cover image */}
      {post.cover_image_url && (
        <div className="rounded-2xl overflow-hidden mb-10 border border-border h-72 md:h-96">
          <img
            src={post.cover_image_url}
            alt={getText(post.title, lang)}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose-cyber">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {getText(post.content, lang) || getText(post.excerpt, lang)}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <div className="cyber-divider mt-12 mb-8" />
      <Link to="/blog" className="btn-secondary">
        <ArrowLeft size={14} />{" "}
        {lang === "en" ? "More Articles" : "Artikel Lainnya"}
      </Link>
    </article>
  );
}
