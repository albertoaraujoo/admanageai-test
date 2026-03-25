'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Download, Edit, Maximize2, Sparkles } from 'lucide-react'
import type { GeneratedProject } from '@/types/project'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/lib/toast'

interface ImageViewerModalProps {
  project: GeneratedProject
  onClose: () => void
}

export function ImageViewerModal({ project, onClose }: ImageViewerModalProps) {
  const { isPro, upgradeToPro } = useAppStore()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleDownload = () => {
    if (!isPro) {
      toast.info('Faça upgrade para Pro para baixar sem marca d\'água.')
      return
    }
    const link = document.createElement('a')
    link.href = project.imageUrl
    link.download = `admanage-${project.id}.jpg`
    link.click()
    toast.success('Download iniciado!')
  }

  const handleUpgrade = () => {
    upgradeToPro()
    toast.success('Upgrade para Pro! Marca d\'água removida de todos os seus projetos.')
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      aria-label={project.title}
    >
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-2xl">
        {/* Image area */}
        <div className="relative flex-1 bg-black min-h-[400px]">
          <div className="relative h-full min-h-[400px] w-full">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-contain"
                sizes="800px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-foreground-muted">Imagem não disponível</p>
              </div>
            )}

            {/* Watermark overlay */}
            {project.hasWatermark && !isPro && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <p
                    key={i}
                    className="-rotate-[25deg] select-none whitespace-nowrap text-3xl font-bold text-white/20"
                  >
                    AdManage.ai &nbsp;&nbsp; AdManage.ai &nbsp;&nbsp; AdManage.ai
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex w-72 shrink-0 flex-col border-l border-border">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground line-clamp-1">
              {project.title}
            </h2>
            <button
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-foreground-muted hover:bg-white/5 hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X size={15} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 p-5">
            {/* Pro upgrade */}
            {!isPro && (
              <button
                onClick={handleUpgrade}
                className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary-muted p-3 text-left transition-all hover:border-primary/50"
              >
                <div>
                  <p className="text-xs font-semibold text-primary">Remover Marca D&apos;água</p>
                  <p className="mt-0.5 text-[11px] text-foreground-muted">
                    Faça upgrade para exportar limpo
                  </p>
                </div>
                <Sparkles size={16} className="text-primary shrink-0" />
              </button>
            )}

            {isPro && (
              <Badge variant="pro" className="w-fit">
                <Sparkles size={10} />
                Plano Pro Ativo
              </Badge>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="w-full"
              >
                <Download size={13} />
                Baixar
              </Button>
              <Button variant="secondary" size="sm" className="w-full">
                <Edit size={13} />
                Editar
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" size="sm" className="w-full">
                <Maximize2 size={13} />
                Ampliar
              </Button>
            </div>
          </div>

          {/* Meta */}
          <div className="mt-auto border-t border-border p-5">
            <div className="flex flex-col gap-2 text-xs text-foreground-muted">
              <div className="flex items-center justify-between">
                <span>Tipo</span>
                <span className="text-foreground capitalize">{project.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge
                  variant={
                    project.status === 'completed'
                      ? 'success'
                      : project.status === 'failed'
                        ? 'destructive'
                        : 'default'
                  }
                >
                  {project.status === 'completed'
                    ? 'Concluído'
                    : project.status === 'generating'
                      ? 'Gerando...'
                      : 'Falhou'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Criado em</span>
                <span className="text-foreground">
                  {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
