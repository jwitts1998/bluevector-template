'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Cloud,
  Palette,
  Map,
  Hammer,
  ArrowRight,
  Bot,
  ListChecks,
  FileText,
  Settings,
  Workflow,
  PenTool,
  FolderKanban,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

interface ProjectInfo {
  name: string;
  stack: string;
  description: string;
  agentCount: number;
  taskCount: number;
  docsCount: number;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
}

const CAPABILITIES = [
  {
    id: 'chat',
    title: 'AI Chat',
    description: 'Project-scoped conversational assistant with full context.',
    icon: MessageSquare,
    href: '/chat',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'design',
    title: 'Design',
    description: 'Product blueprints, architecture docs, process flows, wireframes.',
    icon: Palette,
    href: '/design',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  {
    id: 'plan',
    title: 'Plan',
    description: 'Epics, user stories, task breakdown, and sprint planning.',
    icon: Map,
    href: '/planning',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    id: 'build',
    title: 'Build',
    description: 'Agent execution, CI/CD pipelines, deployment to GCP.',
    icon: Hammer,
    href: '/build',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
];

const QUICK_LINKS = [
  { label: 'Document Builder', href: '/design/create', icon: PenTool, color: 'text-sky-600' },
  { label: 'Blueprints', href: '/design/blueprints', icon: PenTool, color: 'text-sky-600' },
  { label: 'Process Flows', href: '/design/flows', icon: Workflow, color: 'text-sky-600' },
  { label: 'Epics & Stories', href: '/planning/epics', icon: FolderKanban, color: 'text-amber-600' },
  { label: 'Task Board', href: '/tasks', icon: ListChecks, color: 'text-amber-600' },
  { label: 'Agents', href: '/agents', icon: Bot, color: 'text-green-600' },
  { label: 'Analytics', href: '/build/analytics', icon: BarChart3, color: 'text-green-600' },
  { label: 'GCP Setup', href: '/setup', icon: Cloud, color: 'text-purple-600' },
  { label: 'Configuration', href: '/setup/config', icon: Settings, color: 'text-purple-600' },
  { label: 'Docs', href: '/docs', icon: FileText, color: 'text-slate-600' },
];

const GCP_SERVICES = [
  { name: 'Cloud Run', desc: 'Serverless containers' },
  { name: 'Cloud SQL', desc: 'Managed PostgreSQL' },
  { name: 'Firebase Auth', desc: 'Authentication' },
  { name: 'Firebase Hosting', desc: 'CDN-backed hosting' },
  { name: 'Secret Manager', desc: 'Secrets vault' },
  { name: 'Cloud Build', desc: 'CI/CD pipelines' },
  { name: 'Cloud Functions', desc: 'Event-driven compute' },
  { name: 'Artifact Registry', desc: 'Container images' },
];

export default function DashboardPage() {
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch('/api/project').then(r => r.json()).then(setProject).catch(() => {});
    fetch('/api/tasks').then(r => r.json()).then(d => setTasks(d.tasks || [])).catch(() => {});
  }, []);

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const doneCount = tasks.filter(t => ['done', 'completed'].includes(t.status)).length;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="rounded-2xl p-6 bv-gradient-bg border border-[rgba(30,82,241,0.1)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://storage.googleapis.com/bv-presto-prod-website-public/00000000-0000-0000-0000-000000000000-logo.png"
              alt="BlueVector AI"
              className="h-12 w-12 rounded-xl object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1e52f1' }}>
                {project?.name || 'BlueVector.AI'}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Google Cloud-Focused Consultancy — Empowering Innovation
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Cloud className="h-3 w-3" />
              Google Cloud Partner
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Bot className="h-3 w-3" />
              {project?.agentCount || 52} Agents
            </Badge>
          </div>
        </div>
      </div>

      {/* Capabilities — equal access, no sequence */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Capabilities</h2>
        <div className="grid gap-4 lg:grid-cols-4">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <Link key={cap.id} href={cap.href}>
                <Card className={`hover:shadow-md transition-all cursor-pointer border-l-4 ${cap.borderColor} h-full`}>
                  <CardHeader className="pb-2">
                    <div className={`h-8 w-8 rounded-lg ${cap.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${cap.color}`} />
                    </div>
                    <CardTitle className="text-base mt-2">{cap.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cap.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Links + Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Links */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardContent className="flex items-center gap-3 py-3">
                      <Icon className={`h-4 w-4 ${link.color}`} />
                      <span className="text-sm font-medium">{link.label}</span>
                      <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Project Stats */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Project Stats</h2>
          <div className="space-y-3">
            <Card>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Agents</span>
                </div>
                <span className="text-2xl font-bold">{project?.agentCount || 52}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">Tasks</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{tasks.length}</span>
                  {tasks.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {todoCount} todo / {inProgressCount} active / {doneCount} done
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-600" />
                  <span className="text-sm font-medium">Docs</span>
                </div>
                <span className="text-2xl font-bold">{project?.docsCount || 0}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">GCP Services</span>
                </div>
                <span className="text-2xl font-bold">{GCP_SERVICES.length}</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* GCP Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">GCP Service Stack</h2>
          <Link href="/setup">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              Configure <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GCP_SERVICES.map((service) => (
            <Card key={service.name} className="hover:bg-accent/30 transition-colors">
              <CardContent className="py-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Cloud className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* MCP Ecosystem */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">MCP Ecosystem</p>
              <p className="text-xs text-muted-foreground">
                24 MCP servers across 10 tiers — Context7, Stitch, GitHub, Firebase, Sentry, E2B, and more
              </p>
            </div>
            <Link href="/setup/config">
              <Button variant="outline" size="sm" className="text-xs">
                View Configuration
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
