'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Cloud, CheckCircle2 } from 'lucide-react';

interface ProjectInfo {
  name: string;
  stack: string;
  agentCount: number;
  taskCount: number;
  docsCount: number;
}

const AREA_MAP: Record<string, { label: string; className: string }> = {
  '/setup': { label: 'System', className: 'phase-badge-setup' },
  '/design': { label: 'Design', className: 'phase-badge-design' },
  '/planning': { label: 'Plan', className: 'phase-badge-planning' },
  '/build': { label: 'Build', className: 'phase-badge-build' },
  '/tasks': { label: 'Plan', className: 'phase-badge-planning' },
  '/chat': { label: 'AI Chat', className: 'phase-badge-build' },
  '/agents': { label: 'Build', className: 'phase-badge-build' },
  '/docs': { label: 'System', className: 'phase-badge-setup' },
};

function getCurrentArea(pathname: string): { label: string; className: string } | null {
  for (const [prefix, area] of Object.entries(AREA_MAP)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return area;
    }
  }
  return null;
}

export function Header() {
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const pathname = usePathname();
  const currentArea = getCurrentArea(pathname);

  useEffect(() => {
    fetch('/api/project')
      .then((r) => r.json())
      .then(setProject)
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background/95 backdrop-blur px-4 md:px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold" style={{ color: '#1e52f1' }}>
          {project?.name || 'BlueVector.AI'}
        </h1>
        {currentArea && (
          <span className={`phase-badge ${currentArea.className}`}>
            {currentArea.label}
          </span>
        )}
      </div>
      <div className="ml-auto flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Cloud className="h-3.5 w-3.5" style={{ color: '#1e52f1' }} />
          <span className="text-xs font-medium">GCP</span>
          <CheckCircle2 className="h-3 w-3" style={{ color: '#afe535' }} />
        </div>
        {project && (
          <>
            <Badge variant="secondary" className="text-xs font-normal">
              {project.agentCount} agents
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              {project.taskCount} tasks
            </Badge>
          </>
        )}
      </div>
    </header>
  );
}
