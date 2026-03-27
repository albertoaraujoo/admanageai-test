'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  TrendingUp,
  FolderOpen,
  ShoppingBag,
  Users,
  BarChart2,
  Rocket,
  Mic2,
  Palette,
  Layers,
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useSidebar } from './sidebar-context'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const CLICKABLE_ROUTES = new Set(['/home', '/projects', '/products'])

const CREATE_LINKS: NavItem[] = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Market Trends', href: '/trends', icon: TrendingUp },
  { label: 'Projects', href: '/projects', icon: FolderOpen },
]

const ASSET_LINKS: NavItem[] = [
  { label: 'Products', href: '/products', icon: ShoppingBag },
  { label: 'Avatars', href: '/avatars', icon: Users },
  { label: 'Voices', href: '/voices', icon: Mic2 },
  { label: 'Brand Kits', href: '/brand-kits', icon: Palette },
  { label: 'Smart Assets', href: '/smart-assets', icon: Layers },
]

const ANALYZE_LINKS: NavItem[] = [
  { label: 'Competitor Tracker', href: '/competitor', icon: BarChart2 },
  { label: 'Ad Insights', href: '/insights', icon: TrendingUp },
  { label: 'Ad Launcher', href: '/launcher', icon: Rocket },
]

function SidebarNavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === item.href
  const isClickable = CLICKABLE_ROUTES.has(item.href)
  const Icon = item.icon

  const classes = twMerge(
    'flex items-center rounded-lg transition-all',
    collapsed
      ? 'h-9 w-9 justify-center'
      : 'gap-2.5 px-3 py-[7px] text-[13px]',
    isClickable && isActive
      ? 'bg-primary/10 text-primary font-medium'
      : 'text-foreground-muted hover:bg-white/5 hover:text-foreground'
  )

  if (!isClickable) {
    return (
      <button
        type="button"
        onClick={(e) => e.preventDefault()}
        title={collapsed ? item.label : `${item.label} (coming soon)`}
        aria-label={item.label}
        className={classes}
      >
        <Icon size={14} className="shrink-0" />
        {!collapsed && item.label}
      </button>
    )
  }

  return (
    <Link href={item.href} title={collapsed ? item.label : undefined} className={classes}>
      <Icon size={14} className="shrink-0" />
      {!collapsed && item.label}
    </Link>
  )
}

function NavSection({
  title,
  items,
  collapsed,
}: {
  title: string
  items: NavItem[]
  collapsed: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {!collapsed && (
        <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-foreground-subtle">
          {title}
        </p>
      )}
      {items.map((item) => (
        <SidebarNavLink key={item.href} item={item} collapsed={collapsed} />
      ))}
    </div>
  )
}

export function SidebarNav() {
  const { collapsed } = useSidebar()

  return (
    <nav
      className={twMerge(
        'flex flex-1 flex-col overflow-y-auto py-4',
        collapsed ? 'items-center gap-1 px-1.5' : 'gap-5 px-2'
      )}
    >
      <NavSection title="Create" items={CREATE_LINKS} collapsed={collapsed} />
      {collapsed && <div className="my-1 h-px w-6 bg-border" />}
      <NavSection title="Manage Assets" items={ASSET_LINKS} collapsed={collapsed} />
      {collapsed && <div className="my-1 h-px w-6 bg-border" />}
      <NavSection title="Analyze & Launch Ads" items={ANALYZE_LINKS} collapsed={collapsed} />
    </nav>
  )
}
