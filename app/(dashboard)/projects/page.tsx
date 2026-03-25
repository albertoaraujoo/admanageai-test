import { ProjectsGallery } from '@/components/projects/projects-gallery'

export const metadata = {
  title: 'Projetos — AdManage AI',
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Projects</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Histórico de imagens geradas com IA.
        </p>
      </div>

      <ProjectsGallery />
    </div>
  )
}
