'use client'

import { useAppStore } from '@/lib/store'
import { ProjectCard } from './project-card'
import { ProjectsEmptyState } from './empty-state'

export function ProjectsGallery() {
  const generatedProjects = useAppStore((s) => s.generatedProjects)

  if (generatedProjects.length === 0) {
    return <ProjectsEmptyState />
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {generatedProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
