import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Globe, Download } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useLanguageStore } from "@/store/languageStore";
import { useQuery } from "@tanstack/react-query";
import { publicAPI } from "@/api/public";
import { getText } from "@/types";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useThemeStore();
  const { lang, setLang } = useLanguageStore();
  const location = useLocation();

  const { data: nav } = useQuery({
    queryKey: ["navigation"],
    queryFn: publicAPI.getNavigation,
    staleTime: 5 * 60 * 1000,
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
  const { data: resume } = useQuery({
    queryKey: ["resume"],
    queryFn: publicAPI.getResume,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brandName = settings?.site?.brand_name || "DevPortfolio";
  const enableThemeSwitcher = settings?.theme?.enable_theme_switcher !== false;
  const enableLangSwitcher =
    settings?.language?.enable_language_switcher !== false;
  const showBlog = sections?.["blog_page"] !== false;

  const navItems = nav || [];

  const filteredNav = navItems.filter((item) => {
    if (item.href === "/blog" && !showBlog) return false;
    return true;
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm group-hover:shadow-[0_0_16px_rgba(59,130,246,0.6)] transition-shadow">
              {brandName[0]}
            </div>
            <span className="font-bold text-text-primary hidden sm:block">
              {brandName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {filteredNav.map((item) =>
              item.is_external ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`nav-item text-sm`}
                >
                  {getText(item.label, lang)}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`nav-item text-sm ${location.pathname === item.href ? "active" : ""}`}
                >
                  {getText(item.label, lang)}
                </Link>
              ),
            )}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            {enableLangSwitcher && (
              <button
                onClick={() => setLang(lang === "en" ? "id" : "en")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-accent-bright hover:bg-accent-glow transition-all"
                title="Switch language"
              >
                <Globe size={14} />
                <span className="uppercase">{lang}</span>
              </button>
            )}

            {/* Theme switcher */}
            {enableThemeSwitcher && (
              <button
                onClick={toggle}
                className="p-2 rounded-lg text-text-secondary hover:text-accent-bright hover:bg-accent-glow transition-all"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* CV Download */}
            {resume?.enable_cv_download && resume?.cv_url && (
              <a
                href={resume.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex btn-primary text-xs py-2 px-3 gap-1.5"
              >
                <Download size={13} />
                {getText(resume.button_label, lang)}
              </a>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {filteredNav.map((item) =>
              item.is_external ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-item"
                  onClick={() => setOpen(false)}
                >
                  {getText(item.label, lang)}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`nav-item ${location.pathname === item.href ? "active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {getText(item.label, lang)}
                </Link>
              ),
            )}
            {resume?.enable_cv_download && resume?.cv_url && (
              <a
                href={resume.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary mt-2 justify-center text-sm"
              >
                <Download size={14} />
                {getText(resume.button_label, lang)}
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
