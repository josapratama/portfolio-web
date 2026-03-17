import { Link } from 'react-router-dom'
import { useLanguageStore } from '@/store/languageStore'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFoundPage() {
  const { lang } = useLanguageStore()
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="text-[8rem] font-black leading-none glow-text text-accent mb-6 select-none">404</div>
        <h1 className="section-title mb-4">{lang === 'en' ? 'Page Not Found' : 'Halaman Tidak Ditemukan'}</h1>
        <p className="section-subtitle mx-auto text-center mb-8">
          {lang === 'en' ? "The page you're looking for doesn't exist or has been moved." : 'Halaman yang Anda cari tidak ada atau telah dipindahkan.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary"><Home size={16} /> {lang === 'en' ? 'Go Home' : 'Beranda'}</Link>
          <button onClick={() => window.history.back()} className="btn-secondary"><ArrowLeft size={16} /> {lang === 'en' ? 'Go Back' : 'Kembali'}</button>
        </div>
      </div>
    </div>
  )
}
