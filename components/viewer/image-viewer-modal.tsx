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
      toast.info('Upgrade to Pro to download without watermark.')
      return
    }
    const link = document.createElement('a')
    link.href = project.imageUrl
    link.download = `admanage-${project.id}.jpg`
    link.click()
    toast.success('Download started!')
  }

  const handleUpgrade = () => {
    upgradeToPro()
    toast.success('Upgraded to Pro! Watermark removed from all your projects.')
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
        <div className="relative min-h-[400px] flex-1 bg-black">
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
                <p className="text-sm text-foreground-muted">Image not available</p>
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
            <h2 className="line-clamp-1 text-sm font-semibold text-foreground">
              {project.title}
            </h2>
            <button
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 p-5">
            {/* Pro upgrade banner */}
            {!isPro && (
              <button
                onClick={handleUpgrade}
                className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary-muted p-3 text-left transition-all hover:border-primary/50"
              >
                <div>
                  <p className="text-xs font-semibold text-primary">Remove Watermark</p>
                  <p className="mt-0.5 text-[11px] text-foreground-muted">
                    Upgrade to export clean images
                  </p>
                </div>
                <Sparkles size={16} className="shrink-0 text-primary" />
              </button>
            )}

            {isPro && (
              <Badge variant="pro" className="w-fit">
                <Sparkles size={10} />
                Pro Plan Active
              </Badge>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={handleDownload} className="w-full">
                <Download size={13} />
                Download
              </Button>
              <Button variant="secondary" size="sm" className="w-full">
                <Edit size={13} />
                Edit
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="w-full">
              <Maximize2 size={13} />
              Full screen
            </Button>
          </div>

          {/* Meta */}
          <div className="mt-auto border-t border-border p-5">
            <div className="flex flex-col gap-2 text-xs text-foreground-muted">
              <div className="flex items-center justify-between">
                <span>Type</span>
                <span className="capitalize text-foreground">{project.type}</span>
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
                    ? 'Completed'
                    : project.status === 'generating'
                      ? 'Generating…'
                      : 'Failed'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Created</span>
                <span className="text-foreground">
                  {new Date(project.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
