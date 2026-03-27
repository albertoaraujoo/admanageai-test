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

interface ProjectCardProps {
  project: GeneratedProject
}

export function ProjectCard({ project }: ProjectCardProps) {
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
      <article
        onClick={() => project.status === 'completed' && setViewerOpen(true)}
        data-slot="project-card"
        className={twMerge(
          'group overflow-hidden rounded-xl border border-border bg-surface-raised transition-all',
          project.status === 'completed'
            ? 'cursor-pointer hover:border-border-strong'
            : 'cursor-default'
        )}
      >
        {/* Thumbnail */}
        <div className="relative aspect-square overflow-hidden bg-surface-hover">
          {project.status === 'completed' && project.thumbnailUrl ? (
            <>
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {project.hasWatermark && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <p className="-rotate-25 select-none text-sm font-bold text-white/30">
                    AdManage.ai
                  </p>
                </div>
              )}
            </>
          ) : project.status === 'generating' ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <Loader2 size={22} className="animate-spin text-primary" />
              <p className="text-xs text-foreground-muted">Generating…</p>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <AlertCircle size={22} className="text-destructive" />
              <p className="text-xs text-foreground-muted">Failed</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2.5">
          <p className="truncate text-xs font-medium text-foreground">{project.title}</p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            {/* Left: badge + date */}
            <div className="flex min-w-0 items-center gap-2">
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
                  Images
                </Badge>
              )}
              <span className="truncate text-[11px] text-foreground-subtle">
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Right: context menu */}
            <div
              ref={menuRef}
              className="relative shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-white/10 hover:text-foreground"
                aria-label="More options"
              >
                <MoreVertical size={13} />
              </button>

              {menuOpen && (
                <div className="absolute bottom-full right-0 z-20 mb-1 min-w-[130px] overflow-hidden rounded-xl border border-border bg-surface-overlay shadow-xl">
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
        </div>
      </article>

      {viewerOpen && (
        <ModalPortal>
          <ImageViewerModal project={project} onClose={() => setViewerOpen(false)} />
        </ModalPortal>
      )}
    </>
  )
}
