import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Calendar,
  MapPin,
  Briefcase,
} from "lucide-react";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import { PageLoadSkeleton } from "@/components/public/LoadingStates";
import { Mail, Globe } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import { format } from "date-fns";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <FaGithub size={17} />,
  linkedin: <FaLinkedin size={17} />,
  twitter: <FaXTwitter size={17} />,
  x: <FaXTwitter size={17} />,
  instagram: <FaInstagram size={17} />,
  email: <Mail size={17} />,
  whatsapp: <FaWhatsapp size={17} />,
  website: <Globe size={17} />,
};

// Reusable section wrapper with consistent padding
function Section({
  children,
  alt = false,
}: {
  children: React.ReactNode;
  alt?: boolean;
}) {
  return (
    <section
      style={{
        background: alt ? "var(--color-surface-alt)" : "transparent",
        padding: "64px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        {children}
      </div>
    </section>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--color-accent)",
        marginBottom: 10,
      }}
    >
      {text}
    </p>
  );
}

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
  const recentExperience = (experiences || []).slice(0, 3);
  const featuredSkills = (skills || [])
    .flatMap((cat) => cat.skills)
    .filter((sk) => sk.is_featured);
  const ctaPrimary =
    settings?.site?.cta_primary_label ||
    (lang === "en" ? "View My Work" : "Lihat Karya");
  const ctaSecondary =
    settings?.site?.cta_secondary_label ||
    (lang === "en" ? "Get In Touch" : "Hubungi Saya");
  const fullName =
    settings?.site?.full_name || settings?.site?.brand_name || "";
  const location = settings?.site?.location || "";

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* ── HERO ── */}
      {s["hero"] !== false && (
        <section
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "80px 0 40px",
          }}
        >
          {/* bg blobs */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "20%",
                left: "-10%",
                width: 500,
                height: 500,
                borderRadius: "50%",
                background: "rgba(59,130,246,0.06)",
                filter: "blur(100px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                right: "-5%",
                width: 400,
                height: 400,
                borderRadius: "50%",
                background: "rgba(99,102,241,0.05)",
                filter: "blur(80px)",
              }}
            />
          </div>

          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 20px",
              width: "100%",
            }}
          >
            <div className="hero-grid">
              {/* Text */}
              <div className="hero-text animate-fade-in-left">
                {hero?.show_availability_badge && (
                  <div
                    className="status-badge"
                    style={{ marginBottom: 20, width: "fit-content" }}
                  >
                    {getText(hero.availability_badge, lang)}
                  </div>
                )}
                {fullName && (
                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--color-text-muted)",
                      marginBottom: 8,
                    }}
                  >
                    {lang === "en" ? "Hi, I'm " : "Halo, saya "}
                    <span
                      style={{
                        color: "var(--color-accent-bright)",
                        fontWeight: 600,
                      }}
                    >
                      {fullName}
                    </span>
                  </p>
                )}
                <h1
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.25rem)",
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                    marginBottom: 16,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {getText(hero?.headline, lang) ||
                    "Building Digital Experiences"}
                </h1>
                {hero?.subheadline && (
                  <p
                    style={{
                      fontSize: "clamp(1rem, 2.5vw, 1.375rem)",
                      fontWeight: 600,
                      color: "var(--color-accent-bright)",
                      marginBottom: 16,
                    }}
                  >
                    {getText(hero.subheadline, lang)}
                  </p>
                )}
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.75,
                    marginBottom: 28,
                    maxWidth: 480,
                  }}
                >
                  {getText(hero?.short_intro, lang)}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 28,
                  }}
                  className="hero-cta-center"
                >
                  <Link to="/projects" className="btn-primary">
                    {ctaPrimary} <ArrowRight size={15} />
                  </Link>
                  <Link to="/contact" className="btn-secondary">
                    {ctaSecondary}
                  </Link>
                </div>
                {(socialLinks || []).length > 0 && (
                  <div
                    style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                    className="hero-social-center"
                  >
                    {(socialLinks || []).map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target={link.open_in_new_tab ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        title={link.label}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          border: "1px solid var(--color-border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-text-muted)",
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                        }}
                        className="social-icon-btn"
                      >
                        {PLATFORM_ICONS[link.platform.toLowerCase()] || (
                          <ExternalLink size={15} />
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Image */}
              <div
                className="hero-image animate-fade-in-right"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: -16,
                      borderRadius: 28,
                      background: "rgba(59,130,246,0.06)",
                      filter: "blur(24px)",
                    }}
                  />
                  <div
                    className="animate-float"
                    style={{
                      position: "relative",
                      width: "clamp(200px, 30vw, 300px)",
                      height: "clamp(200px, 30vw, 300px)",
                      borderRadius: 24,
                      border: "1px solid var(--color-border-glow)",
                      overflow: "hidden",
                      background: "var(--color-surface-2)",
                      boxShadow:
                        "0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.1)",
                    }}
                  >
                    {hero?.profile_image_url ? (
                      <img
                        src={hero.profile_image_url}
                        alt={fullName || "Profile"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #3b82f6, #6366f1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: 32,
                            fontWeight: 900,
                          }}
                        >
                          {(fullName || "A")[0]}
                        </div>
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--color-text-muted)",
                          }}
                        >
                          Profile Photo
                        </p>
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, var(--color-surface-alt), transparent)",
                      }}
                    />
                  </div>
                  {location && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -12,
                        right: -12,
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        color: "var(--color-text-secondary)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <MapPin
                        size={12}
                        style={{ color: "var(--color-accent)", flexShrink: 0 }}
                      />
                      {location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── STATS STRIP ── */}
      {about && (
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface-alt)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
            <div className="stats-grid">
              {[
                {
                  num: `${about.years_of_experience || 0}+`,
                  label: lang === "en" ? "Years Exp." : "Tahun Pengalaman",
                },
                {
                  num: `${(projects || []).length}+`,
                  label: lang === "en" ? "Projects" : "Proyek",
                },
                {
                  num: `${(skills || []).flatMap((c) => c.skills).length}+`,
                  label: lang === "en" ? "Technologies" : "Teknologi",
                },
                {
                  num: `${(blogPosts || []).length}+`,
                  label: lang === "en" ? "Articles" : "Artikel",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    padding: "20px 16px",
                    textAlign: "center",
                    borderRight:
                      i < 3 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                      fontWeight: 900,
                      color: "var(--color-accent-bright)",
                      lineHeight: 1,
                    }}
                  >
                    {stat.num}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-muted)",
                      marginTop: 4,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ABOUT PREVIEW ── */}
      {s["about_preview"] !== false && about && (
        <Section>
          <div className="two-col-grid">
            <div>
              <SectionLabel
                text={lang === "en" ? "About Me" : "Tentang Saya"}
              />
              <h2 className="section-title" style={{ marginBottom: 16 }}>
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
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: 20,
                }}
              >
                {getText(about.short_bio, lang)}
              </p>
              {(about.highlights || []).length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 24,
                  }}
                >
                  {(about.highlights || []).slice(0, 4).map((h, i) => (
                    <span key={i} className="tag">
                      {typeof h === "string" ? h : ""}
                    </span>
                  ))}
                </div>
              )}
              <Link
                to="/about"
                className="btn-secondary"
                style={{ fontSize: 13 }}
              >
                {lang === "en" ? "More About Me" : "Lebih Lanjut"}{" "}
                <ArrowRight size={13} />
              </Link>
            </div>
            {featuredSkills.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    marginBottom: 14,
                  }}
                >
                  {lang === "en" ? "Featured Skills" : "Keahlian Utama"}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {featuredSkills.slice(0, 18).map((skill) => (
                    <span
                      key={skill.id}
                      className="tag"
                      style={{ fontSize: 12 }}
                    >
                      {getText(skill.name, lang)}
                    </span>
                  ))}
                </div>
                <Link
                  to="/about#skills"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 16,
                    fontSize: 12,
                    color: "var(--color-accent-bright)",
                    textDecoration: "none",
                  }}
                >
                  {lang === "en" ? "View all skills" : "Lihat semua"}{" "}
                  <ArrowRight size={11} />
                </Link>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ── FEATURED PROJECTS ── */}
      {s["featured_projects"] !== false && featuredProjects.length > 0 && (
        <Section alt>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 36,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <SectionLabel text={lang === "en" ? "Portfolio" : "Portofolio"} />
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "var(--color-accent-bright)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {lang === "en" ? "View all" : "Lihat semua"}{" "}
              <ArrowRight size={13} />
            </Link>
          </div>
          <div className="card-grid">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className="card-glass"
                style={{
                  textDecoration: "none",
                  display: "block",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 180,
                    background:
                      "linear-gradient(135deg, var(--color-surface-2), var(--color-surface))",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt={getText(project.title, lang)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      className="card-img-hover"
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 48,
                          fontWeight: 900,
                          color: "var(--color-border-glow)",
                          opacity: 0.5,
                        }}
                      >
                        {getText(project.title, lang)[0]}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, var(--color-surface-alt), transparent)",
                    }}
                  />
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                      marginBottom: 6,
                      lineHeight: 1.3,
                    }}
                  >
                    {getText(project.title, lang)}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                      marginBottom: 12,
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {getText(project.short_description, lang)}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {project.tech_stack.slice(0, 3).map((tech) => (
                      <span key={tech} className="tag" style={{ fontSize: 11 }}>
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <span className="tag" style={{ fontSize: 11 }}>
                        +{project.tech_stack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ── EXPERIENCE PREVIEW ── */}
      {s["experience_preview"] !== false && recentExperience.length > 0 && (
        <Section>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 36,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <SectionLabel text={lang === "en" ? "Career" : "Karier"} />
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "var(--color-accent-bright)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {lang === "en" ? "Full history" : "Riwayat lengkap"}{" "}
              <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentExperience.map((exp) => (
              <div
                key={exp.id}
                className="card-glass"
                style={{
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Briefcase
                    size={18}
                    style={{ color: "var(--color-accent)" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {getText(exp.role, lang)}
                    </span>
                    {exp.is_current && (
                      <span
                        className="status-badge"
                        style={{ fontSize: 10, padding: "2px 8px" }}
                      >
                        {lang === "en" ? "Current" : "Sekarang"}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-accent-bright)",
                      fontWeight: 500,
                    }}
                  >
                    {getText(exp.organization, lang)}
                  </p>
                  {exp.location && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-muted)",
                        marginTop: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <MapPin size={10} />
                      {getText(exp.location, lang)}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span className="tag" style={{ fontSize: 11 }}>
                    {exp.employment_type}
                  </span>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-muted)",
                      marginTop: 6,
                    }}
                  >
                    {exp.start_date?.slice(0, 7)} —{" "}
                    {exp.is_current
                      ? lang === "en"
                        ? "Present"
                        : "Sekarang"
                      : exp.end_date?.slice(0, 7)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── BLOG PREVIEW ── */}
      {s["blog_preview"] !== false &&
        s["blog_page"] !== false &&
        featuredPosts.length > 0 && (
          <Section alt>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 36,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <SectionLabel text="Writing" />
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "var(--color-accent-bright)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {lang === "en" ? "All articles" : "Semua artikel"}{" "}
                <ArrowRight size={13} />
              </Link>
            </div>
            <div className="card-grid">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="card-glass"
                  style={{
                    textDecoration: "none",
                    display: "block",
                    overflow: "hidden",
                  }}
                >
                  {post.cover_image_url && (
                    <div style={{ height: 160, overflow: "hidden" }}>
                      <img
                        src={post.cover_image_url}
                        alt={getText(post.title, lang)}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                        }}
                        className="card-img-hover"
                      />
                    </div>
                  )}
                  <div style={{ padding: "16px 18px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        marginBottom: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="tag"
                          style={{ fontSize: 11 }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        marginBottom: 8,
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {getText(post.title, lang)}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.6,
                        marginBottom: 12,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {getText(post.excerpt, lang)}
                    </p>
                    {post.published_at && (
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--color-text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Calendar size={11} />
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

      {/* ── CONTACT CTA ── */}
      {s["contact_cta"] !== false && (
        <Section>
          <div
            style={{
              position: "relative",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid var(--color-border)",
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.06), var(--color-surface-card), rgba(99,102,241,0.06))",
              padding: "clamp(32px, 6vw, 64px) clamp(24px, 5vw, 80px)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 200,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)",
              }}
            />
            <SectionLabel
              text={
                lang === "en" ? "Let's Work Together" : "Mari Berkolaborasi"
              }
            />
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 900,
                color: "var(--color-text-primary)",
                marginBottom: 12,
                lineHeight: 1.15,
              }}
            >
              {getText(contactSettings?.section_title, lang) ||
                (lang === "en" ? "Have a project in mind?" : "Punya proyek?")}
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--color-text-secondary)",
                maxWidth: 480,
                margin: "0 auto 28px",
                lineHeight: 1.7,
              }}
            >
              {getText(contactSettings?.section_subtitle, lang) ||
                (lang === "en"
                  ? "I'm always open to discussing new opportunities."
                  : "Saya selalu terbuka untuk peluang baru.")}
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <Link to="/contact" className="btn-primary">
                {lang === "en" ? "Send a Message" : "Kirim Pesan"}{" "}
                <ArrowRight size={15} />
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
        </Section>
      )}
    </div>
  );
}
