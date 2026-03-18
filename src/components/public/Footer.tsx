import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import { Mail, Globe, ExternalLink, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <FaGithub size={15} />,
  linkedin: <FaLinkedin size={15} />,
  twitter: <FaXTwitter size={15} />,
  x: <FaXTwitter size={15} />,
  instagram: <FaInstagram size={15} />,
  email: <Mail size={15} />,
  whatsapp: <FaWhatsapp size={15} />,
  website: <Globe size={15} />,
};

export default function Footer() {
  const { lang } = useLanguageStore();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: publicAPI.getSettings,
    staleTime: 10 * 60 * 1000,
  });
  const { data: socialLinks } = useQuery({
    queryKey: ["social-links"],
    queryFn: publicAPI.getSocialLinks,
    staleTime: 10 * 60 * 1000,
  });

  const footerText =
    settings?.site?.footer_text ||
    `© ${new Date().getFullYear()} Alex Johnson. All rights reserved.`;
  const brandName = settings?.site?.brand_name || "DevPortfolio";
  const tagline = settings?.site?.title || "";

  const navLinks = [
    { label: lang === "en" ? "Home" : "Beranda", href: "/" },
    { label: lang === "en" ? "About" : "Tentang", href: "/about" },
    { label: lang === "en" ? "Projects" : "Proyek", href: "/projects" },
    { label: lang === "en" ? "Experience" : "Pengalaman", href: "/experience" },
    { label: "Blog", href: "/blog" },
    { label: lang === "en" ? "Contact" : "Kontak", href: "/contact" },
  ];

  return (
    <footer
      style={{
        position: "relative",
        borderTop: "1px solid var(--color-border)",
        overflow: "hidden",
      }}
    >
      {/* subtle glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 384,
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(59,130,246,0.4), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 256,
          height: 96,
          background: "rgba(59,130,246,0.03)",
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 64px) 24px 32px",
        }}
      >
        <div className="footer-grid">
          {/* Brand */}
          <div style={{ gridColumn: "span 2" }} className="footer-brand">
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 900,
                  fontSize: 14,
                  boxShadow: "0 0 12px rgba(59,130,246,0.3)",
                }}
              >
                {brandName[0]}
              </div>
              <span
                style={{
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  fontSize: 15,
                }}
              >
                {brandName}
              </span>
            </Link>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                lineHeight: 1.7,
                maxWidth: 280,
                marginBottom: 20,
              }}
            >
              {tagline ||
                (lang === "en"
                  ? "Crafting elegant software with a focus on performance and user experience."
                  : "Membangun perangkat lunak elegan dengan fokus pada performa dan pengalaman pengguna.")}
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(socialLinks || []).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.open_in_new_tab ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  title={link.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-text-muted)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-accent-bright)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--color-accent)";
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(59,130,246,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-text-muted)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--color-border)";
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                  }}
                >
                  {PLATFORM_ICONS[link.platform.toLowerCase()] || (
                    <ExternalLink size={14} />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: 16,
              }}
            >
              {lang === "en" ? "Navigation" : "Navigasi"}
            </p>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-accent-bright)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-text-secondary)";
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: 16,
              }}
            >
              {lang === "en" ? "Connect" : "Terhubung"}
            </p>
            {(socialLinks || []).length > 0 ? (
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {(socialLinks || []).map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target={link.open_in_new_tab ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "var(--color-accent-bright)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "var(--color-text-secondary)";
                      }}
                    >
                      <span
                        style={{
                          color: "var(--color-text-muted)",
                          flexShrink: 0,
                        }}
                      >
                        {PLATFORM_ICONS[link.platform.toLowerCase()] || (
                          <ExternalLink size={14} />
                        )}
                      </span>
                      {link.label}
                      {link.open_in_new_tab && (
                        <ArrowUpRight size={11} style={{ opacity: 0.5 }} />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--color-text-muted)",
                  fontStyle: "italic",
                }}
              >
                {lang === "en" ? "No links yet." : "Belum ada link."}
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="cyber-divider" style={{ margin: "32px 0 24px" }} />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            {footerText}
          </p>
        </div>
      </div>
    </footer>
  );
}
