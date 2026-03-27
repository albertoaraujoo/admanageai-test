'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutGrid, List, Plus, ChevronDown, FolderPlus, FileText, Search } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Button } from '@/components/ui/button'
import { ProjectsGallery } from './projects-gallery'

type ViewMode = 'grid' | 'list'
type ProjectTypeFilter = 'all' | 'image'
type ProjectStatusFilter = 'all' | 'completed' | 'generating' | 'failed'

export function ProjectsPageClient() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<ProjectTypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>('all')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Projects</h1>

        <div className="flex items-center gap-2">
          {/* Grid / List toggle */}
          <div className="flex items-center rounded-lg border border-border bg-surface-overlay p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={twMerge(
                'flex h-7 w-7 items-center justify-center rounded-md transition-all',
                viewMode === 'grid'
                  ? 'bg-surface-raised text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              )}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={twMerge(
                'flex h-7 w-7 items-center justify-center rounded-md transition-all',
                viewMode === 'list'
                  ? 'bg-surface-raised text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              )}
            >
              <List size={14} />
            </button>
          </div>

          {/* Add new dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              size="md"
              onClick={() => setDropdownOpen((v) => !v)}
              className="gap-1.5"
            >
              <Plus size={14} />
              Add new
              <ChevronDown
                size={12}
                className={twMerge('transition-transform', dropdownOpen && 'rotate-180')}
              />
            </Button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 min-w-48 overflow-hidden rounded-xl border border-border bg-surface-raised shadow-xl">
                <button
                  onClick={() => {
                    setDropdownOpen(false)
                    router.push('/home')
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-white/5"
                >
                  <Plus size={14} className="text-foreground-muted" />
                  New project
                </button>
                <button
                  disabled
                  className="flex w-full cursor-not-allowed items-center gap-3 px-4 py-2.5 text-sm text-foreground-muted"
                >
                  <FileText size={14} className="text-foreground-subtle" />
                  <span>New template</span>
                  <span className="ml-auto rounded-full bg-surface-overlay px-2 py-0.5 text-[10px]">
                    soon
                  </span>
                </button>
                <button
                  disabled
                  className="flex w-full cursor-not-allowed items-center gap-3 px-4 py-2.5 text-sm text-foreground-muted"
                >
                  <FolderPlus size={14} className="text-foreground-subtle" />
                  <span>New folder</span>
                  <span className="ml-auto rounded-full bg-surface-overlay px-2 py-0.5 text-[10px]">
                    soon
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-md">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file or folder name"
            className="h-10 w-full rounded-xl border border-border bg-surface-overlay pl-9 pr-3 text-sm text-foreground placeholder:text-foreground-subtle transition-all focus:border-border-strong focus:outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ProjectTypeFilter)}
            className="h-10 appearance-none rounded-xl border border-border bg-surface-overlay pl-3 pr-8 text-sm text-foreground transition-all focus:border-border-strong focus:outline-none"
          >
            <option value="all">All type</option>
            <option value="image">Image</option>
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatusFilter)}
            className="h-10 appearance-none rounded-xl border border-border bg-surface-overlay pl-3 pr-8 text-sm text-foreground transition-all focus:border-border-strong focus:outline-none"
          >
            <option value="all">All status</option>
            <option value="completed">Completed</option>
            <option value="generating">Generating</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted"
          />
        </div>
      </div>

      <ProjectsGallery
        viewMode={viewMode}
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
      />
    </div>
  )
}
