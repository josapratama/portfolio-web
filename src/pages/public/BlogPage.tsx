import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import {
  PageLoadSkeleton,
  EmptyState,
} from "@/components/public/LoadingStates";
import { format } from "date-fns";

export default function BlogPage() {
  const { lang } = useLanguageStore();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog"],
    queryFn: publicAPI.getBlogPosts,
  });
  const { data: sections } = useQuery({
    queryKey: ["sections"],
    queryFn: publicAPI.getSections,
  });

  if (isLoading) return <PageLoadSkeleton />;
  if (sections?.["blog_page"] === false)
    return (
      <div className="page-section text-center py-32">
        <h2 className="section-title mb-4">
          {lang === "en" ? "Blog Unavailable" : "Blog Tidak Tersedia"}
        </h2>
        <p className="text-text-secondary">
          {lang === "en"
            ? "The blog section is currently disabled."
            : "Bagian blog saat ini dinonaktifkan."}
        </p>
      </div>
    );

  const featured = (posts || []).filter((p) => p.is_featured);
  const regular = (posts || []).filter((p) => !p.is_featured);

  return (
    <div className="page-section">
      <div className="text-center mb-16 animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          Writing
        </p>
        <h1 className="section-title mb-4">
          {lang === "en" ? (
            <>
              The <span>Blog</span>
            </>
          ) : (
            <>
              Blog <span>Artikel</span>
            </>
          )}
        </h1>
        <p className="section-subtitle mx-auto text-center">
          {lang === "en"
            ? "Thoughts on software engineering, career, and technology."
            : "Pemikiran tentang rekayasa perangkat lunak, karier, dan teknologi."}
        </p>
      </div>

      {(posts || []).length === 0 ? (
        <EmptyState
          message={
            lang === "en" ? "No articles published yet" : "Belum ada artikel"
          }
        />
      ) : (
        <>
          {/* Featured posts */}
          {featured.length > 0 && (
            <div className="mb-12">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted mb-6">
                {lang === "en" ? "Featured" : "Unggulan"}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featured.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="card-glass group overflow-hidden block"
                  >
                    {post.cover_image_url && (
                      <div className="h-52 overflow-hidden">
                        <img
                          src={post.cover_image_url}
                          alt={getText(post.title, lang)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((t) => (
                          <span key={t} className="tag text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-bold text-lg text-text-primary group-hover:text-accent-bright transition-colors mb-2 line-clamp-2">
                        {getText(post.title, lang)}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                        {getText(post.excerpt, lang)}
                      </p>
                      <div className="flex items-center justify-between">
                        {post.published_at && (
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Calendar size={11} />{" "}
                            {format(new Date(post.published_at), "MMM d, yyyy")}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-accent-bright group-hover:gap-2 transition-all">
                          {lang === "en" ? "Read" : "Baca"}{" "}
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Regular posts */}
          {regular.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted mb-6">
                {lang === "en" ? "All Articles" : "Semua Artikel"}
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {regular.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="card-glass group flex gap-3 sm:gap-5 p-4 sm:p-5 items-start"
                  >
                    {post.cover_image_url && (
                      <div className="w-16 h-14 sm:w-24 sm:h-20 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={post.cover_image_url}
                          alt={getText(post.title, lang)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {post.tags.slice(0, 2).map((t) => (
                          <span key={t} className="tag text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-xs sm:text-sm text-text-primary group-hover:text-accent-bright transition-colors line-clamp-2 mb-1">
                        {getText(post.title, lang)}
                      </h3>
                      <p className="text-xs text-text-secondary line-clamp-2 hidden sm:block">
                        {getText(post.excerpt, lang)}
                      </p>
                    </div>
                    {post.published_at && (
                      <div className="text-xs text-text-muted shrink-0">
                        {format(new Date(post.published_at), "MMM d")}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
