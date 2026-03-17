import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Mail, Globe, Instagram, MessageSquare, ExternalLink } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { publicAPI } from '@/api/public'
import { useLanguageStore } from '@/store/languageStore'

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <Github size={16} />,
  linkedin: <Linkedin size={16} />,
  twitter: <Twitter size={16} />,
  x: <Twitter size={16} />,
  instagram: <Instagram size={16} />,
  email: <Mail size={16} />,
  whatsapp: <MessageSquare size={16} />,
  website: <Globe size={16} />,
}

export default function Footer() {
  const { lang } = useLanguageStore()
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: publicAPI.getSettings, staleTime: 10 * 60 * 1000 })
  const { data: socialLinks } = useQuery({ queryKey: ['social-links'], queryFn: publicAPI.getSocialLinks, staleTime: 10 * 60 * 1000 })

  const footerText = settings?.site?.footer_text || '© 2025 Alex Johnson. All rights reserved.'
  const brandName = settings?.site?.brand_name || 'DevPortfolio'

  const navLinks = [
    { label: lang === 'en' ? 'Home' : 'Beranda', href: '/' },
    { label: lang === 'en' ? 'About' : 'Tentang', href: '/about' },
    { label: lang === 'en' ? 'Projects' : 'Proyek', href: '/projects' },
    { label: lang === 'en' ? 'Experience' : 'Pengalaman', href: '/experience' },
    { label: 'Blog', href: '/blog' },
    { label: lang === 'en' ? 'Contact' : 'Kontak', href: '/contact' },
  ]

  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                {brandName[0]}
              </div>
              <span className="font-bold text-text-primary">{brandName}</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              {lang === 'en'
                ? 'Crafting elegant software with a focus on performance and user experience.'
                : 'Membangun perangkat lunak elegan dengan fokus pada performa dan pengalaman pengguna.'}
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              {lang === 'en' ? 'Navigation' : 'Navigasi'}
            </h3>
            <ul className="space-y-2">
              {navLinks.map(item => (
                <li key={item.href}>
                  <Link to={item.href}
                    className="text-sm text-text-secondary hover:text-accent-bright transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              {lang === 'en' ? 'Connect' : 'Terhubung'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(socialLinks || []).map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.open_in_new_tab ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  title={link.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary border border-border hover:border-accent hover:text-accent-bright hover:bg-accent-glow transition-all"
                >
                  {PLATFORM_ICONS[link.platform.toLowerCase()] || <ExternalLink size={14} />}
                  <span className="text-xs">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="cyber-divider mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">{footerText}</p>
          <p className="text-xs text-text-muted">
            {lang === 'en' ? 'Built with' : 'Dibuat dengan'}{' '}
            <span className="text-accent-bright">React</span> &{' '}
            <span className="text-accent-bright">Go</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
