import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'
import { publicAPI } from '@/api/public'
import { useLanguageStore } from '@/store/languageStore'
import { getText } from '@/types'
import { PageLoadSkeleton, EmptyState } from '@/components/public/LoadingStates'

export default function ProjectsPage() {
  const { lang } = useLanguageStore()
  const { data: projects, isLoading } = useQuery({ queryKey: ['projects'], queryFn: publicAPI.getProjects })

  if (isLoading) return <PageLoadSkeleton />

  return (
    <div className="page-section">
      <div className="text-center mb-16 animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Portfolio</p>
        <h1 className="section-title mb-4">{lang === 'en' ? <>My <span>Projects</span></> : <><span>Proyek</span> Saya</>}</h1>
        <p className="section-subtitle mx-auto text-center">
          {lang === 'en' ? 'A collection of projects I have built, contributed to, or am currently working on.' : 'Kumpulan proyek yang telah saya bangun, kontribusikan, atau sedang kerjakan.'}
        </p>
      </div>

      {(projects || []).length === 0 ? (
        <EmptyState message={lang === 'en' ? 'No projects yet' : 'Belum ada proyek'} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(projects || []).map(project => (
            <div key={project.id} className="card-glass group overflow-hidden flex flex-col">
              <div className="h-48 bg-linear-to-br from-surface-2 to-surface relative overflow-hidden">
                {project.cover_image_url ? (
                  <img src={project.cover_image_url} alt={getText(project.title, lang)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-text-muted text-5xl font-black opacity-10">{getText(project.title, lang)[0]}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                {project.is_featured && (
                  <div className="absolute top-3 right-3 tag text-xs">Featured</div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="font-bold text-text-primary mb-2 group-hover:text-accent-bright transition-colors">
                  {getText(project.title, lang)}
                </h2>
                <p className="text-sm text-text-secondary mb-4 flex-1 line-clamp-3">
                  {getText(project.short_description, lang)}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech_stack.slice(0, 4).map(tech => (
                    <span key={tech} className="tag text-xs">{tech}</span>
                  ))}
                  {project.tech_stack.length > 4 && <span className="tag text-xs">+{project.tech_stack.length - 4}</span>}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <Link to={`/projects/${project.slug}`} className="flex items-center gap-1.5 text-sm text-accent-bright hover:gap-2.5 transition-all font-medium">
                    {lang === 'en' ? 'Details' : 'Detail'} <ArrowRight size={14} />
                  </Link>
                  <div className="flex gap-2 ml-auto">
                    {project.live_demo_url && (
                      <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-text-muted hover:text-accent-bright transition-colors" title="Live Demo">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {project.repo_url && (
                      <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-text-muted hover:text-accent-bright transition-colors" title="Repository">
                        <Github size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
