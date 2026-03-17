import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Calendar } from "lucide-react";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import { PageLoadSkeleton } from "@/components/public/LoadingStates";
import {
  Github as GithubIcon,
  Linkedin,
  Twitter,
  Mail,
  Globe,
  Instagram,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <GithubIcon size={18} />,
  linkedin: <Linkedin size={18} />,
  twitter: <Twitter size={18} />,
  x: <Twitter size={18} />,
  instagram: <Instagram size={18} />,
  email: <Mail size={18} />,
  whatsapp: <MessageSquare size={18} />,
  website: <Globe size={18} />,
};

export default function HomePage() {
  const { lang } = useLanguageStore();
  const { data: hero, isLoading: heroLoading } = useQuery({
    queryKey: ["hero"],
    queryFn: publicAPI.getHero,
    staleTime: 5 * 60 * 1000,
  });
  const { data: about } = useQuery({
    queryKey: ["about"],
    queryFn: publicAPI.getAbout,
    staleTime: 5 * 60 * 1000,
  });
  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: publicAPI.getSkills,
    staleTime: 5 * 60 * 1000,
  });
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: publicAPI.getProjects,
    staleTime: 5 * 60 * 1000,
  });
  const { data: experiences } = useQuery({
    queryKey: ["experiences"],
    queryFn: publicAPI.getExperiences,
    staleTime: 5 * 60 * 1000,
  });
  const { data: blogPosts } = useQuery({
    queryKey: ["blog"],
    queryFn: publicAPI.getBlogPosts,
    staleTime: 5 * 60 * 1000,
  });
  const { data: socialLinks } = useQuery({
    queryKey: ["social-links"],
    queryFn: publicAPI.getSocialLinks,
    staleTime: 10 * 60 * 1000,
  });
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: publicAPI.getSettings,
    staleTime: 10 * 60 * 1000,
  });
  const { data: sections } = useQuery({
    queryKey: ["sections"],
    queryFn: publicAPI.getSections,
    staleTime: 5 * 60 * 1000,
  });
  useQuery({
    queryKey: ["resume"],
    queryFn: publicAPI.getResume,
    staleTime: 10 * 60 * 1000,
  });
  const { data: contactSettings } = useQuery({
    queryKey: ["contact-settings"],
    queryFn: publicAPI.getContactSettings,
    staleTime: 10 * 60 * 1000,
  });

  if (heroLoading) return <PageLoadSkeleton />;

  const s = sections || {};
  const featuredProjects = (projects || []).filter((p) => p.is_featured);
  const featuredPosts = (blogPosts || [])
    .filter((p) => p.is_featured)
    .slice(0, 3);
  const recentExperience = (experiences || []).slice(0, 2);
  const featuredSkills = (skills || [])
    .flatMap((cat) => cat.skills)
    .filter((sk) => sk.is_featured);
  const ctaPrimary =
    settings?.site?.cta_primary_label ||
    (lang === "en" ? "View My Work" : "Lihat Karya");
  const ctaSecondary =
    settings?.site?.cta_secondary_label ||
    (lang === "en" ? "Get In Touch" : "Hubungi Saya");
  const siteTitle = settings?.site?.title || "";

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      {s["hero"] !== false && (
        <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center py-12 sm:py-0">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-blue-500/5 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-indigo-500/5 blur-[80px]" />
            <div className="absolute inset-0 noise-overlay" />
          </div>
          <div className="page-section w-full">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="animate-fade-in-left order-2 lg:order-1 text-center lg:text-left">
                {hero?.show_availability_badge && (
                  <div className="status-badge mb-5 w-fit mx-auto lg:mx-0">
                    {getText(hero.availability_badge, lang)}
                  </div>
                )}
                <h1 className="section-title mb-4">
                  <span className="block text-text-primary">
                    {getText(hero?.headline, lang) ||
                      "Building Digital Experiences"}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-accent-bright font-semibold mb-4">
                  {getText(hero?.subheadline, lang) || siteTitle}
                </p>
                <p className="section-subtitle mb-6 sm:mb-8 mx-auto lg:mx-0">
                  {getText(hero?.short_intro, lang)}
                </p>
                <div className="flex flex-wrap gap-3 mb-6 sm:mb-8 justify-center lg:justify-start">
                  <Link to="/projects" className="btn-primary">
                    {ctaPrimary} <ArrowRight size={16} />
                  </Link>
                  <Link to="/contact" className="btn-secondary">
                    {ctaSecondary}
                  </Link>
                </div>
                <div className="flex gap-3 justify-center lg:justify-start flex-wrap">
                  {(socialLinks || []).map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target={link.open_in_new_tab ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg border border-border text-text-muted hover:text-accent-bright hover:border-accent hover:bg-accent-glow transition-all"
                      title={link.label}
                    >
                      {PLATFORM_ICONS[link.platform.toLowerCase()] || (
                        <ExternalLink size={16} />
                      )}
                    </a>
                  ))}
                </div>
              </div>
              <div className="animate-fade-in-right flex justify-center order-1 lg:order-2">
                <div className="relative">
                  <div className="w-44 h-44 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-2xl border border-border-glow overflow-hidden bg-surface-2 relative animate-float">
                    {hero?.profile_image_url ? (
                      <img
                        src={hero.profile_image_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 mx-auto mb-4 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                            {(settings?.site?.full_name || "A")[0]}
                          </div>
                          <p className="text-text-muted text-xs sm:text-sm">
                            Profile Photo
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-background/30 to-transparent" />
                  </div>
                  <div className="absolute -inset-4 rounded-2xl bg-blue-500/5 blur-2xl -z-10" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT PREVIEW ── */}
      {s["about_preview"] !== false && about && (
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="page-section">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                  {lang === "en" ? "About Me" : "Tentang Saya"}
                </p>
                <h2 className="section-title mb-5">
                  {lang === "en" ? (
                    <>
                      The <span>Engineer</span> Behind the Code
                    </>
                  ) : (
                    <>
                      Engineer <span>di Balik</span> Kode
                    </>
                  )}
                </h2>
                <p className="text-text-secondary leading-relaxed mb-5 text-sm sm:text-base">
                  {getText(about.short_bio, lang)}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {(about.highlights || []).slice(0, 3).map((h, i) => (
                    <span key={i} className="tag">
                      {typeof h === "string" ? h : ""}
                    </span>
                  ))}
                </div>
                <Link to="/about" className="btn-secondary">
                  {lang === "en" ? "Read More About Me" : "Baca Selengkapnya"}{" "}
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    num: `${about.years_of_experience}+`,
                    label:
                      lang === "en" ? "Years Experience" : "Tahun Pengalaman",
                  },
                  {
                    num: `${(projects || []).length}+`,
                    label:
                      lang === "en" ? "Projects Shipped" : "Proyek Selesai",
                  },
                  {
                    num: `${(skills || []).flatMap((c) => c.skills).length}+`,
                    label: lang === "en" ? "Technologies" : "Teknologi",
                  },
                  {
                    num: `${(blogPosts || []).length}+`,
                    label:
                      lang === "en" ? "Articles Written" : "Artikel Ditulis",
                  },
                ].map((stat, i) => (
                  <div key={i} className="card-glass p-4 sm:p-5 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-accent-bright mb-1">
                      {stat.num}
                    </div>
                    <div className="text-xs text-text-muted">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SKILLS ── */}
      {s["skills"] !== false && (skills || []).length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-surface/30">
          <div className="page-section">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                Tech Stack
              </p>
              <h2 className="section-title">
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
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {featuredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="tag text-xs sm:text-sm py-1.5 px-3 sm:px-4"
                >
                  {getText(skill.name, lang)}
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                to="/about#skills"
                className="text-sm text-accent-bright hover:underline"
              >
                {lang === "en" ? "View all skills →" : "Lihat semua keahlian →"}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PROJECTS ── */}
      {s["featured_projects"] !== false && featuredProjects.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="page-section">
            <div className="flex items-end justify-between mb-8 sm:mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                  {lang === "en" ? "Portfolio" : "Portofolio"}
                </p>
                <h2 className="section-title">
                  {lang === "en" ? (
                    <>
                      Featured <span>Projects</span>
                    </>
                  ) : (
                    <>
                      <span>Proyek</span> Unggulan
                    </>
                  )}
                </h2>
              </div>
              <Link
                to="/projects"
                className="hidden sm:flex items-center gap-2 text-sm text-accent-bright hover:gap-3 transition-all shrink-0 ml-4"
              >
                {lang === "en" ? "View all" : "Lihat semua"}{" "}
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="card-glass group overflow-hidden block"
                >
                  <div className="h-40 sm:h-44 bg-linear-to-br from-surface-2 to-surface relative overflow-hidden">
                    {project.cover_image_url ? (
                      <img
                        src={project.cover_image_url}
                        alt={getText(project.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-text-muted text-4xl font-black opacity-20">
                          {getText(project.title, lang)[0]}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-text-primary mb-2 group-hover:text-accent-bright transition-colors text-sm sm:text-base">
                      {getText(project.title, lang)}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary mb-3 line-clamp-2">
                      {getText(project.short_description, lang)}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <span key={tech} className="tag text-xs">
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="tag text-xs">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6 sm:hidden">
              <Link to="/projects" className="btn-secondary text-sm">
                {lang === "en" ? "View all projects" : "Lihat semua proyek"}{" "}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── EXPERIENCE PREVIEW ── */}
      {s["experience_preview"] !== false && recentExperience.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-surface/30">
          <div className="page-section">
            <div className="flex items-end justify-between mb-8 sm:mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                  {lang === "en" ? "Career" : "Karier"}
                </p>
                <h2 className="section-title">
                  {lang === "en" ? (
                    <>
                      Work <span>Experience</span>
                    </>
                  ) : (
                    <>
                      <span>Pengalaman</span> Kerja
                    </>
                  )}
                </h2>
              </div>
              <Link
                to="/experience"
                className="hidden sm:flex items-center gap-2 text-sm text-accent-bright hover:gap-3 transition-all shrink-0 ml-4"
              >
                {lang === "en" ? "Full history" : "Riwayat lengkap"}{" "}
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {recentExperience.map((exp) => (
                <div key={exp.id} className="card-glass p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-text-primary text-sm sm:text-base">
                        {getText(exp.role, lang)}
                      </h3>
                      <p className="text-accent-bright text-sm font-medium">
                        {getText(exp.organization, lang)}
                      </p>
                      <p className="text-text-muted text-xs mt-1">
                        {getText(exp.location, lang)}
                      </p>
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <span className="tag">{exp.employment_type}</span>
                      <p className="text-xs text-text-muted mt-1">
                        {exp.start_date?.slice(0, 7)} —{" "}
                        {exp.is_current
                          ? lang === "en"
                            ? "Present"
                            : "Sekarang"
                          : exp.end_date?.slice(0, 7)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BLOG PREVIEW ── */}
      {s["blog_preview"] !== false &&
        s["blog_page"] !== false &&
        featuredPosts.length > 0 && (
          <section className="py-12 sm:py-16 lg:py-20">
            <div className="page-section">
              <div className="flex items-end justify-between mb-8 sm:mb-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                    Writing
                  </p>
                  <h2 className="section-title">
                    {lang === "en" ? (
                      <>
                        Latest <span>Articles</span>
                      </>
                    ) : (
                      <>
                        <span>Artikel</span> Terbaru
                      </>
                    )}
                  </h2>
                </div>
                <Link
                  to="/blog"
                  className="hidden sm:flex items-center gap-2 text-sm text-accent-bright hover:gap-3 transition-all shrink-0 ml-4"
                >
                  {lang === "en" ? "All articles" : "Semua artikel"}{" "}
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="card-glass group p-4 sm:p-6 block"
                  >
                    {post.cover_image_url && (
                      <div className="h-32 sm:h-36 rounded-lg overflow-hidden mb-4">
                        <img
                          src={post.cover_image_url}
                          alt={getText(post.title, lang)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="tag text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-text-primary mb-2 group-hover:text-accent-bright transition-colors line-clamp-2">
                      {getText(post.title, lang)}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 mb-3">
                      {getText(post.excerpt, lang)}
                    </p>
                    {post.published_at && (
                      <p className="text-xs text-text-muted flex items-center gap-1">
                        <Calendar size={11} />
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* ── CONTACT CTA ── */}
      {s["contact_cta"] !== false && (
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="page-section">
            <div className="card-glass p-6 sm:p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
                  {lang === "en" ? "Let's Work Together" : "Mari Berkolaborasi"}
                </p>
                <h2 className="section-title mb-4">
                  {getText(contactSettings?.section_title, lang) ||
                    (lang === "en" ? "Get In Touch" : "Hubungi Saya")}
                </h2>
                <p className="section-subtitle mx-auto mb-6 sm:mb-8 text-center">
                  {getText(contactSettings?.section_subtitle, lang)}
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link to="/contact" className="btn-primary">
                    {lang === "en" ? "Send a Message" : "Kirim Pesan"}{" "}
                    <ArrowRight size={16} />
                  </Link>
                  {(socialLinks || []).find((l) => l.platform === "email") && (
                    <a
                      href={
                        (socialLinks || []).find((l) => l.platform === "email")
                          ?.url || ""
                      }
                      className="btn-secondary"
                    >
                      <Mail size={14} />{" "}
                      {settings?.site?.contact_email || "Email Me"}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
