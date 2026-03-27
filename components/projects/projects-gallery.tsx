'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ImageIcon, Loader2, AlertCircle, MoreVertical, FolderInput, Trash2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import type { GeneratedProject } from '@/types/project'
import { ImageViewerModal } from '@/components/viewer/image-viewer-modal'
import { ModalPortal } from '@/components/ui/modal-portal'
import { Badge } from '@/components/ui/badge'
import { twMerge } from 'tailwind-merge'
import { ProjectCard } from './project-card'
import { ProjectsEmptyState } from './empty-state'

type ViewMode = 'grid' | 'list'
type ProjectTypeFilter = 'all' | 'image'
type ProjectStatusFilter = 'all' | 'completed' | 'generating' | 'failed'

export function ProjectsGallery({
  viewMode = 'grid',
  searchQuery = '',
  typeFilter = 'all',
  statusFilter = 'all',
}: {
  viewMode?: ViewMode
  searchQuery?: string
  typeFilter?: ProjectTypeFilter
  statusFilter?: ProjectStatusFilter
}) {
  const generatedProjects = useAppStore((s) => s.generatedProjects)
  const q = searchQuery.trim().toLowerCase()
  const filteredProjects = generatedProjects.filter((project) => {
    const matchesSearch = q.length === 0 || project.title.toLowerCase().includes(q)
    const matchesType = typeFilter === 'all' || project.type === typeFilter
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  if (filteredProjects.length === 0) {
    return <ProjectsEmptyState />
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-1">
        {/* Header row */}
        <div className="grid grid-cols-[44px_1fr_160px_90px_36px] items-center gap-4 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
          <span />
          <span>Name</span>
          <span>Date</span>
          <span>Status</span>
          <span />
        </div>
        {filteredProjects.map((project) => (
          <ProjectListRow key={project.id} project={project} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

function ProjectListRow({ project }: { project: GeneratedProject }) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const deleteProject = useAppStore((s) => s.deleteProject)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteProject(project.id)
    toast.success('Project deleted.')
    setMenuOpen(false)
  }

  return (
    <>
      <div
        onClick={() => project.status === 'completed' && setViewerOpen(true)}
        className={twMerge(
          'grid grid-cols-[44px_1fr_160px_90px_36px] items-center gap-4 rounded-xl border border-border bg-surface-raised px-4 py-3 transition-all',
          project.status === 'completed' && 'cursor-pointer hover:border-border-strong'
        )}
      >
        {/* Thumbnail */}
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-hover">
          {project.status === 'completed' && project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : project.status === 'generating' ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 size={16} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <AlertCircle size={16} className="text-destructive" />
            </div>
          )}
        </div>

        {/* Title */}
        <p className="truncate text-sm font-medium text-foreground">{project.title}</p>

        {/* Date */}
        <span className="text-xs text-foreground-muted">
          {new Date(project.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>

        {/* Status badge */}
        {project.status === 'generating' ? (
          <Badge variant="default">
            <Loader2 size={10} className="animate-spin" />
            Generating
          </Badge>
        ) : project.status === 'failed' ? (
          <Badge variant="destructive">Failed</Badge>
        ) : (
          <Badge variant="default">
            <ImageIcon size={9} />
            Image
          </Badge>
        )}

        {/* Context menu */}
        <div
          ref={menuRef}
          className="relative flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/10 hover:text-foreground"
            aria-label="More options"
          >
            <MoreVertical size={14} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 min-w-[130px] overflow-hidden rounded-xl border border-border bg-surface-overlay shadow-xl">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toast.info('Move feature coming soon.')
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-white/5"
              >
                <FolderInput size={14} className="text-foreground-muted" />
                Move
              </button>
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {viewerOpen && (
        <ModalPortal>
          <ImageViewerModal project={project} onClose={() => setViewerOpen(false)} />
        </ModalPortal>
      )}
    </>
  )
}
