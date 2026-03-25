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
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const CREATE_LINKS: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Market Trends', href: '/trends', icon: TrendingUp },
  { label: 'Projects', href: '/projects', icon: FolderOpen },
]

const ASSET_LINKS: NavItem[] = [
  { label: 'Products', href: '/products', icon: ShoppingBag },
  { label: 'Avatars', href: '/avatars', icon: Users },
]

const ANALYZE_LINKS: NavItem[] = [
  { label: 'Competitor Tracker', href: '/competitor', icon: BarChart2 },
  { label: 'Ad Insights', href: '/insights', icon: TrendingUp },
  { label: 'Ad Launcher', href: '/launcher', icon: Rocket },
]

interface SidebarLinkProps {
  item: NavItem
}

function SidebarNavLink({ item }: SidebarLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === item.href
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={twMerge(
        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all',
        isActive
          ? 'bg-primary-muted text-primary font-medium'
          : 'text-foreground-muted hover:bg-white/5 hover:text-foreground'
      )}
    >
      <Icon size={15} />
      {item.label}
    </Link>
  )
}

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-foreground-subtle">
        {title}
      </p>
      {items.map((item) => (
        <SidebarNavLink key={item.href} item={item} />
      ))}
    </div>
  )
}

export function SidebarNav() {
  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-2 py-4">
      <NavSection title="Criar" items={CREATE_LINKS} />
      <NavSection title="Gerenciar Ativos" items={ASSET_LINKS} />
      <NavSection title="Analisar & Lançar" items={ANALYZE_LINKS} />
    </nav>
  )
}
