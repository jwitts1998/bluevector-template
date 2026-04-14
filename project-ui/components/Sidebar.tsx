'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayout } from './LayoutProvider';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Settings,
  Palette,
  Map,
  Hammer,
  MessageSquare,
  Bot,
  ListChecks,
  FileText,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Workflow,
  PenTool,
  BarChart3,
  FolderKanban,
} from 'lucide-react';

const navGroups = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'AI Chat', href: '/chat', icon: MessageSquare },
    ],
  },
  {
    label: 'Design',
    color: 'bg-cyan-500',
    items: [
      { label: 'Design Hub', href: '/design', icon: Palette },
      { label: 'Document Builder', href: '/design/create', icon: PenTool },
      { label: 'Blueprints', href: '/design/blueprints', icon: PenTool },
      { label: 'Process Flows', href: '/design/flows', icon: Workflow },
    ],
  },
  {
    label: 'Plan',
    color: 'bg-orange-500',
    items: [
      { label: 'Planning Hub', href: '/planning', icon: Map },
      { label: 'Epics & Stories', href: '/planning/epics', icon: FolderKanban },
      { label: 'Task Board', href: '/tasks', icon: ListChecks },
    ],
  },
  {
    label: 'Build',
    color: 'bg-lime-500',
    items: [
      { label: 'Build Hub', href: '/build', icon: Hammer },
      { label: 'Agents', href: '/agents', icon: Bot },
      { label: 'Analytics', href: '/build/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    color: 'bg-purple-500',
    items: [
      { label: 'GCP Setup', href: '/setup', icon: Cloud },
      { label: 'Configuration', href: '/setup/config', icon: Settings },
      { label: 'Docs', href: '/docs', icon: FileText },
    ],
  },
];

// Colors are now inline on each navGroup

export function Sidebar() {
  const { sidebarCollapsed: collapsed, toggleSidebar } = useLayout();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-3 gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://storage.googleapis.com/bv-presto-prod-website-public/00000000-0000-0000-0000-000000000000-logo.png"
          alt="BlueVector AI"
          className="h-8 w-8 rounded-lg object-contain shrink-0"
        />
        {!collapsed && (
          <div className="min-w-0">
            <span className="font-bold text-sm block leading-tight" style={{ color: '#1e52f1' }}>
              BlueVector.AI
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              GCP Consultancy
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {!collapsed && (
              <div className="flex items-center gap-2 px-3 py-2">
                {group.color && (
                  <div className={cn('w-1.5 h-1.5 rounded-full', group.color)} />
                )}
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </span>
              </div>
            )}
            {collapsed && group.color && (
              <div className="flex justify-center py-1">
                <div className={cn('w-6 h-0.5 rounded-full', group.color)} />
              </div>
            )}
            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'text-white font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                  style={isActive ? { backgroundColor: '#1e52f1' } : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t p-2">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          {!collapsed && <span className="ml-2">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
