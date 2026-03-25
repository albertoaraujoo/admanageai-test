'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageIcon, Loader2, AlertCircle } from 'lucide-react'
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
                  <p className="-rotate-[25deg] select-none text-sm font-bold text-white/30">
                    AdManage.ai
                  </p>
                </div>
              )}
            </>
          ) : project.status === 'generating' ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <Loader2 size={22} className="animate-spin text-primary" />
              <p className="text-xs text-foreground-muted">Gerando...</p>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <AlertCircle size={22} className="text-destructive" />
              <p className="text-xs text-foreground-muted">Falhou</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2.5">
          <p className="truncate text-xs font-medium text-foreground">{project.title}</p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-[11px] text-foreground-subtle">
              {new Date(project.createdAt).toLocaleDateString('pt-BR')}
            </span>
            {project.status === 'generating' ? (
              <Badge variant="default">
                <Loader2 size={10} className="animate-spin" />
                Gerando
              </Badge>
            ) : project.status === 'failed' ? (
              <Badge variant="destructive">Falhou</Badge>
            ) : (
              <Badge variant="default">
                <ImageIcon size={9} />
                Imagem
              </Badge>
            )}
          </div>
        </div>
      </article>

      {viewerOpen && (
        <ModalPortal>
          <ImageViewerModal
            project={project}
            onClose={() => setViewerOpen(false)}
          />
        </ModalPortal>
      )}
    </>
  )
}
