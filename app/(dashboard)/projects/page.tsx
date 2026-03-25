import { ProjectsGallery } from '@/components/projects/projects-gallery'

export const metadata = {
  title: 'Projects — AdManage AI',
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            All your AI-generated image ads, in one place.
          </p>
        </div>
      </div>

      <ProjectsGallery />
    </div>
  )
}
