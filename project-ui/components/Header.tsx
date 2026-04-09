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

const PHASE_MAP: Record<string, { label: string; className: string }> = {
  '/setup': { label: 'Phase 1 — Setup', className: 'phase-badge-setup' },
  '/design': { label: 'Phase 2 — Design', className: 'phase-badge-design' },
  '/planning': { label: 'Phase 3 — Planning', className: 'phase-badge-planning' },
  '/build': { label: 'Phase 4 — Build', className: 'phase-badge-build' },
  '/tasks': { label: 'Phase 3 — Planning', className: 'phase-badge-planning' },
  '/chat': { label: 'Phase 4 — Build', className: 'phase-badge-build' },
  '/agents': { label: 'Phase 4 — Build', className: 'phase-badge-build' },
};

function getCurrentPhase(pathname: string): { label: string; className: string } | null {
  for (const [prefix, phase] of Object.entries(PHASE_MAP)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return phase;
    }
  }
  return null;
}

export function Header() {
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const pathname = usePathname();
  const currentPhase = getCurrentPhase(pathname);

  useEffect(() => {
    fetch('/api/project')
      .then((r) => r.json())
      .then(setProject)
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background/95 backdrop-blur px-4 md:px-6">
      <div className="flex items-center gap-3">
        {currentPhase && (
          <span className={`phase-badge ${currentPhase.className}`}>
            {currentPhase.label}
          </span>
        )}
        {!currentPhase && (
          <h1 className="text-lg font-semibold" style={{ color: '#1e52f1' }}>
            {project?.name || 'BlueVector.AI'}
          </h1>
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
